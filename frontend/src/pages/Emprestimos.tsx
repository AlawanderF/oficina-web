import { Alert, Button, Group, Modal, Select, Stack, Table, TextInput, Title } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { emprestimoSchema } from "shared";
import ConfirmarRemocao from "../components/ConfirmarRemocao";
import { emprestimosApi, leitoresApi, livrosApi } from "../services/api";
import { Erros, erroApi, zodErros } from "../services/erros";
import type { Emprestimo, Leitor, Livro } from "../services/types";

const vazio = { livroId: null as string | null, leitorId: null as string | null, dataEmprestimo: "", dataDevolucao: "" };
const formatar = (d: string | null) => (d ? new Date(d).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—");

export default function Emprestimos() {
  const [lista, setLista] = useState<Emprestimo[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  const [leitores, setLeitores] = useState<Leitor[]>([]);
  const [aviso, setAviso] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Emprestimo | null>(null);
  const [form, setForm] = useState(vazio);
  const [erros, setErros] = useState<Erros>({});
  const [removendo, setRemovendo] = useState<Emprestimo | null>(null);

  async function carregar() {
    try {
      setLista(await emprestimosApi.listar());
      setLivros(await livrosApi.listar()); // selects preenchidos pela API
      setLeitores(await leitoresApi.listar());
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
  function abrirEdicao(e: Emprestimo) {
    setEditando(e);
    setForm({
      livroId: String(e.livroId),
      leitorId: String(e.leitorId),
      dataEmprestimo: e.dataEmprestimo.slice(0, 10),
      dataDevolucao: e.dataDevolucao ? e.dataDevolucao.slice(0, 10) : "",
    });
    setErros({});
    setModal(true);
  }

  async function salvar(ev: FormEvent) {
    ev.preventDefault();
    const resultado = emprestimoSchema.safeParse({
      livroId: form.livroId ? Number(form.livroId) : undefined,
      leitorId: form.leitorId ? Number(form.leitorId) : undefined,
      dataEmprestimo: form.dataEmprestimo,
      dataDevolucao: form.dataDevolucao || null,
    });
    if (!resultado.success) return setErros(zodErros(resultado.error));
    const dados = { ...resultado.data, dataDevolucao: resultado.data.dataDevolucao ?? null };
    try {
      if (editando) await emprestimosApi.atualizar(editando.id, dados);
      else await emprestimosApi.criar(dados);
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
      await emprestimosApi.remover(removendo.id);
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
        <Title order={2}>Empréstimos</Title>
        <Button onClick={abrirNovo}>Novo empréstimo</Button>
      </Group>
      {aviso && <Alert color="red" mb="md" withCloseButton onClose={() => setAviso("")}>{aviso}</Alert>}

      <Table striped withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Livro</Table.Th>
            <Table.Th>Leitor</Table.Th>
            <Table.Th>Empréstimo</Table.Th>
            <Table.Th>Devolução</Table.Th>
            <Table.Th w={200}>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lista.map((e) => (
            <Table.Tr key={e.id}>
              <Table.Td>{e.livro.titulo}</Table.Td>
              <Table.Td>{e.leitor.nome}</Table.Td>
              <Table.Td>{formatar(e.dataEmprestimo)}</Table.Td>
              <Table.Td>{formatar(e.dataDevolucao)}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button size="xs" variant="light" onClick={() => abrirEdicao(e)}>Editar</Button>
                  <Button size="xs" variant="light" color="red" onClick={() => setRemovendo(e)}>Remover</Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal opened={modal} onClose={() => setModal(false)} title={editando ? "Editar empréstimo" : "Novo empréstimo"}>
        <form onSubmit={salvar}>
          <Stack>
            {erros.geral && <Alert color="red">{erros.geral}</Alert>}
            <Select label="Livro" placeholder="Selecione" searchable value={form.livroId} error={erros.livroId}
              data={livros.map((l) => ({ value: String(l.id), label: l.titulo }))}
              onChange={(v) => setForm({ ...form, livroId: v })} />
            <Select label="Leitor" placeholder="Selecione" searchable value={form.leitorId} error={erros.leitorId}
              data={leitores.map((l) => ({ value: String(l.id), label: l.nome }))}
              onChange={(v) => setForm({ ...form, leitorId: v })} />
            <TextInput type="date" label="Data do empréstimo" value={form.dataEmprestimo} error={erros.dataEmprestimo}
              onChange={(e) => setForm({ ...form, dataEmprestimo: e.target.value })} />
            <TextInput type="date" label="Data de devolução (opcional)" value={form.dataDevolucao} error={erros.dataDevolucao}
              onChange={(e) => setForm({ ...form, dataDevolucao: e.target.value })} />
            <Button type="submit">Salvar</Button>
          </Stack>
        </form>
      </Modal>

      <ConfirmarRemocao aberto={!!removendo} texto="este empréstimo"
        onConfirmar={remover} onCancelar={() => setRemovendo(null)} />
    </>
  );
}
