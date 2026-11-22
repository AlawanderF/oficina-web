import { AppError } from "../lib/AppError";
import { livroRepository } from "../repositories/livroRepository";

// Regras de negócio: decide o que fazer e lança erros com status certo
export const livroService = {
  listar: () => livroRepository.listar(),

  async buscarPorId(id: number) {
    const item = await livroRepository.buscarPorId(id);
    if (!item) throw new AppError(404, "Livro não encontrado(a)");
    return item;
  },

  criar: (dados: any) => livroRepository.criar(dados),

  async atualizar(id: number, dados: any) {
    await livroService.buscarPorId(id); // 404 se não existir
    return livroRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await livroService.buscarPorId(id); // 404 se não existir
    await livroRepository.remover(id);
  },
};
