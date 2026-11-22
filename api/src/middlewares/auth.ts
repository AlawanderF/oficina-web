import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const jwtSecret = () => process.env.JWT_SECRET || "dev-secret";

// Exige "Authorization: Bearer <token>" gerado no login
export function autenticar(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não informado" });
  }
  try {
    jwt.verify(header.slice(7), jwtSecret());
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
