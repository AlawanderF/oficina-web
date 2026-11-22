import { Paper, Stack, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";
import Marca from "./Marca";

interface Props {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
}

/** Layout das telas públicas (login e cadastro): um cartão centralizado. */
export default function AuthLayout({ titulo, subtitulo, children }: Props) {
  return (
    <main className="auth-fundo">
      <div className="auth-marca">
        <Marca claro={false} />
      </div>

      <Paper w="100%" maw={400} p={{ base: "lg", xs: 32 }} radius="md" shadow="sm">
        <Stack gap={4} mb="lg">
          <Title order={2}>{titulo}</Title>
          <Text c="dimmed" size="sm">
            {subtitulo}
          </Text>
        </Stack>
        {children}
      </Paper>

      <Text size="xs" c="dimmed" mt="xl">
        © {new Date().getFullYear()} AutoGestor · Sistema de gestão para oficinas mecânicas
      </Text>
    </main>
  );
}
