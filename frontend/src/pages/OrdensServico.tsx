import {
  Button,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ordemServicoSchema, STATUS_ORDEM, STATUS_ORDEM_LABEL, type StatusOrdem } from "shared";
import ConfirmarRemocao from "../components/ConfirmarRemocao";
import DataPanel from "../components/DataPanel";
import FormModal from "../components/FormModal";
import PageHeader from "../components/PageHeader";
import Placa from "../components/Placa";
import RowActions from "../components/RowActions";
import StatusBadge from "../components/StatusBadge";
import { useCrud } from "../hooks/useCrud";
import { contem, formatarData, formatarMoeda, formatarPlaca, hojeIso, paraInputData } from "../lib/formatos";
import { mecanicosApi, ordensApi, veiculosApi } from "../services/api";
import type { Mecanico, OrdemServico, Veiculo } from "../services/types";

interface FormOrdem {
  veiculoId: string | null;
  mecanicoId: string | null;
  descricao: string;
  status: StatusOrdem;
  valor: number | string;
  dataAbertura: string;
  dataConclusao: string;
}

const novoForm = (): FormOrdem => ({
  veiculoId: null,
  mecanicoId: null,
  descricao: "",
  status: "ABERTA",
  valor: "",
  dataAbertura: hojeIso(),
  dataConclusao: "",
});

const opcoesStatus = STATUS_ORDEM.map((s) => ({ value: s, label: STATUS_ORDEM_LABEL[s] }));

