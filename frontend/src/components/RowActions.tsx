import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

interface Props {
  onEditar: () => void;
  onRemover: () => void;
}

/** Ações de linha das tabelas (editar / remover). */
export default function RowActions({ onEditar, onRemover }: Props) {
  return (
    <Group gap={4} justify="flex-end" wrap="nowrap">
      <Tooltip label="Editar">
        <ActionIcon variant="subtle" color="gray" onClick={onEditar} aria-label="Editar">
          <IconPencil size={18} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Remover">
        <ActionIcon variant="subtle" color="red" onClick={onRemover} aria-label="Remover">
          <IconTrash size={18} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
