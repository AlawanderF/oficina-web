import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cadastroUsuarioSchema } from "shared";
import AuthLayout from "../components/AuthLayout";
import { authApi } from "../services/api";
import { errosDaApi, errosDoZod, type ErrosCampos } from "../services/erros";

export default function Cadastro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });
  const [erros, setErros] = useState<ErrosCampos>({});
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function cadastrar(e: FormEvent) {
    e.preventDefault();
    setAviso("");

    const resultado = cadastroUsuarioSchema.safeParse(form);
    if (!resultado.success) {
      setErros(errosDoZod(resultado.error));
      return;
    }
    setErros({});

    setEnviando(true);
    try {
      await authApi.cadastrar(resultado.data);
      navigate("/login?cadastrado=1", { replace: true });
    } catch (erro) {
      const { mensagem, campos } = errosDaApi(erro);
      setErros(campos);
      setAviso(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout titulo="Criar conta" subtitulo="Cadastre-se para acessar o sistema.">
      <form onSubmit={cadastrar} noValidate>
        <Stack>
          {aviso && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              {aviso}
            </Alert>
          )}
          <TextInput
            label="Nome completo"
            placeholder="Seu nome"
            autoComplete="name"
            value={form.nome}
            error={erros.nome}
            onChange={(e) => setForm({ ...form, nome: e.currentTarget.value })}
          />
          <TextInput
            label="E-mail"
            placeholder="voce@empresa.com"
            autoComplete="email"
            value={form.email}
            error={erros.email}
            onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
          />
          <PasswordInput
            label="Senha"
            description="Mínimo de 8 caracteres"
            autoComplete="new-password"
            value={form.senha}
            error={erros.senha}
            onChange={(e) => setForm({ ...form, senha: e.currentTarget.value })}
          />
          <Button type="submit" size="md" loading={enviando} fullWidth mt="xs">
            Criar conta
          </Button>
          <Text size="sm" ta="center" c="dimmed">
            Já tem conta?{" "}
            <Anchor component={Link} to="/login" fw={600}>
              Entrar
            </Anchor>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
