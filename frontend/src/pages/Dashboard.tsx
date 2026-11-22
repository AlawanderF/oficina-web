import {
  Alert,
  Anchor,
  Grid,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  type Icon,
  IconAlertCircle,
  IconArrowRight,
  IconCar,
  IconCash,
  IconClipboardList,
  IconReceipt,
} from "@tabler/icons-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { STATUS_ORDEM, STATUS_ORDEM_LABEL } from "shared";
import GraficoFaturamento, { type PontoMensal } from "../components/GraficoFaturamento";
import PageHeader from "../components/PageHeader";
import Placa from "../components/Placa";
import StatusBadge from "../components/StatusBadge";
import { formatarData, formatarMoeda } from "../lib/formatos";
import { COR_STATUS } from "../lib/status";
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

const ativa = (o: OrdemServico) => o.status === "ABERTA" || o.status === "EM_ANDAMENTO";
/** "AAAA-MM" de uma data ISO (as datas do banco são dias em UTC) */
const chaveMes = (iso: string) => iso.slice(0, 7);

function Indicador(props: { rotulo: string; valor: string; detalhe: ReactNode; icone: Icon }) {
  const { rotulo, valor, detalhe, icone: Icone } = props;
  return (
    <Paper p="lg">
      <Group justify="space-between" align="flex-start" wrap="nowrap" mb={10}>
        <Text size="sm" c="dimmed" fw={500}>
          {rotulo}
        </Text>
        <Icone size={18} stroke={1.6} color="var(--mantine-color-dimmed)" aria-hidden />
      </Group>
      <Text fz={28} fw={600} lh={1.1} className="num" style={{ letterSpacing: "-0.02em" }}>
        {valor}
      </Text>
      <Text size="xs" c="dimmed" mt={8} className="num">
        {detalhe}
      </Text>
    </Paper>
  );
}

