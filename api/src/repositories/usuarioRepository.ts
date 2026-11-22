import { prisma } from "../lib/prisma";

export const usuarioRepository = {
  buscarPorEmail: (email: string) => prisma.usuario.findUnique({ where: { email } }),
  criar: (data: { nome: string; email: string; senha: string }) => prisma.usuario.create({ data }),
};
