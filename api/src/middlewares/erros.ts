import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/AppError";

export function tratarErros(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: valor repetido em campo @unique
    if (err.code === "P2002") {
      const campos = (err.meta?.target as string[]) ?? [];
      return res.status(409).json({
        message: `Já existe um registro com este valor de: ${campos.join(", ")}`,
        erros: Object.fromEntries(campos.map((c) => [c, "Valor já cadastrado"])),
      });
    }
    // P2025: registro não encontrado
    if (err.code === "P2025") return res.status(404).json({ message: "Registro não encontrado" });
    // P2003: chave estrangeira (id ligado inexistente, ou registro em uso)
    if (err.code === "P2003") {
      return res.status(409).json({
        message: "Operação inválida: registro relacionado inexistente ou em uso por outro registro",
      });
    }
  }
  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor" });
}
