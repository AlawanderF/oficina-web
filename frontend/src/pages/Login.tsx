import { Alert, Anchor, Button, Card, Container, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "shared";
import { authApi } from "../services/api";
import { salvarSessao } from "../services/auth";
import { Erros, erroApi, zodErros } from "../services/erros";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erros, setErros] = useState<Erros>({});
  const [aviso, setAviso] = useState("");

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setAviso("");
    // 1) valida no navegador com o MESMO schema que a API usa
    const resultado = loginSchema.safeParse(form);
    if (!resultado.success) return setErros(zodErros(resultado.error));
    setErros({});
    // 2) chama a API
    try {
      const { token, usuario } = await authApi.login(resultado.data);
      salvarSessao(token, usuario);
      navigate("/");
    } catch (err) {
      const { message, campos } = erroApi(err);
      setErros(campos);
      setAviso(message);
    }
  }

  return (
    <Container size={420} my={80}>
      <Title ta="center" mb="lg">📚 Biblioteca</Title>
      <Card withBorder p="lg">
        <form onSubmit={entrar}>
          <Stack>
            {aviso && <Alert color="red">{aviso}</Alert>}
            <TextInput label="E-mail" value={form.email} error={erros.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <PasswordInput label="Senha" value={form.senha} error={erros.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })} />
            <Button type="submit">Entrar</Button>
            <Anchor component={Link} to="/cadastro" size="sm" ta="center">Criar conta</Anchor>
          </Stack>
        </form>
      </Card>
    </Container>
  );
}
