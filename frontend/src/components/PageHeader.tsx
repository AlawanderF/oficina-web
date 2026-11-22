import { Group, Stack, Text, Title } from "@mantine/core";
import type { ReactNode } from "react";

interface Props {
  titulo: string;
  descricao?: string;
  acoes?: ReactNode;
}

export default function PageHeader({ titulo, descricao, acoes }: Props) {
  return (
    <Group justify="space-between" align="flex-end" mb="lg" wrap="wrap" gap="md">
      <Stack gap={4}>
        <Title order={1}>{titulo}</Title>
        {descricao && (
          <Text c="dimmed" size="sm">
            {descricao}
          </Text>
        )}
      </Stack>
      {acoes && <Group gap="sm">{acoes}</Group>}
    </Group>
  );
}
