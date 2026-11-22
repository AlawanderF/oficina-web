import { type NextFunction, type Request, type Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/AppError";

const NOMES_CAMPOS: Record<string, string> = {
  cpf: "CPF",
  placa: "placa",
  email: "e-mail",
};

/** Middleware central de erros: nenhum erro conhecido vira 500. */
export function tratarErros(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }

  // JSON malformado no corpo da requisição
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "JSON inválido no corpo da requisição" });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: valor repetido em campo @unique
    if (err.code === "P2002") {
      const campos = (err.meta?.target as string[] | undefined) ?? [];
      const nomes = campos.map((c) => NOMES_CAMPOS[c] ?? c).join(", ");
      return res.status(409).json({
        message: `Já existe um cadastro com este ${nomes}`,
        erros: Object.fromEntries(campos.map((c) => [c, `${NOMES_CAMPOS[c] ?? c} já cadastrado`])),
      });
    }
    // P2025: registro não encontrado
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Registro não encontrado" });
    }
    // P2003: chave estrangeira (registro em uso ou id relacionado inexistente)
    if (err.code === "P2003") {
      return res.status(409).json({
        message:
          "Não é possível concluir: o registro está em uso ou faz referência a um registro inexistente",
      });
    }
  }

  console.error(err);
  return res.status(500).json({ message: "Erro interno do servidor" });
}