export default function OrdensServico() {
  const crud = useCrud({
    api: ordensApi,
    schema: ordemServicoSchema,
    formVazio: novoForm(),
    nome: "Ordem de serviço",
    paraForm: (o: OrdemServico): FormOrdem => ({
      veiculoId: String(o.veiculoId),
      mecanicoId: String(o.mecanicoId),
      descricao: o.descricao,
      status: o.status,
      valor: Number(o.valor),
      dataAbertura: paraInputData(o.dataAbertura),
      dataConclusao: paraInputData(o.dataConclusao),
    }),
    paraEntrada: (f: FormOrdem) => ({
      ...f,
      veiculoId: f.veiculoId ? Number(f.veiculoId) : undefined,
      mecanicoId: f.mecanicoId ? Number(f.mecanicoId) : undefined,
      valor: f.valor === "" ? undefined : Number(f.valor),
      dataConclusao: f.dataConclusao || null,
    }),
  });

  // Selects alimentados pela API: veículo (com proprietário) e mecânico
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  useEffect(() => {
    Promise.all([veiculosApi.listar(), mecanicosApi.listar()])
      .then(([v, m]) => {
        setVeiculos(v);
        setMecanicos(m);
      })
      .catch(() => undefined);
  }, [crud.modalAberto]);

  // Busca por texto + filtro por status, ambos com .filter
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string | null>(null);
  const filtrados = crud.registros
    .filter((o) => !filtroStatus || o.status === filtroStatus)
    .filter((o) =>
      contem(
        [o.id, o.descricao, o.veiculo.placa, o.veiculo.modelo, o.veiculo.cliente.nome, o.mecanico.nome],
        busca,
      ),
    );

  const { form, erros, alterar } = crud;

  return (
    <>
      <PageHeader
        titulo="Ordens de serviço"
        descricao="Serviços executados nos veículos, com responsável, status e valor."
        acoes={
          <Button leftSection={<IconPlus size={18} />} onClick={crud.abrirNovo}>
            Nova OS
          </Button>
        }
      />

      <DataPanel
        busca={busca}
        onBusca={setBusca}
        placeholderBusca="Buscar por nº, placa, cliente, mecânico ou descrição"
        filtros={
          <Select
            aria-label="Filtrar por status"
            placeholder="Todos os status"
            clearable
            data={opcoesStatus}
            value={filtroStatus}
            onChange={setFiltroStatus}
            w={200}
          />
        }
        carregando={crud.carregando}
        erro={crud.erroLista}
        onTentarNovamente={crud.recarregar}
        exibindo={filtrados.length}
        total={crud.registros.length}
        larguraMinima={980}
        cabecalho={
          <Table.Tr>
            <Table.Th w={70}>Nº</Table.Th>
            <Table.Th>Veículo / Cliente</Table.Th>
            <Table.Th>Serviço</Table.Th>
            <Table.Th>Mecânico</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th ta="right">Valor</Table.Th>
            <Table.Th>Abertura</Table.Th>
            <Table.Th w={90} />
          </Table.Tr>
        }
      >
        {filtrados.map((o) => (
          <Table.Tr key={o.id}>
            <Table.Td className="mono" c="dimmed">
              {String(o.id).padStart(4, "0")}
            </Table.Td>
            <Table.Td>
              <Group gap="sm" wrap="nowrap">
                <Placa placa={o.veiculo.placa} />
                <Stack gap={0}>
                  <Text size="sm" fw={500}>
                    {o.veiculo.modelo}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {o.veiculo.cliente.nome}
                  </Text>
                </Stack>
              </Group>
            </Table.Td>
            <Table.Td maw={280}>
              <Text size="sm" lineClamp={2}>
                {o.descricao}
              </Text>
            </Table.Td>
            <Table.Td>{o.mecanico.nome}</Table.Td>
            <Table.Td>
              <StatusBadge status={o.status} />
            </Table.Td>
            <Table.Td ta="right" fw={600} style={{ whiteSpace: "nowrap" }}>
              {formatarMoeda(o.valor)}
            </Table.Td>
            <Table.Td>{formatarData(o.dataAbertura)}</Table.Td>
            <Table.Td>
              <RowActions onEditar={() => crud.abrirEdicao(o)} onRemover={() => crud.pedirRemocao(o)} />
            </Table.Td>
          </Table.Tr>
        ))}
      </DataPanel>

      <FormModal
        aberto={crud.modalAberto}
        titulo={
          crud.editando ? `Editar OS #${String(crud.editando.id).padStart(4, "0")}` : "Nova ordem de serviço"
        }
        erroGeral={erros.geral}
        salvando={crud.salvando}
        onFechar={crud.fecharModal}
        onSalvar={crud.salvar}
        tamanho="lg"
      >
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Veículo"
            withAsterisk
            placeholder="Selecione o veículo"
            searchable
            nothingFoundMessage="Nenhum veículo encontrado"
            data={veiculos.map((v) => ({
              value: String(v.id),
              label: `${formatarPlaca(v.placa)} · ${v.modelo} (${v.cliente.nome})`,
            }))}
            value={form.veiculoId}
            error={erros.veiculoId}
            onChange={(v) => alterar("veiculoId", v)}
          />
          <Select
            label="Mecânico responsável"
            withAsterisk
            placeholder="Selecione o mecânico"
            searchable
            nothingFoundMessage="Nenhum mecânico encontrado"
            data={mecanicos.map((m) => ({ value: String(m.id), label: `${m.nome} · ${m.especialidade}` }))}
            value={form.mecanicoId}
            error={erros.mecanicoId}
            onChange={(v) => alterar("mecanicoId", v)}
          />
        </SimpleGrid>

        <Textarea
          label="Descrição do serviço"
          withAsterisk
          autosize
          minRows={3}
          placeholder="Ex.: Troca de pastilhas de freio dianteiras"
          value={form.descricao}
          error={erros.descricao}
          onChange={(e) => alterar("descricao", e.currentTarget.value)}
        />

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Status"
            withAsterisk
            allowDeselect={false}
            data={opcoesStatus}
            value={form.status}
            error={erros.status}
            onChange={(v) => v && alterar("status", v as StatusOrdem)}
          />
          <NumberInput
            label="Valor"
            withAsterisk
            prefix="R$ "
            decimalScale={2}
            fixedDecimalScale
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            placeholder="R$ 0,00"
            value={form.valor}
            error={erros.valor}
            onChange={(v) => alterar("valor", v)}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <TextInput
            type="date"
            label="Data de abertura"
            withAsterisk
            value={form.dataAbertura}
            error={erros.dataAbertura}
            onChange={(e) => alterar("dataAbertura", e.currentTarget.value)}
          />
          <TextInput
            type="date"
            label="Data de conclusão"
            description={form.status === "CONCLUIDA" ? "Obrigatória para OS concluída" : "Opcional"}
            value={form.dataConclusao}
            error={erros.dataConclusao}
            onChange={(e) => alterar("dataConclusao", e.currentTarget.value)}
          />
        </SimpleGrid>
      </FormModal>

      <ConfirmarRemocao
        aberto={!!crud.removendo}
        descricao={`a OS #${String(crud.removendo?.id ?? "").padStart(4, "0")}`}
        carregando={crud.confirmandoRemocao}
        onConfirmar={crud.confirmarRemocao}
        onCancelar={crud.cancelarRemocao}
      />
    </>
  );
}
