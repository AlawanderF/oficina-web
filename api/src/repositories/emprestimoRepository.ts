import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const include = { livro: true, leitor: true };

// Camada de acesso ao banco: só aqui se fala com o Prisma
export const emprestimoRepository = {
  listar: () => prisma.emprestimo.findMany({ include, orderBy: { id: "asc" } }),
  buscarPorId: (id: number) => prisma.emprestimo.findUnique({ where: { id }, include }),
  criar: (data: Prisma.EmprestimoUncheckedCreateInput) => prisma.emprestimo.create({ data, include }),
  atualizar: (id: number, data: Prisma.EmprestimoUncheckedUpdateInput) =>
    prisma.emprestimo.update({ where: { id }, data, include }),
  remover: (id: number) => prisma.emprestimo.delete({ where: { id } }),
};
