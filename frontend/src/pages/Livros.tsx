import { Alert, Button, Group, Modal, NumberInput, Select, Stack, Table, TextInput, Title } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { livroSchema } from "shared";
import ConfirmarRemocao from "../components/ConfirmarRemocao";
import { autoresApi, livrosApi } from "../services/api";
import { Erros, erroApi, zodErros } from "../services/erros";
import type { Autor, Livro } from "../services/types";

const vazio = { titulo: "", isbn: "", anoPublicacao: "" as number | string, autorId: null as string | null };

export default function Livros() {
  const [lista, setLista] = useState<Livro[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [busca, setBusca] = useState("");
  const [aviso, setAviso] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Livro | null>(null);
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [removendo, setRemovendo] = useState<Livro | null>(null);

  async function carregar() {
    try {
      setLista(await livrosApi.listar());
      setAutores(await autoresApi.listar()); // alimenta o select de autor
    } catch (err) {
      setAviso(erroApi(err).message);
    }
  }
  useEffect(() => {
    carregar();
  }, []);

  // busca por texto (título, ISBN ou autor) com .filter
  const filtrados = lista.filter((l) =>
    `${l.titulo} ${l.isbn} ${l.autor.nome}`.toLowerCase().includes(busca.toLowerCase())
  );

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setErros({});
    setModal(true);
  }
  function abrirEdicao(l: Livro) {
    setEditando(l);
    setForm({ titulo: l.titulo, isbn: l.isbn, anoPublicacao: l.anoPublicacao, autorId: String(l.autorId) });
    setErros({});
    setModal(true);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const resultado = livroSchema.safeParse({
      titulo: form.titulo,
      isbn: form.isbn,
      anoPublicacao: form.anoPublicacao === "" ? undefined : Number(form.anoPublicacao),
      autorId: form.autorId ? Number(form.autorId) : undefined,
    });
    if (!resultado.success) return setErros(zodErros(resultado.error));
    try {
      if (editando) await livrosApi.atualizar(editando.id, resultado.data);
      else await livrosApi.criar(resultado.data);
      setModal(false);
      setAviso("");
      carregar();
    } catch (err) {
      const { message, campos } = erroApi(err);
      setErros({ ...campos, geral: message }); // ex.: ISBN repetido
    }
  }

  async function remover() {
    if (!removendo) return;
    try {
      await livrosApi.remover(removendo.id);
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
        <Title order={2}>Livros</Title>
        <Button onClick={abrirNovo}>Novo livro</Button>
      </Group>
      <TextInput placeholder="Buscar por título, ISBN ou autor..." mb="md" value={busca}
        onChange={(e) => setBusca(e.target.value)} />
      {aviso && <Alert color="red" mb="md" withCloseButton onClose={() => setAviso("")}>{aviso}</Alert>}

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Título</Table.Th>
            <Table.Th>ISBN</Table.Th>
            <Table.Th>Ano</Table.Th>
            <Table.Th>Autor</Table.Th>
            <Table.Th w={200}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filtrados.map((l) => (
            <Table.Tr key={l.id}>
              <Table.Td>{l.titulo}</Table.Td>
              <Table.Td>{l.isbn}</Table.Td>
              <Table.Td>{l.anoPublicacao}</Table.Td>
              <Table.Td>{l.autor.nome}</Table.Td>
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

      <Modal opened={modal} onClose={() => setModal(false)} title={editando ? "Editar livro" : "Novo livro"}>
        <form onSubmit={salvar}>
          <Stack>
            {erros.geral && <Alert color="red">{erros.geral}</Alert>}
            <TextInput label="Título" value={form.titulo} error={erros.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            <TextInput label="ISBN (13 dígitos)" value={form.isbn} error={erros.isbn}
              onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
            <NumberInput label="Ano de publicação" value={form.anoPublicacao} error={erros.anoPublicacao}
              allowDecimal={false} onChange={(v) => setForm({ ...form, anoPublicacao: v })} />
            <Select label="Autor" placeholder="Selecione" searchable value={form.autorId} error={erros.autorId}
              data={autores.map((a) => ({ value: String(a.id), label: a.nome }))}
              onChange={(v) => setForm({ ...form, autorId: v })} />
            <Button type="submit">Salvar</Button>
          </Stack>
        </form>
      </Modal>

      <ConfirmarRemocao aberto={!!removendo} texto={`o livro "${removendo?.titulo}"`}
        onConfirmar={remover} onCancelar={() => setRemovendo(null)} />
    </>
  );
}
