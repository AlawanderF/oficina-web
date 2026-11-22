import { Badge } from "@mantine/core";
import { STATUS_ORDEM_LABEL, type StatusOrdem } from "shared";
import { COR_STATUS } from "../lib/status";

export default function StatusBadge({ status }: { status: StatusOrdem }) {
  const cor = COR_STATUS[status];
  return (
    <Badge
      color={cor}
      variant="light"
      size="md"
      // o status nunca deve ser cortado com "..." em colunas estreitas
      styles={{ root: { overflow: "visible", flexShrink: 0 }, label: { overflow: "visible" } }}
      style={{ whiteSpace: "nowrap" }}
      leftSection={<span className="ponto" style={{ background: `var(--mantine-color-${cor}-6)` }} />}
    >
      {STATUS_ORDEM_LABEL[status]}
    </Badge>
  );
}
