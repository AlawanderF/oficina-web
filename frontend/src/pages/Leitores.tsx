import { Alert, Button, Group, Modal, Stack, Table, TextInput, Title } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { leitorSchema } from "shared";
import ConfirmarRemocao from "../components/ConfirmarRemocao";
import { leitoresApi } from "../services/api";
import { Erros, erroApi, zodErros } from "../services/erros";
import type { Leitor } from "../services/types";

const vazio = { nome: "", email: "", cpf: "" };

export default function Leitores() {
  const [lista, setLista] = useState<Leitor[]>([]);
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Leitor | null>(null);
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [removendo, setRemovendo] = useState<Leitor | null>(null);

  async function carregar() {
    try {
      setLista(await leitoresApi.listar());
    } catch (err) {
      setAviso(erroApi(err).message);
    }
  }
  useEffect(() => {
    carregar();
  }, []);

  // busca por texto (nome, e-mail ou CPF) com .filter
  const filtrados = lista.filter((l) =>
    `${l.nome} ${l.email} ${l.cpf}`.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setErros({});
    setModal(true);
  }
  function abrirEdicao(l: Leitor) {
    setEditando(l);
    setForm({ nome: l.nome, email: l.email, cpf: l.cpf });
    setErros({});
    setModal(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const resultado = leitorSchema.safeParse(form);
    if (!resultado.success) return setErros(zodErros(resultado.error));
    try {
      if (editando) await leitoresApi.atualizar(editando.id, resultado.data);
      else await leitoresApi.criar(resultado.data);
      setModal(false);
      setAviso("");
      carregar();
    } catch (err) {
      const { message, campos } = erroApi(err);
      setErros({ ...campos, geral: message }); // ex.: CPF repetido aparece no campo
    }
  }

  async function remover() {
    if (!removendo) return;
    try {
      await leitoresApi.remover(removendo.id);
      setAviso("");
      carregar();
    } catch (err) {
      setAviso(erroApi(err).message);
    }
    setRemovendo(null);
  }

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={2}>Leitores</Title>
        <Button onClick={abrirNovo}>Novo leitor</Button>
      </Group>
      <TextInput placeholder="Buscar por nome, e-mail ou CPF..." mb="md" value={busca}
        onChange={(e) => setBusca(e.target.value)} />
      {aviso && <Alert color="red" mb="md" withCloseButton onClose={() => setAviso("")}>{aviso}</Alert>}

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>E-mail</Table.Th>
            <Table.Th>CPF</Table.Th>
            <Table.Th w={200}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtrados.map((l) => (
            <Table.Tr key={l.id}>
              <Table.Td>{l.nome}</Table.Td>
              <Table.Td>{l.email}</Table.Td>
              <Table.Td>{l.cpf}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light" onClick={() => abrirEdicao(l)}>Editar</Button>
                  <Button size="xs" variant="light" color="red" onClick={() => setRemovendo(l)}>Remover</Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={modal} onClose={() => setModal(false)} title={editando ? "Editar leitor" : "Novo leitor"}>
        <form onSubmit={salvar}>
          <Stack>
            {erros.geral && <Alert color="red">{erros.geral}</Alert>}
            <TextInput label="Nome" value={form.nome} error={erros.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <TextInput label="E-mail" value={form.email} error={erros.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextInput label="CPF (só números)" value={form.cpf} error={erros.cpf}
              onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
            <Button type="submit">Salvar</Button>
          </Stack>
        </form>
      </Modal>

      <ConfirmarRemocao aberto={!!removendo} texto={`o leitor "${removendo?.nome}"`}
        onConfirmar={remover} onCancelar={() => setRemovendo(null)} />
    </>
  );
}
