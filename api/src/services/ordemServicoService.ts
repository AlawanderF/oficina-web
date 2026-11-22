import type { OrdemServicoInput } from "shared";
import { AppError } from "../lib/AppError";
import { mecanicoRepository } from "../repositories/mecanicoRepository";
import { ordemServicoRepository } from "../repositories/ordemServicoRepository";
import { veiculoRepository } from "../repositories/veiculoRepository";

/**
 * O JSON traz datas como texto "AAAA-MM-DD" (já validado pelo schema do shared).
 * O sufixo T00:00:00Z fixa o dia em UTC, o mesmo fuso da coluna DATE.
 */
const paraBanco = (d: OrdemServicoInput) => ({
  ...d,
  dataAbertura: new Date(`${d.dataAbertura}T00:00:00Z`),
  dataConclusao: d.dataConclusao ? new Date(`${d.dataConclusao}T00:00:00Z`) : null,
});

/** Veículo e mecânico informados precisam existir: erro 400 no campo correspondente. */
async function validarRelacionados(dados: OrdemServicoInput) {
  const [veiculo, mecanico] = await Promise.all([
    veiculoRepository.buscarPorId(dados.veiculoId),
    mecanicoRepository.buscarPorId(dados.mecanicoId),
  ]);
  const erros: Record<string, string> = {};
  if (!veiculo) erros.veiculoId = "Veículo não encontrado";
  if (!mecanico) erros.mecanicoId = "Mecânico não encontrado";
  if (Object.keys(erros).length) throw new AppError(400, "Registro relacionado não encontrado", erros);
}

/** Regras de negócio de Ordem de serviço. */
export const ordemServicoService = {
  listar: () => ordemServicoRepository.listar(),

  async buscarPorId(id: number) {
    const registro = await ordemServicoRepository.buscarPorId(id);
    if (!registro) throw new AppError(404, "Ordem de serviço não encontrada");
    return registro;
  },

  async criar(dados: OrdemServicoInput) {
    await validarRelacionados(dados);
    return ordemServicoRepository.criar(paraBanco(dados));
  },

  async atualizar(id: number, dados: OrdemServicoInput) {
    await ordemServicoService.buscarPorId(id); // 404 se não existir
    await validarRelacionados(dados);
    return ordemServicoRepository.atualizar(id, paraBanco(dados));
  },

  async remover(id: number) {
    await ordemServicoService.buscarPorId(id); // 404 se não existir
    await ordemServicoRepository.remover(id);
  },
};
