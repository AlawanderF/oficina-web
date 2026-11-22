import { type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const include = {
  veiculo: { include: { cliente: true } },
  mecanico: true,
} satisfies Prisma.OrdemServicoInclude;

/** Acesso a dados de Ordem de serviço: a única camada que conversa com o Prisma. */
export const ordemServicoRepository = {
  listar: () => prisma.ordemServico.findMany({ include, orderBy: { id: "desc" } }),

  buscarPorId: (id: number) => prisma.ordemServico.findUnique({ where: { id }, include }),

  criar: (data: Prisma.OrdemServicoUncheckedCreateInput) => prisma.ordemServico.create({ data, include }),

  atualizar: (id: number, data: Prisma.OrdemServicoUncheckedUpdateInput) =>
    prisma.ordemServico.update({ where: { id }, data, include }),

  remover: (id: number) => prisma.ordemServico.delete({ where: { id } }),
};
