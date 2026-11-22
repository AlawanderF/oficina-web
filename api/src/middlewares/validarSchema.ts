import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

// Valida req.body com um schema do pacote shared.
// Se inválido: 400 com a mensagem de cada campo.
export const validarBody =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      const erros: Record<string, string> = {};
      for (const issue of resultado.error.issues) {
        const campo = issue.path.join(".") || "body";
        if (!erros[campo]) erros[campo] = issue.message;
      }
      return res.status(400).json({ message: "Dados inválidos", erros });
    }
    req.body = resultado.data; // dados já limpos (trim etc.)
    next();
  };
