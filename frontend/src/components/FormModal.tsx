import { Alert, Button, Group, Modal, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import type { FormEvent, ReactNode } from "react";

interface Props {
  aberto: boolean;
  titulo: string;
  /** Mensagem geral da API (ex.: "Já existe um cadastro com este CPF") */
  erroGeral?: string;
  salvando: boolean;
  onFechar: () => void;
  onSalvar: () => void;
  tamanho?: string;
  children: ReactNode;
}

/** Modal único para criar e editar: o título muda conforme o modo. */
export default function FormModal({
  aberto,
  titulo,
  erroGeral,
  salvando,
  onFechar,
  onSalvar,
  tamanho,
  children,
}: Props) {
  function enviar(e: FormEvent) {
    e.preventDefault();
    onSalvar();
  }

  return (
    <Modal
      opened={aberto}
      onClose={onFechar}
      title={titulo}
      size={tamanho ?? "md"}
      styles={{ title: { fontWeight: 650, fontSize: 18 } }}
    >
      <form onSubmit={enviar} noValidate>
        <Stack gap="md">
          {erroGeral && (
            <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />}>
              {erroGeral}
            </Alert>
          )}
          {children}
          <Group justify="flex-end" mt="xs">
            <Button variant="default" onClick={onFechar} disabled={salvando}>
              Cancelar
            </Button>
            <Button type="submit" loading={salvando}>
              Salvar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
