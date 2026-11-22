import type { StatusOrdem } from "shared";

/** Cor (paleta do Mantine) de cada status de OS: badges, gráfico e legendas usam a mesma. */
export const COR_STATUS: Record<StatusOrdem, string> = {
  ABERTA: "blue",
  EM_ANDAMENTO: "yellow",
  CONCLUIDA: "green",
  CANCELADA: "gray",
};
