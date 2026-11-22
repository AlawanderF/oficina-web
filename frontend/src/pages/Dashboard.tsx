import {
  Alert,
  Anchor,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconCar,
  IconCash,
  IconClipboardList,
  IconHourglass,
  IconReceipt,
  IconUsers,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import type { Icon as TablerIcon } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { STATUS_ORDEM, STATUS_ORDEM_LABEL } from "shared";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { COR_STATUS } from "../lib/status";
import { formatarData, formatarMoeda, formatarPlaca } from "../lib/formatos";
import { clientesApi, mecanicosApi, ordensApi, veiculosApi } from "../services/api";
import { errosDaApi } from "../services/erros";
import { usuarioAtual } from "../services/sessao";
import type { Cliente, Mecanico, OrdemServico, Veiculo } from "../services/types";

interface Dados {
  ordens: OrdemServico[];
  clientes: Cliente[];
  veiculos: Veiculo[];
  mecanicos: Mecanico[];
}

function Kpi(props: { titulo: string; valor: string; detalhe: string; icon: TablerIcon; cor: string }) {
  const { titulo, valor, detalhe, icon: Icon, cor } = props;
  return (
    <Paper p="lg" shadow="xs">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={4}>
          <Text size="xs" c="dimmed" fw={600} tt="uppercase" style={{ letterSpacing: "0.04em" }}>
            {titulo}
          </Text>
          <Text fz={26} fw={700} lh={1.2}>
            {valor}
          </Text>
          <Text size="xs" c="dimmed">
            {detalhe}
          </Text>
        </Stack>
        <ThemeIcon size={44} radius="md" variant="light" color={cor}>
          <Icon size={22} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}

export default function Dashboard() {
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    Promise.all([ordensApi.listar(), clientesApi.listar(), veiculosApi.listar(), mecanicosApi.listar()])
      .then(([ordens, clientes, veiculos, mecanicos]) => setDados({ ordens, clientes, veiculos, mecanicos }))
      .catch((e) => setErro(errosDaApi(e).mensagem));
  }, []);

  // Indicadores calculados a partir das listas
  const indicadores = useMemo(() => {
    if (!dados) return null;
    const { ordens } = dados;
    const porStatus = Object.fromEntries(
      STATUS_ORDEM.map((s) => [s, ordens.filter((o) => o.status === s).length]),
    ) as Record<(typeof STATUS_ORDEM)[number], number>;
    const concluidas = ordens.filter((o) => o.status === "CONCLUIDA");
    const faturamento = concluidas.reduce((soma, o) => soma + Number(o.valor), 0);
    const emAberto = ordens
      .filter((o) => o.status === "ABERTA" || o.status === "EM_ANDAMENTO")
      .reduce((soma, o) => soma + Number(o.valor), 0);
    const cargaPorMecanico = dados.mecanicos
      .map((m) => ({
        mecanico: m,
        ativas: ordens.filter(
          (o) => o.mecanicoId === m.id && (o.status === "ABERTA" || o.status === "EM_ANDAMENTO"),
        ).length,
      }))
      .sort((a, b) => b.ativas - a.ativas);
    return {
      porStatus,
      faturamento,
      emAberto,
      ticketMedio: concluidas.length ? faturamento / concluidas.length : 0,
      ativas: porStatus.ABERTA + porStatus.EM_ANDAMENTO,
      recentes: ordens.slice(0, 6),
      cargaPorMecanico,
    };
  }, [dados]);

  const primeiroNome = usuarioAtual()?.nome.split(" ")[0] ?? "";

  if (erro) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />} title="Não foi possível carregar o painel">
        {erro}
      </Alert>
    );
  }

  return (
    <>
      <PageHeader titulo={`Olá, ${primeiroNome}`} descricao="Resumo da operação da oficina." />

      {!dados || !indicadores ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} h={112} radius="md" />
          ))}
        </SimpleGrid>
      ) : (
        <Stack gap="lg">
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <Kpi
              titulo="OS em execução"
              valor={String(indicadores.ativas)}
              detalhe={`${indicadores.porStatus.ABERTA} abertas · ${indicadores.porStatus.EM_ANDAMENTO} em andamento`}
              icon={IconHourglass}
              cor="yellow"
            />
            <Kpi
              titulo="Faturamento"
              valor={formatarMoeda(indicadores.faturamento)}
              detalhe={`${indicadores.porStatus.CONCLUIDA} OS concluídas`}
              icon={IconCash}
              cor="teal"
            />
            <Kpi
              titulo="Ticket médio"
              valor={formatarMoeda(indicadores.ticketMedio)}
              detalhe={`${formatarMoeda(indicadores.emAberto)} a faturar`}
              icon={IconReceipt}
              cor="brand"
            />
            <Kpi
              titulo="Carteira"
              valor={`${dados.clientes.length} clientes`}
              detalhe={`${dados.veiculos.length} veículos · ${dados.mecanicos.length} mecânicos`}
              icon={IconUsers}
              cor="grape"
            />
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, lg: 3 }}>
            <Paper p="lg" shadow="xs" style={{ gridColumn: "span 2" }}>
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <IconClipboardList size={20} />
                  <Title order={4}>Ordens recentes</Title>
                </Group>
                <Anchor component={Link} to="/ordens-servico" size="sm" fw={600}>
                  Ver todas
                </Anchor>
              </Group>
              <Table.ScrollContainer minWidth={560}>
                <Table className="data-table">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Nº</Table.Th>
                      <Table.Th>Veículo</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th ta="right">Valor</Table.Th>
                      <Table.Th>Abertura</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {indicadores.recentes.map((o) => (
                      <Table.Tr key={o.id}>
                        <Table.Td className="mono" c="dimmed">
                          #{String(o.id).padStart(4, "0")}
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={600}>
                            {formatarPlaca(o.veiculo.placa)} · {o.veiculo.modelo}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {o.veiculo.cliente.nome}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <StatusBadge status={o.status} />
                        </Table.Td>
                        <Table.Td ta="right" fw={600}>
                          {formatarMoeda(o.valor)}
                        </Table.Td>
                        <Table.Td>{formatarData(o.dataAbertura)}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Paper>

            <Stack gap="lg">
              <Paper p="lg" shadow="xs">
                <Title order={4} mb="md">
                  OS por status
                </Title>
                <Stack gap="sm">
                  {STATUS_ORDEM.map((s) => {
                    const qtd = indicadores.porStatus[s];
                    const pct = dados.ordens.length ? (qtd / dados.ordens.length) * 100 : 0;
                    return (
                      <div key={s}>
                        <Group justify="space-between" mb={4}>
                          <Text size="sm">{STATUS_ORDEM_LABEL[s]}</Text>
                          <Text size="sm" fw={600}>
                            {qtd}
                          </Text>
                        </Group>
                        <Progress value={pct} color={COR_STATUS[s]} size="sm" radius="xl" />
                      </div>
                    );
                  })}
                </Stack>
              </Paper>

              <Paper p="lg" shadow="xs">
                <Group gap="xs" mb="md">
                  <IconCar size={20} />
                  <Title order={4}>Carga da equipe</Title>
                </Group>
                <Stack gap="xs">
                  {indicadores.cargaPorMecanico.map(({ mecanico, ativas }) => (
                    <Group key={mecanico.id} justify="space-between" wrap="nowrap">
                      <div>
                        <Text size="sm" fw={600}>
                          {mecanico.nome}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {mecanico.especialidade}
                        </Text>
                      </div>
                      <Text size="sm" c={ativas ? undefined : "dimmed"} style={{ whiteSpace: "nowrap" }}>
                        {ativas} OS ativa(s)
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            </Stack>
          </SimpleGrid>
        </Stack>
      )}
    </>
  );
}
