import { Button, NumberInput, Select, SimpleGrid, Stack, Table, Text, TextInput } from "@mantine/core";
import Placa from "../components/Placa";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { veiculoSchema } from "shared";
import ConfirmarRemocao from "../components/ConfirmarRemocao";
import DataPanel from "../components/DataPanel";
import FormModal from "../components/FormModal";
import PageHeader from "../components/PageHeader";
import RowActions from "../components/RowActions";
import { useCrud } from "../hooks/useCrud";
import { contem, formatarCpf, formatarPlaca, mascararPlaca } from "../lib/formatos";
import { clientesApi, veiculosApi } from "../services/api";
import type { Cliente, Veiculo } from "../services/types";

interface FormVeiculo {
  placa: string;
  marca: string;
  modelo: string;
  ano: number | string;
  clienteId: string | null;
}

const formVazio: FormVeiculo = { placa: "", marca: "", modelo: "", ano: "", clienteId: null };

export default function Veiculos() {
  const crud = useCrud({
    api: veiculosApi,
    schema: veiculoSchema,
    formVazio,
    nome: "Veículo",
    paraForm: (v: Veiculo): FormVeiculo => ({
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      ano: v.ano,
      clienteId: String(v.clienteId),
    }),
    // Select trabalha com texto; a API espera números
    paraEntrada: (f: FormVeiculo) => ({
      ...f,
      ano: f.ano === "" ? undefined : Number(f.ano),
      clienteId: f.clienteId ? Number(f.clienteId) : undefined,
    }),
  });

  // Opções do select de cliente vêm da API (nunca se digita o id)
  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => {
    clientesApi
      .listar()
      .then(setClientes)
      .catch(() => setClientes([]));
  }, [crud.modalAberto]);

  const [busca, setBusca] = useState("");
  const filtrados = crud.registros.filter((v) =>
    contem([v.placa, formatarPlaca(v.placa), v.marca, v.modelo, v.ano, v.cliente.nome], busca),
  );
  const { form, erros, alterar } = crud;

  return (
    <>
      <PageHeader
        titulo="Veículos"
        descricao="Frota de veículos dos clientes."
        acoes={
          <Button leftSection={<IconPlus size={18} />} onClick={crud.abrirNovo}>
            Novo veículo
          </Button>
        }
      />

      <DataPanel
        busca={busca}
        onBusca={setBusca}
        placeholderBusca="Buscar por placa, marca, modelo ou proprietário"
        carregando={crud.carregando}
        erro={crud.erroLista}
        onTentarNovamente={crud.recarregar}
        exibindo={filtrados.length}
        total={crud.registros.length}
        cabecalho={
          <Table.Tr>
            <Table.Th>Placa</Table.Th>
            <Table.Th>Veículo</Table.Th>
            <Table.Th>Ano</Table.Th>
            <Table.Th>Proprietário</Table.Th>
            <Table.Th w={90} />
          </Table.Tr>
        }
      >
        {filtrados.map((v) => (
          <Table.Tr key={v.id}>
            <Table.Td>
              <Placa placa={v.placa} />
            </Table.Td>
            <Table.Td>
              <Text fw={600} size="sm">
                {v.modelo}
              </Text>
              <Text size="xs" c="dimmed">
                {v.marca}
              </Text>
            </Table.Td>
            <Table.Td>{v.ano}</Table.Td>
            <Table.Td>
              <Stack gap={0}>
                <Text size="sm">{v.cliente.nome}</Text>
                <Text size="xs" c="dimmed" className="mono">
                  {formatarCpf(v.cliente.cpf)}
                </Text>
              </Stack>
            </Table.Td>
            <Table.Td>
              <RowActions onEditar={() => crud.abrirEdicao(v)} onRemover={() => crud.pedirRemocao(v)} />
            </Table.Td>
          </Table.Tr>
        ))}
      </DataPanel>

      <FormModal
        aberto={crud.modalAberto}
        titulo={crud.editando ? "Editar veículo" : "Novo veículo"}
        erroGeral={erros.geral}
        salvando={crud.salvando}
        onFechar={crud.fecharModal}
        onSalvar={crud.salvar}
      >
        <Select
          label="Proprietário"
          withAsterisk
          placeholder="Selecione o cliente"
          searchable
          nothingFoundMessage="Nenhum cliente encontrado"
          data={clientes.map((c) => ({ value: String(c.id), label: `${c.nome} · ${formatarCpf(c.cpf)}` }))}
          value={form.clienteId}
          error={erros.clienteId}
          onChange={(v) => alterar("clienteId", v)}
        />
        <SimpleGrid cols={{ base: 1, xs: 2 }}>
          <TextInput
            label="Placa"
            withAsterisk
            placeholder="ABC1D23"
            value={form.placa}
            error={erros.placa}
            onChange={(e) => alterar("placa", mascararPlaca(e.currentTarget.value))}
            maxLength={8}
          />
          <NumberInput
            label="Ano"
            withAsterisk
            placeholder="2024"
            allowDecimal={false}
            allowNegative={false}
            value={form.ano}
            error={erros.ano}
            onChange={(v) => alterar("ano", v)}
          />
        </SimpleGrid>
        <SimpleGrid cols={{ base: 1, xs: 2 }}>
          <TextInput
            label="Marca"
            withAsterisk
            placeholder="Volkswagen"
            value={form.marca}
            error={erros.marca}
            onChange={(e) => alterar("marca", e.currentTarget.value)}
          />
          <TextInput
            label="Modelo"
            withAsterisk
            placeholder="Gol 1.6"
            value={form.modelo}
            error={erros.modelo}
            onChange={(e) => alterar("modelo", e.currentTarget.value)}
          />
        </SimpleGrid>
      </FormModal>

      <ConfirmarRemocao
        aberto={!!crud.removendo}
        descricao={`o veículo ${crud.removendo ? formatarPlaca(crud.removendo.placa) : ""}`}
        carregando={crud.confirmandoRemocao}
        onConfirmar={crud.confirmarRemocao}
        onCancelar={crud.cancelarRemocao}
      />
    </>
  );
}
