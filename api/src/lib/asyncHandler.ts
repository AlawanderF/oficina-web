import { type NextFunction, type Request, type RequestHandler, type Response } from "express";

/** Encaminha exceções de handlers async para o middleware de erros do Express. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
