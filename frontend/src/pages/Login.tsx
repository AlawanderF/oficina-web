import { Alert, Anchor, Button, PasswordInput, Stack, Text, TextInput } from "@mantine/core";
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";
import { type FormEvent, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { loginSchema } from "shared";
import AuthLayout from "../components/AuthLayout";
import { authApi } from "../services/api";
import { errosDaApi, errosDoZod, type ErrosCampos } from "../services/erros";
import { estaAutenticado, salvarSessao } from "../services/sessao";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erros, setErros] = useState<ErrosCampos>({});
  const [aviso, setAviso] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (estaAutenticado()) return <Navigate to="/" replace />;

  async function entrar(e: FormEvent) {
    e.preventDefault();
    setAviso("");

    // 1) Valida no navegador com o MESMO schema que a API usa no validarBody
    const resultado = loginSchema.safeParse(form);
    if (!resultado.success) {
      setErros(errosDoZod(resultado.error));
      return;
    }
    setErros({});

    // 2) Envia para a API; em caso de sucesso guarda o token e entra
    setEnviando(true);
    try {
      const { token, usuario } = await authApi.login(resultado.data);
      salvarSessao(token, usuario);
      navigate("/", { replace: true });
    } catch (erro) {
      const { mensagem, campos } = errosDaApi(erro);
      setErros(campos);
      setAviso(mensagem);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout titulo="Entrar" subtitulo="Acesse o painel de gestão da oficina.">
      <form onSubmit={entrar} noValidate>
        <Stack>
          {params.get("cadastrado") && (
            <Alert color="teal" variant="light" icon={<IconInfoCircle size={18} />}>
              Conta criada com sucesso. Faça login para continuar.
            </Alert>
          )}
          {params.get("expirada") && !aviso && (
            <Alert color="yellow" variant="light" icon={<IconInfoCircle size={18} />}>
              Sua sessão expirou. Entre novamente.
            </Alert>
          )}
          {aviso && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              {aviso}
            </Alert>
          )}
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
            placeholder="Sua senha"
            autoComplete="current-password"
            value={form.senha}
            error={erros.senha}
            onChange={(e) => setForm({ ...form, senha: e.currentTarget.value })}
          />
          <Button type="submit" size="md" loading={enviando} fullWidth mt="xs">
            Entrar
          </Button>
          <Text size="sm" ta="center" c="dimmed">
            Não tem conta?{" "}
            <Anchor component={Link} to="/cadastro" fw={600}>
              Criar conta
            </Anchor>
          </Text>
        </Stack>
      </form>
    </AuthLayout>
  );
}
