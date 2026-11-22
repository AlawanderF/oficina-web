import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

// Camada de acesso ao banco: só aqui se fala com o Prisma
export const leitorRepository = {
  listar: () => prisma.leitor.findMany({ orderBy: { id: "asc" } }),
  buscarPorId: (id: number) => prisma.leitor.findUnique({ where: { id } }),
  criar: (data: Prisma.LeitorUncheckedCreateInput) => prisma.leitor.create({ data }),
  atualizar: (id: number, data: Prisma.LeitorUncheckedUpdateInput) =>
    prisma.leitor.update({ where: { id }, data }),
  remover: (id: number) => prisma.leitor.delete({ where: { id } }),
};
