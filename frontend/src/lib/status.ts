import type { StatusOrdem } from "shared";

/** Cor do badge de cada status de OS. */
export const COR_STATUS: Record<StatusOrdem, string> = {
  ABERTA: "blue",
  EM_ANDAMENTO: "yellow",
  CONCLUIDA: "teal",
  CANCELADA: "gray",
};
