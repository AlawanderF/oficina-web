import { type Request, type Response } from "express";
import { lerId } from "../lib/lerId";
import { clienteService } from "../services/clienteService";

/** Camada HTTP de Cliente: lê a requisição, chama o service, define o status. */
export const clienteController = {
  async listar(_req: Request, res: Response) {
    res.json(await clienteService.listar());
  },

  async buscarPorId(req: Request, res: Response) {
    res.json(await clienteService.buscarPorId(lerId(req)));
  },

  async criar(req: Request, res: Response) {
    res.status(201).json(await clienteService.criar(req.body));
  },

  async atualizar(req: Request, res: Response) {
    res.json(await clienteService.atualizar(lerId(req), req.body));
  },

  async remover(req: Request, res: Response) {
    await clienteService.remover(lerId(req));
    res.status(204).send();
  },
};
