import { Badge } from "@mantine/core";
import { STATUS_ORDEM_LABEL, type StatusOrdem } from "shared";
import { COR_STATUS } from "../lib/status";

export default function StatusBadge({ status }: { status: StatusOrdem }) {
  return (
    <Badge color={COR_STATUS[status]} variant="light">
      {STATUS_ORDEM_LABEL[status]}
    </Badge>
  );
}
