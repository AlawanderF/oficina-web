import { NextFunction, Request, RequestHandler, Response } from "express";

// Encaminha erros de funções async para o middleware de erros do Express
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
