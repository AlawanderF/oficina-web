import { Alert, Button, Group, Modal, Stack, Table, TextInput, Title } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { autorSchema } from "shared";
import ConfirmarRemocao from "../components/ConfirmarRemocao";
import { autoresApi } from "../services/api";
import { Erros, erroApi, zodErros } from "../services/erros";
import type { Autor } from "../services/types";

const vazio = { nome: "", nacionalidade: "" };

export default function Autores() {
  const [lista, setLista] = useState<Autor[]>([]);
  const [aviso, setAviso] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Autor | null>(null);
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [removendo, setRemovendo] = useState<Autor | null>(null);

  async function carregar() {
    try {
      setLista(await autoresApi.listar());
    } catch (err) {
      setAviso(erroApi(err).message);
    }
  }
  useEffect(() => {
    carregar();
  }, []);

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setErros({});
    setModal(true);
  }
  function abrirEdicao(a: Autor) {
    setEditando(a);
    setForm({ nome: a.nome, nacionalidade: a.nacionalidade });
    setErros({});
    setModal(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const resultado = autorSchema.safeParse(form);
    if (!resultado.success) return setErros(zodErros(resultado.error));
    try {
      if (editando) await autoresApi.atualizar(editando.id, resultado.data);
      else await autoresApi.criar(resultado.data);
      setModal(false);
      setAviso("");
      carregar();
    } catch (err) {
      const { message, campos } = erroApi(err);
      setErros({ ...campos, geral: message });
    }
  }

  async function remover() {
    if (!removendo) return;
    try {
      await autoresApi.remover(removendo.id);
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
        <Title order={2}>Autores</Title>
        <Button onClick={abrirNovo}>Novo autor</Button>
      </Group>
      {aviso && <Alert color="red" mb="md" withCloseButton onClose={() => setAviso("")}>{aviso}</Alert>}

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Nacionalidade</Table.Th>
            <Table.Th w={200}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lista.map((a) => (
            <Table.Tr key={a.id}>
              <Table.Td>{a.nome}</Table.Td>
              <Table.Td>{a.nacionalidade}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light" onClick={() => abrirEdicao(a)}>Editar</Button>
                  <Button size="xs" variant="light" color="red" onClick={() => setRemovendo(a)}>Remover</Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* mesmo modal para criar e editar */}
      <Modal opened={modal} onClose={() => setModal(false)} title={editando ? "Editar autor" : "Novo autor"}>
        <form onSubmit={salvar}>
          <Stack>
            {erros.geral && <Alert color="red">{erros.geral}</Alert>}
            <TextInput label="Nome" value={form.nome} error={erros.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <TextInput label="Nacionalidade" value={form.nacionalidade} error={erros.nacionalidade}
              onChange={(e) => setForm({ ...form, nacionalidade: e.target.value })} />
            <Button type="submit">Salvar</Button>
          </Stack>
        </form>
      </Modal>

      <ConfirmarRemocao aberto={!!removendo} texto={`o autor "${removendo?.nome}"`}
        onConfirmar={remover} onCancelar={() => setRemovendo(null)} />
    </>
  );
}
