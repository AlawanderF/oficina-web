import { type Request, type Response } from "express";
import { lerId } from "../lib/lerId";
import { mecanicoService } from "../services/mecanicoService";

/** Camada HTTP de Mecânico: lê a requisição, chama o service, define o status. */
export const mecanicoController = {
  async listar(_req: Request, res: Response) {
    res.json(await mecanicoService.listar());
  },

  async buscarPorId(req: Request, res: Response) {
    res.json(await mecanicoService.buscarPorId(lerId(req)));
  },

  async criar(req: Request, res: Response) {
    res.status(201).json(await mecanicoService.criar(req.body));
  },

  async atualizar(req: Request, res: Response) {
    res.json(await mecanicoService.atualizar(lerId(req), req.body));
  },

  async remover(req: Request, res: Response) {
    await mecanicoService.remover(lerId(req));
    res.status(204).send();
  },
};
