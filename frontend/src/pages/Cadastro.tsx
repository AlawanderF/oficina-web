import { Alert, Anchor, Button, Card, Container, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastroUsuarioSchema } from "shared";
import { authApi } from "../services/api";
import { Erros, erroApi, zodErros } from "../services/erros";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erros, setErros] = useState<Erros>({});
  const [aviso, setAviso] = useState("");

  async function cadastrar(e: FormEvent) {
    e.preventDefault();
    setAviso("");
    const resultado = cadastroUsuarioSchema.safeParse(form);
    if (!resultado.success) return setErros(zodErros(resultado.error));
    setErros({});
    try {
      await authApi.cadastrar(resultado.data);
      navigate("/login");
    } catch (err) {
      const { message, campos } = erroApi(err);
      setErros(campos);
      setAviso(message);
    }
  }

  return (
    <Container size={420} my={80}>
      <Title ta="center" mb="lg">Criar conta</Title>
      <Card withBorder p="lg">
        <form onSubmit={cadastrar}>
          <Stack>
            {aviso && <Alert color="red">{aviso}</Alert>}
            <TextInput label="Nome" value={form.nome} error={erros.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            <TextInput label="E-mail" value={form.email} error={erros.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <PasswordInput label="Senha" value={form.senha} error={erros.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })} />
            <Button type="submit">Cadastrar</Button>
            <Anchor component={Link} to="/login" size="sm" ta="center">Já tenho conta</Anchor>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
