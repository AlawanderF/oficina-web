import { AppError } from "../lib/AppError";
import { emprestimoRepository } from "../repositories/emprestimoRepository";

// O JSON traz datas como texto; o Prisma precisa de Date
const converter = (d: any) => ({
  ...d,
  dataEmprestimo: new Date(d.dataEmprestimo),
  dataDevolucao: d.dataDevolucao ? new Date(d.dataDevolucao) : null,
});

// Regras de negócio: decide o que fazer e lança erros com status certo
export const emprestimoService = {
  listar: () => emprestimoRepository.listar(),

  async buscarPorId(id: number) {
    const item = await emprestimoRepository.buscarPorId(id);
    if (!item) throw new AppError(404, "Empréstimo não encontrado(a)");
    return item;
  },

  criar: (dados: any) => emprestimoRepository.criar(converter(dados)),

  async atualizar(id: number, dados: any) {
    await emprestimoService.buscarPorId(id); // 404 se não existir
    return emprestimoRepository.atualizar(id, converter(dados));
  },

  async remover(id: number) {
    await emprestimoService.buscarPorId(id); // 404 se não existir
    await emprestimoRepository.remover(id);
  },
};
