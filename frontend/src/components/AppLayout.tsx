import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCar,
  IconChevronDown,
  IconClipboardList,
  IconLayoutDashboard,
  IconLogout,
  IconMoon,
  IconSun,
  IconTool,
  IconUsers,
  IconUserCog,
} from "@tabler/icons-react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { encerrarSessao, estaAutenticado, usuarioAtual } from "../services/sessao";

const secoes = [
  {
    titulo: "Visão geral",
    itens: [{ to: "/", label: "Painel", icon: IconLayoutDashboard }],
  },
  {
    titulo: "Operação",
    itens: [{ to: "/ordens-servico", label: "Ordens de serviço", icon: IconClipboardList }],
  },
  {
    titulo: "Cadastros",
    itens: [
      { to: "/clientes", label: "Clientes", icon: IconUsers },
      { to: "/veiculos", label: "Veículos", icon: IconCar },
      { to: "/mecanicos", label: "Mecânicos", icon: IconUserCog },
    ],
  },
];

const iniciais = (nome = "") =>
  nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

export default function AppLayout() {
  const [menuAberto, { toggle, close }] = useDisclosure();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const esquema = useComputedColorScheme("light");

  if (!estaAutenticado()) return <Navigate to="/login" replace />;
  const usuario = usuarioAtual();

  function sair() {
    encerrarSessao();
    navigate("/login", { replace: true });
  }

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !menuAberto } }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="lg" justify="space-between">
          <Group gap="sm">
            <Burger opened={menuAberto} onClick={toggle} hiddenFrom="sm" size="sm" aria-label="Abrir menu" />
            <Text fw={600} c="dimmed" size="sm" visibleFrom="sm">
              Sistema de gestão da oficina
            </Text>
          </Group>

          <Group gap="xs">
            <Tooltip label={esquema === "dark" ? "Tema claro" : "Tema escuro"}>
              <ActionIcon
                variant="default"
                size="lg"
                aria-label="Alternar tema"
                onClick={() => setColorScheme(esquema === "dark" ? "light" : "dark")}
              >
                {esquema === "dark" ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>

            <Menu position="bottom-end" width={220} shadow="md">
              <Menu.Target>
                <UnstyledButton aria-label="Menu do usuário">
                  <Group gap={8}>
                    <Avatar color="brand" radius="xl" size={34}>
                      {iniciais(usuario?.nome)}
                    </Avatar>
                    <Box visibleFrom="sm">
                      <Text size="sm" fw={600} lh={1.2}>
                        {usuario?.nome}
                      </Text>
                      <Text size="xs" c="dimmed" lh={1.2}>
                        {usuario?.email}
                      </Text>
                    </Box>
                    <IconChevronDown size={14} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Conta</Menu.Label>
                <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={sair}>
                  Sair
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className="sidebar">
        <Group className="sidebar-brand" px="md" h={60} gap="sm" wrap="nowrap" justify="space-between">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon size={34} radius="md" variant="gradient" gradient={{ from: "brand.5", to: "cyan.5" }}>
              <IconTool size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={700} c="white" lh={1.1}>
                AutoGestor
              </Text>
              <Text size="xs" c="#94a3b8" lh={1.1}>
                Oficina mecânica
              </Text>
            </Box>
          </Group>
          <Burger
            opened={menuAberto}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            color="white"
            aria-label="Fechar menu"
          />
        </Group>

        <ScrollArea flex={1} px="sm">
          {secoes.map((secao) => (
            <Box key={secao.titulo}>
              <div className="sidebar-section">{secao.titulo}</div>
              {secao.itens.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  component={Link}
                  to={to}
                  label={label}
                  className="sidebar-link"
                  leftSection={<Icon size={18} stroke={1.7} />}
                  active={pathname === to}
                  onClick={close}
                />
              ))}
            </Box>
          ))}
        </ScrollArea>

        <Stack className="sidebar-footer" p="md" gap={2}>
          <Text size="xs" c="#64748b">
            v1.0.0 · Projeto acadêmico
          </Text>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className="app-main">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
