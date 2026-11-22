import type { OrdemServicoInput } from "shared";
import { AppError } from "../lib/AppError";
import { ordemServicoRepository } from "../repositories/ordemServicoRepository";

/** O JSON traz datas como texto (YYYY-MM-DD); o Prisma espera Date. */
const paraBanco = (d: OrdemServicoInput) => ({
  ...d,
  dataAbertura: new Date(d.dataAbertura),
  dataConclusao: d.dataConclusao ? new Date(d.dataConclusao) : null,
});

/** Regras de negócio de Ordem de serviço. */
export const ordemServicoService = {
  listar: () => ordemServicoRepository.listar(),

  async buscarPorId(id: number) {
    const registro = await ordemServicoRepository.buscarPorId(id);
    if (!registro) throw new AppError(404, "Ordem de serviço não encontrado(a)");
    return registro;
  },

  criar: (dados: OrdemServicoInput) => ordemServicoRepository.criar(paraBanco(dados)),

  async atualizar(id: number, dados: OrdemServicoInput) {
    await ordemServicoService.buscarPorId(id); // 404 se não existir
    return ordemServicoRepository.atualizar(id, paraBanco(dados));
  },

  async remover(id: number) {
    await ordemServicoService.buscarPorId(id); // 404 se não existir
    await ordemServicoRepository.remover(id);
  },
};
