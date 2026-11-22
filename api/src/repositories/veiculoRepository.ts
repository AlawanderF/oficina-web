import { type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const include = { cliente: true } satisfies Prisma.VeiculoInclude;

/** Acesso a dados de Veículo: a única camada que conversa com o Prisma. */
export const veiculoRepository = {
  listar: () => prisma.veiculo.findMany({ include, orderBy: { placa: "asc" } }),

  buscarPorId: (id: number) => prisma.veiculo.findUnique({ where: { id }, include }),

  criar: (data: Prisma.VeiculoUncheckedCreateInput) => prisma.veiculo.create({ data, include }),

  atualizar: (id: number, data: Prisma.VeiculoUncheckedUpdateInput) =>
    prisma.veiculo.update({ where: { id }, data, include }),

  remover: (id: number) => prisma.veiculo.delete({ where: { id } }),
};
