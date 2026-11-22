import { type NextFunction, type Request, type Response } from "express";
import { type ZodSchema } from "zod";

/**
 * Valida o corpo da requisição com um schema do pacote shared.
 * Inválido -> 400 com a mensagem de cada campo: { message, erros: { campo: mensagem } }.
 * Válido   -> substitui req.body pelos dados já normalizados (trim, só dígitos, etc.).
 */
export const validarBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const resultado = schema.safeParse(req.body);
  if (!resultado.success) {
    const erros: Record<string, string> = {};
    for (const issue of resultado.error.issues) {
      const campo = issue.path.join(".") || "body";
      erros[campo] ??= issue.message;
    }
    return res.status(400).json({ message: "Dados inválidos", erros });
  }
  req.body = resultado.data;
  next();
};
