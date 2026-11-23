import { Button, Group, Modal, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface Props {
  aberto: boolean;
  descricao: string;
  carregando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmarRemocao({ aberto, descricao, carregando, onConfirmar, onCancelar }: Props) {
  const [descricaoExibida, setDescricaoExibida] = useState(descricao);
  useEffect(() => {
    if (aberto) setDescricaoExibida(descricao);
  }, [aberto, descricao]);
  return (
    <Modal
      opened={aberto}
      onClose={onCancelar}
      withCloseButton={false}
      closeOnEscape={!carregando}
      closeOnClickOutside={!carregando}
      title="Confirmar exclusão"
      size="sm"
    >
      <Stack align="center" gap="sm" ta="center" pt="sm">
        <ThemeIcon size={52} radius="xl" color="red" variant="light">
          <IconTrash size={26} />
        </ThemeIcon>
        <Text fw={650} fz="lg">
          Confirmar exclusão
        </Text>
        <Text size="sm" c="dimmed">
          Deseja remover <b>{descricaoExibida}</b>? Esta ação não pode ser desfeita.
        </Text>
      </Stack>
      <Group grow mt="lg">
        <Button variant="default" onClick={onCancelar} disabled={carregando}>
          Cancelar
        </Button>
        <Button color="red" onClick={onConfirmar} loading={carregando}>
          Remover
        </Button>
      </Group>
    </Modal>
  );
}