function Cartao({ titulo, acao, children }: { titulo: string; acao?: ReactNode; children: ReactNode }) {
  return (
    <Paper p="lg" h="100%">
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Title order={3}>{titulo}</Title>
        {acao}
      </Group>
      {children}
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

  // Todos os indicadores são calculados a partir dos dados reais da API
  const ind = useMemo(() => {
    if (!dados) return null;
    const { ordens } = dados;
    const porStatus = Object.fromEntries(
      STATUS_ORDEM.map((s) => [s, ordens.filter((o) => o.status === s).length]),
    ) as Record<(typeof STATUS_ORDEM)[number], number>;

    const concluidas = ordens.filter((o) => o.status === "CONCLUIDA");
    const faturamentoTotal = concluidas.reduce((s, o) => s + Number(o.valor), 0);
    const aReceber = ordens.filter(ativa).reduce((s, o) => s + Number(o.valor), 0);

    // Faturamento dos últimos 6 meses (pela data de conclusão)
    const hoje = new Date();
    const meses: PontoMensal[] = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth() - 5 + i, 1));
      const chave = d.toISOString().slice(0, 7);
      const doMes = concluidas.filter((o) => chaveMes(o.dataConclusao ?? o.dataAbertura) === chave);
      return {
        mes: d.toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" }).replace(".", ""),
        mesCompleto: d.toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }),
        valor: doMes.reduce((s, o) => s + Number(o.valor), 0),
        quantidade: doMes.length,
      };
    });
    const mesAtual = meses[meses.length - 1]!;

    const carga = dados.mecanicos
      .map((m) => ({ mecanico: m, ativas: ordens.filter((o) => o.mecanicoId === m.id && ativa(o)).length }))
      .sort((a, b) => b.ativas - a.ativas);
    const maiorCarga = Math.max(1, ...carga.map((c) => c.ativas));

    return {
      porStatus,
      emAberto: porStatus.ABERTA + porStatus.EM_ANDAMENTO,
      faturamentoTotal,
      ticketMedio: concluidas.length ? faturamentoTotal / concluidas.length : 0,
      aReceber,
      meses,
      mesAtual,
      recentes: ordens.slice(0, 6),
      carga,
      maiorCarga,
    };
  }, [dados]);

  const nome = usuarioAtual()?.nome.split(" ")[0] ?? "";
  const hojePorExtenso = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  if (erro) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />} title="Não foi possível carregar o painel">
        {erro}
      </Alert>
    );
  }

  return (
    <>
      <PageHeader titulo="Painel" descricao={`Bem-vindo, ${nome}. Resumo da oficina em ${hojePorExtenso}.`} />

      {!dados || !ind ? (
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} h={118} radius="md" />
            ))}
          </SimpleGrid>
          <Skeleton h={300} radius="md" />
        </Stack>
      ) : (
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
            <Indicador
              rotulo="OS em aberto"
              valor={String(ind.emAberto)}
              detalhe={`${ind.porStatus.ABERTA} aguardando · ${ind.porStatus.EM_ANDAMENTO} em execução`}
              icone={IconClipboardList}
            />
            <Indicador
              rotulo="Faturado no mês"
              valor={formatarMoeda(ind.mesAtual.valor)}
              detalhe={`${ind.mesAtual.quantidade} OS concluída(s) em ${ind.mesAtual.mes}`}
              icone={IconCash}
            />
            <Indicador
              rotulo="A receber"
              valor={formatarMoeda(ind.aReceber)}
              detalhe={`Ticket médio ${formatarMoeda(ind.ticketMedio)}`}
              icone={IconReceipt}
            />
            <Indicador
              rotulo="Veículos cadastrados"
              valor={String(dados.veiculos.length)}
              detalhe={`${dados.clientes.length} clientes · ${dados.mecanicos.length} mecânicos`}
              icone={IconCar}
            />
          </SimpleGrid>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Cartao
                titulo="Faturamento mensal"
                acao={
                  <Text size="sm" c="dimmed" className="num">
                    Total: <b>{formatarMoeda(ind.faturamentoTotal)}</b>
                  </Text>
                }
              >
                <GraficoFaturamento dados={ind.meses} />
              </Cartao>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Cartao titulo="Ordens por status">
                <div className="barra-status" aria-hidden>
                  {STATUS_ORDEM.map((s) => (
                    <div
                      key={s}
                      style={{
                        width: `${dados.ordens.length ? (ind.porStatus[s] / dados.ordens.length) * 100 : 0}%`,
                        background: `var(--mantine-color-${COR_STATUS[s]}-6)`,
                      }}
                    />
                  ))}
                </div>
                <Stack gap={0} mt="md">
                  {STATUS_ORDEM.map((s) => (
                    <Group
                      key={s}
                      justify="space-between"
                      py={10}
                      style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
                    >
                      <Group gap={10}>
                        <span
                          className="ponto"
                          style={{ background: `var(--mantine-color-${COR_STATUS[s]}-6)` }}
                        />
                        <Text size="sm">{STATUS_ORDEM_LABEL[s]}</Text>
                      </Group>
                      <Text size="sm" fw={600} className="num">
                        {ind.porStatus[s]}
                        <Text span c="dimmed" fw={400} size="xs" ml={6}>
                          {dados.ordens.length
                            ? Math.round((ind.porStatus[s] / dados.ordens.length) * 100)
                            : 0}
                          %
                        </Text>
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </Cartao>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 8 }}>
              <Cartao
                titulo="Ordens recentes"
                acao={
                  <Anchor component={Link} to="/ordens-servico" size="sm" fw={500}>
                    <Group gap={4}>
                      Ver todas <IconArrowRight size={14} />
                    </Group>
                  </Anchor>
                }
              >
                <Table.ScrollContainer minWidth={560}>
                  <Table className="data-table" highlightOnHover={false}>
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
                      {ind.recentes.map((o) => (
                        <Table.Tr key={o.id}>
                          <Table.Td className="mono" c="dimmed">
                            {String(o.id).padStart(4, "0")}
                          </Table.Td>
                          <Table.Td>
                            <Group gap="sm" wrap="nowrap">
                              <Placa placa={o.veiculo.placa} />
                              <div>
                                <Text size="sm" fw={500} lh={1.3}>
                                  {o.veiculo.modelo}
                                </Text>
                                <Text size="xs" c="dimmed" lh={1.3}>
                                  {o.veiculo.cliente.nome}
                                </Text>
                              </div>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <StatusBadge status={o.status} />
                          </Table.Td>
                          <Table.Td ta="right" fw={500} className="num" style={{ whiteSpace: "nowrap" }}>
                            {formatarMoeda(o.valor)}
                          </Table.Td>
                          <Table.Td className="num">{formatarData(o.dataAbertura)}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Cartao>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Cartao titulo="Carga da equipe">
                <Stack gap="md">
                  {ind.carga.map(({ mecanico, ativas }) => (
                    <div key={mecanico.id}>
                      <Group justify="space-between" mb={6} wrap="nowrap">
                        <div style={{ minWidth: 0 }}>
                          <Text size="sm" fw={500} truncate>
                            {mecanico.nome}
                          </Text>
                          <Text size="xs" c="dimmed" truncate>
                            {mecanico.especialidade}
                          </Text>
                        </div>
                        <Text size="sm" fw={600} className="num" style={{ whiteSpace: "nowrap" }}>
                          {ativas}{" "}
                          <Text span size="xs" c="dimmed" fw={400}>
                            OS
                          </Text>
                        </Text>
                      </Group>
                      <Progress
                        value={(ativas / ind.maiorCarga) * 100}
                        size="sm"
                        color="destaque"
                        radius="sm"
                      />
                    </div>
                  ))}
                </Stack>
              </Cartao>
            </Grid.Col>
          </Grid>
        </Stack>
      )}
    </>
  );
}
