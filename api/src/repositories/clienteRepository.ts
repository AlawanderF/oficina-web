import { type Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

/** Acesso a dados de Cliente: a única camada que conversa com o Prisma. */
export const clienteRepository = {
  listar: () => prisma.cliente.findMany({ orderBy: { nome: "asc" } }),

  buscarPorId: (id: number) => prisma.cliente.findUnique({ where: { id } }),

  criar: (data: Prisma.ClienteUncheckedCreateInput) => prisma.cliente.create({ data }),

  atualizar: (id: number, data: Prisma.ClienteUncheckedUpdateInput) =>
    prisma.cliente.update({ where: { id }, data }),

  remover: (id: number) => prisma.cliente.delete({ where: { id } }),
};
