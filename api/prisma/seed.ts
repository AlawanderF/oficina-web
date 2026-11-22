import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // limpa na ordem certa (filhas antes das pais) para o seed poder rodar de novo
  await prisma.emprestimo.deleteMany();
  await prisma.livro.deleteMany();
  await prisma.leitor.deleteMany();
  await prisma.autor.deleteMany();
  await prisma.usuario.deleteMany();

  await prisma.usuario.create({
    data: {
      nome: "Professor",
      email: "professor@biblioteca.com",
      senha: await bcrypt.hash("senha123", 10),
    },
  });

  const [machado, clarice, orwell, rowling] = await Promise.all([
    prisma.autor.create({ data: { nome: "Machado de Assis", nacionalidade: "Brasileira" } }),
    prisma.autor.create({ data: { nome: "Clarice Lispector", nacionalidade: "Brasileira" } }),
    prisma.autor.create({ data: { nome: "George Orwell", nacionalidade: "Britânica" } }),
    prisma.autor.create({ data: { nome: "J. K. Rowling", nacionalidade: "Britânica" } }),
  ]);

  const livros = await Promise.all([
    prisma.livro.create({ data: { titulo: "Dom Casmurro", isbn: "9788535911664", anoPublicacao: 1899, autorId: machado.id } }),
    prisma.livro.create({ data: { titulo: "Memórias Póstumas de Brás Cubas", isbn: "9788535910667", anoPublicacao: 1881, autorId: machado.id } }),
    prisma.livro.create({ data: { titulo: "A Hora da Estrela", isbn: "9788532508126", anoPublicacao: 1977, autorId: clarice.id } }),
    prisma.livro.create({ data: { titulo: "1984", isbn: "9788535914849", anoPublicacao: 1949, autorId: orwell.id } }),
    prisma.livro.create({ data: { titulo: "Harry Potter e a Pedra Filosofal", isbn: "9788532530783", anoPublicacao: 1997, autorId: rowling.id } }),
  ]);

  const leitores = await Promise.all([
    prisma.leitor.create({ data: { nome: "Ana Souza", email: "ana@email.com", cpf: "11111111111" } }),
    prisma.leitor.create({ data: { nome: "Bruno Lima", email: "bruno@email.com", cpf: "22222222222" } }),
    prisma.leitor.create({ data: { nome: "Carla Mendes", email: "carla@email.com", cpf: "33333333333" } }),
  ]);

  await prisma.emprestimo.createMany({
    data: [
      { livroId: livros[0].id, leitorId: leitores[0].id, dataEmprestimo: new Date("2026-10-01"), dataDevolucao: new Date("2026-10-15") },
      { livroId: livros[3].id, leitorId: leitores[1].id, dataEmprestimo: new Date("2026-11-05"), dataDevolucao: null },
      { livroId: livros[4].id, leitorId: leitores[2].id, dataEmprestimo: new Date("2026-11-10"), dataDevolucao: null },
    ],
  });

  console.log("Seed concluído. Login: professor@biblioteca.com / senha123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
