import { Badge, Button, Table, Text, TextInput, VisuallyHidden } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { mecanicoSchema } from "shared";
import ConfirmarRemocao from "../components/ConfirmarRemocao";
import DataPanel from "../components/DataPanel";
import FormModal from "../components/FormModal";
import PageHeader from "../components/PageHeader";
import RowActions from "../components/RowActions";
import { useCrud } from "../hooks/useCrud";
import { contem, formatarTelefone, mascararTelefone } from "../lib/formatos";
import { mecanicosApi } from "../services/api";
import type { Mecanico } from "../services/types";

const formVazio = { nome: "", especialidade: "", telefone: "" };

export default function Mecanicos() {
  const crud = useCrud({
    api: mecanicosApi,
    schema: mecanicoSchema,
    formVazio,
    nome: "Mecânico",
    paraForm: (m: Mecanico) => ({ nome: m.nome, especialidade: m.especialidade, telefone: m.telefone }),
  });
  const [busca, setBusca] = useState("");

  const filtrados = crud.registros.filter((m) => contem([m.nome, m.especialidade, m.telefone], busca));
  const { form, erros, alterar } = crud;

  return (
    <>
      <PageHeader
        titulo="Mecânicos"
        descricao="Equipe técnica responsável pelas ordens de serviço."
        acoes={
          <Button leftSection={<IconPlus size={18} />} onClick={crud.abrirNovo}>
            Novo mecânico
          </Button>
        }
      />

      <DataPanel
        busca={busca}
        onBusca={setBusca}
        placeholderBusca="Buscar por nome ou especialidade"
        carregando={crud.carregando}
        erro={crud.erroLista}
        onTentarNovamente={crud.recarregar}
        exibindo={filtrados.length}
        total={crud.registros.length}
        larguraMinima={600}
        cabecalho={
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Especialidade</Table.Th>
            <Table.Th>Telefone</Table.Th>
            <Table.Th w={90}>
              <VisuallyHidden>Ações</VisuallyHidden>
            </Table.Th>
          </Table.Tr>
        }
      >
        {filtrados.map((m) => (
          <Table.Tr key={m.id}>
            <Table.Td>
              <Text fw={600} size="sm">
                {m.nome}
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge variant="light" color="gray">
                {m.especialidade}
              </Badge>
            </Table.Td>
            <Table.Td>{formatarTelefone(m.telefone)}</Table.Td>
            <Table.Td>
              <RowActions
                descricao={m.nome}
                onEditar={() => crud.abrirEdicao(m)}
                onRemover={() => crud.pedirRemocao(m)}
              />
            </Table.Td>
          </Table.Tr>
        ))}
      </DataPanel>

      <FormModal
        aberto={crud.modalAberto}
        titulo={crud.editando ? "Editar mecânico" : "Novo mecânico"}
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
        <TextInput
          label="Especialidade"
          withAsterisk
          placeholder="Ex.: Suspensão e freios"
          value={form.especialidade}
          error={erros.especialidade}
          onChange={(e) => alterar("especialidade", e.currentTarget.value)}
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
      </FormModal>

      <ConfirmarRemocao
        aberto={!!crud.removendo}
        descricao={`o mecânico ${crud.removendo?.nome ?? ""}`}
        carregando={crud.confirmandoRemocao}
        onConfirmar={crud.confirmarRemocao}
        onCancelar={crud.cancelarRemocao}
      />
    </>
  );
}
