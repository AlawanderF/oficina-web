import { AppError } from "../lib/AppError";
import { autorRepository } from "../repositories/autorRepository";

// Regras de negócio: decide o que fazer e lança erros com status certo
export const autorService = {
  listar: () => autorRepository.listar(),

  async buscarPorId(id: number) {
    const item = await autorRepository.buscarPorId(id);
    if (!item) throw new AppError(404, "Autor não encontrado(a)");
    return item;
  },

  criar: (dados: any) => autorRepository.criar(dados),

  async atualizar(id: number, dados: any) {
    await autorService.buscarPorId(id); // 404 se não existir
    return autorRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await autorService.buscarPorId(id); // 404 se não existir
    await autorRepository.remover(id);
  },
};
