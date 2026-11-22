import { type Request, type Response } from "express";
import { lerId } from "../lib/lerId";
import { ordemServicoService } from "../services/ordemServicoService";

/** Camada HTTP de Ordem de serviço: lê a requisição, chama o service, define o status. */
export const ordemServicoController = {
  async listar(_req: Request, res: Response) {
    res.json(await ordemServicoService.listar());
  },

  async buscarPorId(req: Request, res: Response) {
    res.json(await ordemServicoService.buscarPorId(lerId(req)));
  },

  async criar(req: Request, res: Response) {
    res.status(201).json(await ordemServicoService.criar(req.body));
  },

  async atualizar(req: Request, res: Response) {
    res.json(await ordemServicoService.atualizar(lerId(req), req.body));
  },

  async remover(req: Request, res: Response) {
    await ordemServicoService.remover(lerId(req));
    res.status(204).send();
  },
};
