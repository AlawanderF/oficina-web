import { type Request } from "express";
import { INT_MAX } from "shared";
import { AppError } from "./AppError";

/**
 * Lê e valida o parâmetro :id da rota.
 * Aceita só dígitos ("1e3" e "0x10" seriam números válidos para Number()) e
 * limita ao maior INT do PostgreSQL (acima disso a consulta falharia com 500).
 */
export function lerId(req: Request): number {
  const bruto = req.params.id ?? "";
  const id = Number(bruto);
  if (!/^\d{1,10}$/.test(bruto) || id <= 0 || id > INT_MAX) {
    throw new AppError(400, "Id inválido");
  }
  return id;
}
