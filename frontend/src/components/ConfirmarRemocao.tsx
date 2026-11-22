import { Button, Group, Modal, Text } from "@mantine/core";

interface Props {
  aberto: boolean;
  texto: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmarRemocao({ aberto, texto, onConfirmar, onCancelar }: Props) {
  return (
    <Modal opened={aberto} onClose={onCancelar} title="Confirmar remoção" centered>
      <Text mb="md">Tem certeza que deseja remover {texto}?</Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={onCancelar}>Cancelar</Button>
        <Button color="red" onClick={onConfirmar}>Remover</Button>
      </Group>
    </Modal>
  );
}
