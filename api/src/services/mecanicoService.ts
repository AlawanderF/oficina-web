import type { MecanicoInput } from "shared";
import { AppError } from "../lib/AppError";
import { mecanicoRepository } from "../repositories/mecanicoRepository";

/** Regras de negócio de Mecânico. */
export const mecanicoService = {
  listar: () => mecanicoRepository.listar(),

  async buscarPorId(id: number) {
    const registro = await mecanicoRepository.buscarPorId(id);
    if (!registro) throw new AppError(404, "Mecânico não encontrado(a)");
    return registro;
  },

  criar: (dados: MecanicoInput) => mecanicoRepository.criar(dados),

  async atualizar(id: number, dados: MecanicoInput) {
    await mecanicoService.buscarPorId(id); // 404 se não existir
    return mecanicoRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await mecanicoService.buscarPorId(id); // 404 se não existir
    await mecanicoRepository.remover(id);
  },
};
