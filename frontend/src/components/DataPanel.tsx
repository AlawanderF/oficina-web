import {
  Alert,
  Button,
  Center,
  Group,
  Paper,
  Pagination,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  ThemeIcon,
} from "@mantine/core";
import { IconAlertCircle, IconInbox, IconSearch } from "@tabler/icons-react";
import { Children, type ReactNode, useEffect, useState } from "react";

interface Props {
  /** Texto da busca e callback (busca local com .filter) */
  busca?: string;
  onBusca?: (valor: string) => void;
  placeholderBusca?: string;
  /** Filtros extras ao lado da busca */
  filtros?: ReactNode;
  carregando: boolean;
  erro?: string;
  onTentarNovamente?: () => void;
  /** Quantidade exibida e total, para o rodapé */
  exibindo: number;
  total: number;
  /** Quantidade após busca e filtros. */
  totalFiltrado?: number;
  resetKey?: string | null;
  /** Larguras mínimas para rolagem horizontal no celular */
  larguraMinima?: number;
  cabecalho: ReactNode;
  children: ReactNode;
}

/** Painel padrão das listagens: busca, estados de carregamento, vazio e erro, tabela e rodapé. */
export default function DataPanel(props: Props) {
  const { busca, onBusca, placeholderBusca, filtros, carregando, erro, onTentarNovamente } = props;
  const {
    exibindo,
    total,
    totalFiltrado = exibindo,
    resetKey,
    larguraMinima = 760,
    cabecalho,
    children,
  } = props;
  const [pagina, setPagina] = useState(1);
  const porPagina = 10;
  const paginas = Math.ceil(totalFiltrado / porPagina);
  const linhas = Children.toArray(children);
  const linhasVisiveis = linhas.slice((pagina - 1) * porPagina, pagina * porPagina);
  useEffect(() => setPagina(1), [busca, resetKey]);

  return (
    <Paper p={0} shadow="xs">
      {(onBusca || filtros) && (
        <Group
          p="md"
          gap="sm"
          wrap="wrap"
          style={{ borderBottom: "1px solid var(--mantine-color-default-border)" }}
        >
          {onBusca && (
            <TextInput
              aria-label="Buscar"
              placeholder={placeholderBusca ?? "Buscar..."}
              leftSection={<IconSearch size={16} />}
              value={busca}
              onChange={(e) => onBusca(e.currentTarget.value)}
              style={{ flex: 1, minWidth: 220 }}
            />
          )}
          {filtros}
        </Group>
      )}

      {erro ? (
        <Alert m="md" color="red" icon={<IconAlertCircle size={18} />} title="Erro ao carregar">
          <Stack gap="xs" align="flex-start">
            <Text size="sm">{erro}</Text>
            {onTentarNovamente && (
              <Button size="xs" variant="light" color="red" onClick={onTentarNovamente}>
                Tentar novamente
              </Button>
            )}
          </Stack>
        </Alert>
      ) : carregando ? (
        <Stack p="md" gap="sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} h={36} />
          ))}
        </Stack>
      ) : exibindo === 0 ? (
        <Center py={56}>
          <Stack align="center" gap={6}>
            <ThemeIcon size={48} radius="xl" variant="light" color="gray">
              <IconInbox size={26} />
            </ThemeIcon>
            <Text fw={600}>{total === 0 ? "Nenhum registro cadastrado" : "Nenhum resultado"}</Text>
            <Text size="sm" c="dimmed">
              {total === 0
                ? "Clique em “Novo” para adicionar o primeiro."
                : "Tente outro termo de busca ou filtro."}
            </Text>
          </Stack>
        </Center>
      ) : (
        <Table.ScrollContainer minWidth={larguraMinima}>
          <Table className="data-table" striped={false}>
            <Table.Thead>{cabecalho}</Table.Thead>
            <Table.Tbody>{linhasVisiveis}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}

      {!carregando && !erro && total > 0 && (
        <Group
          justify="space-between"
          p="md"
          style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
        >
          <Text size="xs" c="dimmed">
            Exibindo {totalFiltrado === 0 ? 0 : (pagina - 1) * porPagina + 1}–
            {Math.min(pagina * porPagina, totalFiltrado)} de {totalFiltrado} registro(s)
          </Text>
          {paginas > 1 && <Pagination size="sm" total={paginas} value={pagina} onChange={setPagina} />}
        </Group>
      )}
    </Paper>
  );
}
