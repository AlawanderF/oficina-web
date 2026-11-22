import { Request, Response } from "express";
import { AppError } from "../lib/AppError";
import { leitorService } from "../services/leitorService";

const getId = (req: Request) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new AppError(400, "Id inválido");
  return id;
};

// Camada HTTP: lê a requisição, chama o service e escolhe o status da resposta
export const leitorController = {
  async listar(_req: Request, res: Response) {
    res.json(await leitorService.listar());
  },
  async buscarPorId(req: Request, res: Response) {
    res.json(await leitorService.buscarPorId(getId(req)));
  },
  async criar(req: Request, res: Response) {
    res.status(201).json(await leitorService.criar(req.body));
  },
  async atualizar(req: Request, res: Response) {
    res.json(await leitorService.atualizar(getId(req), req.body));
  },
  async remover(req: Request, res: Response) {
    await leitorService.remover(getId(req));
    res.status(204).send();
  },
};
