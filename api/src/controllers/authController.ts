import { type Request, type Response } from "express";
import { authService } from "../services/authService";

export const authController = {
  async cadastrar(req: Request, res: Response) {
    res.status(201).json(await authService.cadastrar(req.body));
  },

  async login(req: Request, res: Response) {
    res.json(await authService.login(req.body));
  },
};
