import { Box, Center, Group, List, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconChartBar, IconClipboardList, IconShieldCheck, IconTool } from "@tabler/icons-react";
import type { ReactNode } from "react";

interface Props {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
}

/** Layout das telas públicas: painel institucional à esquerda e formulário à direita. */
export default function AuthLayout({ titulo, subtitulo, children }: Props) {
  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0} mih="100vh">
      <Box className="auth-hero" visibleFrom="md" p={56}>
        <Stack h="100%" justify="space-between">
          <Group gap="sm">
            <ThemeIcon size={40} radius="md" variant="gradient" gradient={{ from: "brand.5", to: "cyan.5" }}>
              <IconTool size={22} />
            </ThemeIcon>
            <Text fw={700} fz="xl" c="white">
              AutoGestor
            </Text>
          </Group>

          <Stack gap="lg" maw={460}>
            <Title order={1} c="white" fz={38} lh={1.15}>
              Gestão completa da sua oficina em um só lugar.
            </Title>
            <Text c="#94a3b8" fz="lg">
              Clientes, veículos, equipe técnica e ordens de serviço integrados, com indicadores em tempo
              real.
            </Text>
            <List
              spacing="sm"
              c="#cbd5e1"
              icon={
                <ThemeIcon size={26} radius="xl" color="brand" variant="light">
                  <IconClipboardList size={15} />
                </ThemeIcon>
              }
            >
              <List.Item>Ordens de serviço com status e faturamento</List.Item>
              <List.Item
                icon={
                  <ThemeIcon size={26} radius="xl" color="brand" variant="light">
                    <IconChartBar size={15} />
                  </ThemeIcon>
                }
              >
                Painel com indicadores da operação
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon size={26} radius="xl" color="brand" variant="light">
                    <IconShieldCheck size={15} />
                  </ThemeIcon>
                }
              >
                Acesso autenticado e senhas criptografadas
              </List.Item>
            </List>
          </Stack>

          <Text size="xs" c="#64748b">
            © {new Date().getFullYear()} AutoGestor · Projeto acadêmico de Desenvolvimento Web
          </Text>
        </Stack>
      </Box>

      <Center p="lg">
        <Paper w="100%" maw={420} p="xl" withBorder={false} bg="transparent">
          <Stack gap={4} mb="xl">
            <Title order={2}>{titulo}</Title>
            <Text c="dimmed" size="sm">
              {subtitulo}
            </Text>
          </Stack>
          {children}
        </Paper>
      </Center>
    </SimpleGrid>
  );
}
