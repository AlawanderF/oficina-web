import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

// Camada de acesso ao banco: só aqui se fala com o Prisma
export const autorRepository = {
  listar: () => prisma.autor.findMany({ orderBy: { id: "asc" } }),
  buscarPorId: (id: number) => prisma.autor.findUnique({ where: { id } }),
  criar: (data: Prisma.AutorUncheckedCreateInput) => prisma.autor.create({ data }),
  atualizar: (id: number, data: Prisma.AutorUncheckedUpdateInput) =>
    prisma.autor.update({ where: { id }, data }),
  remover: (id: number) => prisma.autor.delete({ where: { id } }),
};
