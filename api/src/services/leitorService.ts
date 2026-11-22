import { AppError } from "../lib/AppError";
import { leitorRepository } from "../repositories/leitorRepository";

// Regras de negócio: decide o que fazer e lança erros com status certo
export const leitorService = {
  listar: () => leitorRepository.listar(),

  async buscarPorId(id: number) {
    const item = await leitorRepository.buscarPorId(id);
    if (!item) throw new AppError(404, "Leitor não encontrado(a)");
    return item;
  },

  criar: (dados: any) => leitorRepository.criar(dados),

  async atualizar(id: number, dados: any) {
    await leitorService.buscarPorId(id); // 404 se não existir
    return leitorRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await leitorService.buscarPorId(id); // 404 se não existir
    await leitorRepository.remover(id);
  },
};
