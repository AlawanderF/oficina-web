import { type Request, type Response } from "express";
import { lerId } from "../lib/lerId";
import { veiculoService } from "../services/veiculoService";

/** Camada HTTP de Veículo: lê a requisição, chama o service, define o status. */
export const veiculoController = {
  async listar(_req: Request, res: Response) {
    res.json(await veiculoService.listar());
  },

  async buscarPorId(req: Request, res: Response) {
    res.json(await veiculoService.buscarPorId(lerId(req)));
  },

  async criar(req: Request, res: Response) {
    res.status(201).json(await veiculoService.criar(req.body));
  },

  async atualizar(req: Request, res: Response) {
    res.json(await veiculoService.atualizar(lerId(req), req.body));
  },

  async remover(req: Request, res: Response) {
    await veiculoService.remover(lerId(req));
    res.status(204).send();
  },
};
