import { type Request } from "express";
import { AppError } from "./AppError";

/** Lê e valida o parâmetro :id da rota. */
export function lerId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, "Id inválido");
  return id;
}
