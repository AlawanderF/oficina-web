import type { ClienteInput } from "shared";
import { AppError } from "../lib/AppError";
import { clienteRepository } from "../repositories/clienteRepository";

/** Regras de negócio de Cliente. */
export const clienteService = {
  listar: () => clienteRepository.listar(),

  async buscarPorId(id: number) {
    const registro = await clienteRepository.buscarPorId(id);
    if (!registro) throw new AppError(404, "Cliente não encontrado(a)");
    return registro;
  },

  criar: (dados: ClienteInput) => clienteRepository.criar(dados),

  async atualizar(id: number, dados: ClienteInput) {
    await clienteService.buscarPorId(id); // 404 se não existir
    return clienteRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await clienteService.buscarPorId(id); // 404 se não existir
    await clienteRepository.remover(id);
  },
};
