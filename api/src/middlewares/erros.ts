import { type NextFunction, type Request, type Response } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/AppError";

const NOMES_CAMPOS: Record<string, string> = {
  cpf: "CPF",
  placa: "placa",
  email: "e-mail",
};

/** Erros do leitor de JSON do Express (body-parser) com status 4xx. */
const MENSAGENS_BODY_PARSER: Record<string, string> = {
  "entity.parse.failed": "JSON inválido no corpo da requisição",
  "entity.too.large": "Corpo da requisição muito grande (máximo de 100 kB)",
  "charset.unsupported": "Charset não suportado: envie JSON em UTF-8",
  "encoding.unsupported": "Content-Encoding não suportado",
  "request.aborted": "Requisição interrompida",
};

type ErroHttp = { status?: number; type?: string; expose?: boolean };

/** Middleware central de erros: nenhum erro conhecido vira 500. */
export function tratarErros(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message, ...(err.erros && { erros: err.erros }) });
  }

  // Erros 4xx do parser de JSON (malformado, grande demais, charset/encoding inválido)
  const http = err as ErroHttp;
  if (typeof http?.status === "number" && http.status >= 400 && http.status < 500 && http.expose) {
    return res
      .status(http.status)
      .json({ message: MENSAGENS_BODY_PARSER[http.type ?? ""] ?? "Requisição inválida" });
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
    // P2025: registro não encontrado (ex.: removido entre a consulta e a alteração)
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Registro não encontrado" });
    }
    // P2003: chave estrangeira — o registro está em uso por outro
    if (err.code === "P2003") {
      return res.status(409).json({
        message: "Não é possível remover: o registro está vinculado a outros cadastros",
      });
    }
  }

  // Defesa em profundidade: dado que passou pelo Zod mas o Prisma recusou
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ message: "Dados inválidos para o banco de dados" });
  }

  console.error(err);
  return res.status(500).json({ message: "Erro interno do servidor" });
}
