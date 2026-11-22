import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  Menu,
  ScrollArea,
  Text,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  type Icon,
  IconCar,
  IconChevronDown,
  IconChevronRight,
  IconClipboardList,
  IconLayoutDashboard,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconLogout,
  IconMoon,
  IconSun,
  IconUserCog,
  IconUsers,
} from "@tabler/icons-react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { encerrarSessao, estaAutenticado, usuarioAtual } from "../services/sessao";
import Marca from "./Marca";

interface ItemMenu {
  to: string;
  label: string;
  icon: Icon;
}

const secoes: { titulo: string; itens: ItemMenu[] }[] = [
  { titulo: "Visão geral", itens: [{ to: "/", label: "Painel", icon: IconLayoutDashboard }] },
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

const LARGURA_ABERTO = 240;
const LARGURA_RECOLHIDO = 68;

const iniciais = (nome = "") =>
  nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

function LinkMenu({
  item,
  ativo,
  recolhido,
  onNavegar,
}: {
  item: ItemMenu;
  ativo: boolean;
  recolhido: boolean;
  onNavegar: () => void;
}) {
  const { to, label, icon: Icone } = item;
  const link = (
    <UnstyledButton
      component={Link}
      to={to}
      className="nav-item"
      data-active={ativo || undefined}
      data-collapsed={recolhido || undefined}
      aria-current={ativo ? "page" : undefined}
      aria-label={recolhido ? label : undefined}
      onClick={onNavegar}
    >
      <Icone size={20} stroke={1.6} />
      {!recolhido && <span>{label}</span>}
    </UnstyledButton>
  );
  // Recolhido: o nome aparece num tooltip ao passar o mouse
  return recolhido ? (
    <Tooltip label={label} position="right" offset={14} openDelay={0}>
      {link}
    </Tooltip>
  ) : (
    link
  );
}

export default function AppLayout() {
  const [menuMobile, { toggle: alternarMobile, close: fecharMobile }] = useDisclosure();
  // Preferência lembrada entre visitas (localStorage)
  const [recolhido, setRecolhido] = useLocalStorage({ key: "oficina.menuRecolhido", defaultValue: false });
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setColorScheme } = useMantineColorScheme();
  const esquema = useComputedColorScheme("light");

  if (!estaAutenticado()) return <Navigate to="/login" replace />;
  const usuario = usuarioAtual();
  // Trilha do cabeçalho: "Cadastros › Clientes"
  const secaoAtual = secoes.find((s) => s.itens.some((i) => i.to === pathname));
  const paginaAtual = secaoAtual?.itens.find((i) => i.to === pathname)?.label ?? "";

  function sair() {
    encerrarSessao();
    navigate("/login", { replace: true });
  }

  return (
    <AppShell
      layout="alt"
      header={{ height: 56 }}
      navbar={{
        width: { base: LARGURA_ABERTO, sm: recolhido ? LARGURA_RECOLHIDO : LARGURA_ABERTO },
        breakpoint: "sm",
        collapsed: { mobile: !menuMobile },
      }}
      padding={{ base: "md", md: "xl" }}
      transitionDuration={180}
    >
      <AppShell.Header className="app-header">
        <Group h="100%" px={{ base: "md", md: "xl" }} justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Burger
              opened={menuMobile}
              onClick={alternarMobile}
              hiddenFrom="sm"
              size="sm"
              aria-label="Abrir menu"
            />
            <Tooltip label={recolhido ? "Expandir menu" : "Recolher menu"}>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                visibleFrom="sm"
                onClick={() => setRecolhido((r) => !r)}
                aria-label={recolhido ? "Expandir menu lateral" : "Recolher menu lateral"}
                aria-expanded={!recolhido}
              >
                {recolhido ? (
                  <IconLayoutSidebarLeftExpand size={20} />
                ) : (
                  <IconLayoutSidebarLeftCollapse size={20} />
                )}
              </ActionIcon>
            </Tooltip>
            <Group gap={6} wrap="nowrap" component="nav" aria-label="Você está em">
              <Text size="sm" c="dimmed" visibleFrom="xs">
                {secaoAtual?.titulo}
              </Text>
              <IconChevronRight size={14} color="var(--mantine-color-dimmed)" className="trilha-seta" />
              <Text size="sm" fw={600}>
                {paginaAtual}
              </Text>
            </Group>
          </Group>

          <Group gap={6} wrap="nowrap">
            <Tooltip label={esquema === "dark" ? "Tema claro" : "Tema escuro"}>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                aria-label="Alternar tema"
                onClick={() => setColorScheme(esquema === "dark" ? "light" : "dark")}
              >
                {esquema === "dark" ? <IconSun size={19} /> : <IconMoon size={19} />}
              </ActionIcon>
            </Tooltip>

            <Menu position="bottom-end" width={230} shadow="md" radius="md">
              <Menu.Target>
                <UnstyledButton aria-label="Menu do usuário" px={6} py={4} style={{ borderRadius: 4 }}>
                  <Group gap={10} wrap="nowrap">
                    <Avatar color="destaque" variant="filled" radius="sm" size={30} fz="xs">
                      {iniciais(usuario?.nome)}
                    </Avatar>
                    <Box visibleFrom="sm" maw={180}>
                      <Text size="sm" fw={600} lh={1.2} truncate>
                        {usuario?.nome}
                      </Text>
                      <Text size="xs" c="dimmed" lh={1.2} truncate>
                        {usuario?.email}
                      </Text>
                    </Box>
                    <IconChevronDown size={14} color="var(--mantine-color-dimmed)" />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>{usuario?.email}</Menu.Label>
                <Menu.Item color="red" leftSection={<IconLogout size={16} />} onClick={sair}>
                  Sair do sistema
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className="sidebar">
        <Group
          className="sidebar-topo"
          px={recolhido ? 0 : "md"}
          justify={recolhido ? "center" : "space-between"}
          wrap="nowrap"
        >
          <Link to="/" style={{ textDecoration: "none" }} aria-label="AutoGestor: ir para o painel">
            <Marca compacta={recolhido} />
          </Link>
          <Burger
            opened
            onClick={fecharMobile}
            hiddenFrom="sm"
            size="sm"
            color="white"
            aria-label="Fechar menu"
          />
        </Group>

        <ScrollArea flex={1} px={recolhido ? 8 : 12} scrollbarSize={6}>
          {secoes.map((secao, i) => (
            <Box key={secao.titulo}>
              {recolhido ? (
                i > 0 && <div className="sidebar-divisor" />
              ) : (
                <div className="sidebar-secao">{secao.titulo}</div>
              )}
              {recolhido && i === 0 && <Box h={12} />}
              {secao.itens.map((item) => (
                <LinkMenu
                  key={item.to}
                  item={item}
                  ativo={pathname === item.to}
                  recolhido={recolhido}
                  onNavegar={fecharMobile}
                />
              ))}
            </Box>
          ))}
        </ScrollArea>

        {!recolhido && (
          <Box className="sidebar-rodape" px="md" py={12}>
            <Text size="xs" c="var(--sidebar-texto-fraco)">
              AutoGestor v1.0
            </Text>
          </Box>
        )}
      </AppShell.Navbar>

      <AppShell.Main className="app-main">
        <Box maw={1360} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
