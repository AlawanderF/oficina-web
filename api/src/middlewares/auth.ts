import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

/** Exige o header "Authorization: Bearer <token>" emitido no login. */
export function autenticar(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não informado" });
  }
  try {
    // algorithms fixo: só aceita tokens assinados como o login assina (HS256)
    jwt.verify(header.slice(7), config.JWT_SECRET, { algorithms: ["HS256"] });
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
