import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const include = { autor: true };

// Camada de acesso ao banco: só aqui se fala com o Prisma
export const livroRepository = {
  listar: () => prisma.livro.findMany({ include, orderBy: { id: "asc" } }),
  buscarPorId: (id: number) => prisma.livro.findUnique({ where: { id }, include }),
  criar: (data: Prisma.LivroUncheckedCreateInput) => prisma.livro.create({ data, include }),
  atualizar: (id: number, data: Prisma.LivroUncheckedUpdateInput) =>
    prisma.livro.update({ where: { id }, data, include }),
  remover: (id: number) => prisma.livro.delete({ where: { id } }),
};
