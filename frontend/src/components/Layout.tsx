import { Anchor, AppShell, Button, Group, Text } from "@mantine/core";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { estaLogado, sair, usuarioLogado } from "../services/auth";

const menu = [
  { to: "/", label: "Home" },
  { to: "/autores", label: "Autores" },
  { to: "/livros", label: "Livros" },
  { to: "/leitores", label: "Leitores" },
  { to: "/emprestimos", label: "Empréstimos" },
];

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  if (!estaLogado()) return <Navigate to="/login" replace />;

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="lg">
            <Text fw={700}>📚 Biblioteca</Text>
            {menu.map((m) => (
              <Anchor
                key={m.to}
                component={Link}
                to={m.to}
                fw={pathname === m.to ? 700 : 400}
                underline="never"
              >
                {m.label}
              </Anchor>
            ))}
          </Group>
          <Group>
            <Text size="sm">{usuarioLogado()?.nome}</Text>
            <Button
              size="xs"
              variant="light"
              onClick={() => {
                sair();
                navigate("/login");
              }}
            >
              Sair
            </Button>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
