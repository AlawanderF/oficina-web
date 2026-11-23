import { Button, SimpleGrid, Table, Text, TextInput, VisuallyHidden } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { clienteSchema } from "shared";
import ConfirmarRemocao from "../components/ConfirmarRemocao";
import DataPanel from "../components/DataPanel";
import FormModal from "../components/FormModal";
import PageHeader from "../components/PageHeader";
import RowActions from "../components/RowActions";
import { useCrud } from "../hooks/useCrud";
import { contem, formatarCpf, formatarTelefone, mascararCpf, mascararTelefone } from "../lib/formatos";
import { clientesApi } from "../services/api";
import type { Cliente } from "../services/types";

const formVazio = { nome: "", cpf: "", telefone: "", email: "" };

export default function Clientes() {
  const crud = useCrud({
    api: clientesApi,
    schema: clienteSchema,
    formVazio,
    nome: "Cliente",
    paraForm: (c: Cliente) => ({ nome: c.nome, cpf: c.cpf, telefone: c.telefone, email: c.email }),
  });
  const [busca, setBusca] = useState("");

  // Busca por texto com .filter (nome, CPF, e-mail ou telefone)
  const filtrados = crud.registros.filter((c) =>
    contem([c.nome, c.cpf, formatarCpf(c.cpf), c.email, c.telefone], busca),
  );

  const { form, erros, alterar } = crud;

  return (
    <>
      <PageHeader
        titulo="Clientes"
        descricao="Proprietários dos veículos atendidos pela oficina."
        acoes={
          <Button leftSection={<IconPlus size={18} />} onClick={crud.abrirNovo}>
            Novo cliente
          </Button>
        }
      />

      <DataPanel
        busca={busca}
        onBusca={setBusca}
        placeholderBusca="Buscar por nome, CPF, e-mail ou telefone"
        carregando={crud.carregando}
        erro={crud.erroLista}
        onTentarNovamente={crud.recarregar}
        exibindo={filtrados.length}
        total={crud.registros.length}
        cabecalho={
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>CPF</Table.Th>
            <Table.Th>Telefone</Table.Th>
            <Table.Th>E-mail</Table.Th>
            <Table.Th w={90}>
              <VisuallyHidden>Ações</VisuallyHidden>
            </Table.Th>
          </Table.Tr>
        }
      >
        {filtrados.map((c) => (
          <Table.Tr key={c.id}>
            <Table.Td>
              <Text fw={600} size="sm">
                {c.nome}
              </Text>
            </Table.Td>
            <Table.Td className="mono">{formatarCpf(c.cpf)}</Table.Td>
            <Table.Td>{formatarTelefone(c.telefone)}</Table.Td>
            <Table.Td>{c.email}</Table.Td>
            <Table.Td>
              <RowActions
                descricao={c.nome}
                onEditar={() => crud.abrirEdicao(c)}
                onRemover={() => crud.pedirRemocao(c)}
              />
            </Table.Td>
          </Table.Tr>
        ))}
      </DataPanel>

      {/* Mesmo modal para criar e editar */}
      <FormModal
        aberto={crud.modalAberto}
        titulo={crud.editando ? "Editar cliente" : "Novo cliente"}
        erroGeral={erros.geral}
        salvando={crud.salvando}
        onFechar={crud.fecharModal}
        onSalvar={crud.salvar}
      >
        <TextInput
          label="Nome completo"
          withAsterisk
          value={form.nome}
          error={erros.nome}
          onChange={(e) => alterar("nome", e.currentTarget.value)}
          data-autofocus
        />
        <SimpleGrid cols={{ base: 1, xs: 2 }}>
          <TextInput
            label="CPF"
            withAsterisk
            placeholder="000.000.000-00"
            value={form.cpf}
            error={erros.cpf}
            onChange={(e) => alterar("cpf", mascararCpf(e.currentTarget.value))}
            maxLength={14}
          />
          <TextInput
            label="Telefone"
            withAsterisk
            placeholder="(11) 91234-5678"
            value={form.telefone}
            error={erros.telefone}
            onChange={(e) => alterar("telefone", mascararTelefone(e.currentTarget.value))}
            maxLength={15}
          />
        </SimpleGrid>
        <TextInput
          label="E-mail"
          withAsterisk
          placeholder="cliente@email.com"
          value={form.email}
          error={erros.email}
          onChange={(e) => alterar("email", e.currentTarget.value)}
        />
      </FormModal>

      <ConfirmarRemocao
        aberto={!!crud.removendo}
        descricao={`o cliente ${crud.removendo?.nome ?? ""}`}
        carregando={crud.confirmandoRemocao}
        onConfirmar={crud.confirmarRemocao}
        onCancelar={crud.cancelarRemocao}
      />
    </>
  );
}
