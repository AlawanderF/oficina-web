import type { VeiculoInput } from "shared";
import { AppError } from "../lib/AppError";
import { veiculoRepository } from "../repositories/veiculoRepository";

/** Regras de negócio de Veículo. */
export const veiculoService = {
  listar: () => veiculoRepository.listar(),

  async buscarPorId(id: number) {
    const registro = await veiculoRepository.buscarPorId(id);
    if (!registro) throw new AppError(404, "Veículo não encontrado(a)");
    return registro;
  },

  criar: (dados: VeiculoInput) => veiculoRepository.criar(dados),

  async atualizar(id: number, dados: VeiculoInput) {
    await veiculoService.buscarPorId(id); // 404 se não existir
    return veiculoRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await veiculoService.buscarPorId(id); // 404 se não existir
    await veiculoRepository.remover(id);
  },
};
