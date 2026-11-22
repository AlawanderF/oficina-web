import type { VeiculoInput } from "shared";
import { AppError } from "../lib/AppError";
import { clienteRepository } from "../repositories/clienteRepository";
import { veiculoRepository } from "../repositories/veiculoRepository";

/** O proprietário informado precisa existir (400 com o erro no campo, não 409 genérico). */
async function validarCliente(clienteId: number) {
  if (!(await clienteRepository.buscarPorId(clienteId))) {
    throw new AppError(400, "Cliente não encontrado", { clienteId: "Cliente não encontrado" });
  }
}

/** Regras de negócio de Veículo. */
export const veiculoService = {
  listar: () => veiculoRepository.listar(),

  async buscarPorId(id: number) {
    const registro = await veiculoRepository.buscarPorId(id);
    if (!registro) throw new AppError(404, "Veículo não encontrado");
    return registro;
  },

  async criar(dados: VeiculoInput) {
    await validarCliente(dados.clienteId);
    return veiculoRepository.criar(dados);
  },

  async atualizar(id: number, dados: VeiculoInput) {
    await veiculoService.buscarPorId(id); // 404 se não existir
    await validarCliente(dados.clienteId);
    return veiculoRepository.atualizar(id, dados);
  },

  async remover(id: number) {
    await veiculoService.buscarPorId(id); // 404 se não existir
    await veiculoRepository.remover(id);
  },
};
