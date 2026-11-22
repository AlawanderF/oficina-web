import { type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

/** Acesso a dados de Mecânico: a única camada que conversa com o Prisma. */
export const mecanicoRepository = {
  listar: () => prisma.mecanico.findMany({ orderBy: { nome: "asc" } }),

  buscarPorId: (id: number) => prisma.mecanico.findUnique({ where: { id } }),

  criar: (data: Prisma.MecanicoUncheckedCreateInput) => prisma.mecanico.create({ data }),

  atualizar: (id: number, data: Prisma.MecanicoUncheckedUpdateInput) =>
    prisma.mecanico.update({ where: { id }, data }),

  remover: (id: number) => prisma.mecanico.delete({ where: { id } }),
};
