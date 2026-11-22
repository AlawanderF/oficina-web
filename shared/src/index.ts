import { z } from "zod";

const texto = (campo: string, min = 2) =>
  z
    .string({ required_error: `${campo} é obrigatório` })
    .trim()
    .min(min, `${campo} deve ter pelo menos ${min} caracteres`);

// ---------- Usuário ----------
export const cadastroUsuarioSchema = z.object({
  nome: texto("Nome", 3),
  email: z.string({ required_error: "E-mail é obrigatório" }).trim().email("E-mail inválido"),
  senha: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});
export const loginSchema = z.object({
  email: z.string({ required_error: "E-mail é obrigatório" }).trim().email("E-mail inválido"),
  senha: z.string({ required_error: "Senha é obrigatória" }).min(1, "Senha é obrigatória"),
});

// ---------- Autor ----------
export const autorSchema = z.object({
  nome: texto("Nome", 3),
  nacionalidade: texto("Nacionalidade"),
});

// ---------- Livro ----------
export const livroSchema = z.object({
  titulo: texto("Título"),
  isbn: z
    .string({ required_error: "ISBN é obrigatório" })
    .trim()
    .regex(/^\d{13}$/, "ISBN deve ter 13 dígitos numéricos"),
  anoPublicacao: z
    .number({ required_error: "Ano é obrigatório", invalid_type_error: "Ano deve ser um número" })
    .int("Ano deve ser inteiro")
    .min(1000, "Ano inválido")
    .max(new Date().getFullYear(), "Ano não pode ser no futuro"),
  autorId: z
    .number({ required_error: "Autor é obrigatório", invalid_type_error: "Selecione um autor" })
    .int()
    .positive("Selecione um autor"),
});

// ---------- Leitor ----------
export const leitorSchema = z.object({
  nome: texto("Nome", 3),
  email: z.string({ required_error: "E-mail é obrigatório" }).trim().email("E-mail inválido"),
  cpf: z
    .string({ required_error: "CPF é obrigatório" })
    .trim()
    .regex(/^\d{11}$/, "CPF deve ter 11 dígitos numéricos"),
});

// ---------- Empréstimo ----------
export const emprestimoSchema = z.object({
  livroId: z
    .number({ required_error: "Livro é obrigatório", invalid_type_error: "Selecione um livro" })
    .int()
    .positive("Selecione um livro"),
  leitorId: z
    .number({ required_error: "Leitor é obrigatório", invalid_type_error: "Selecione um leitor" })
    .int()
    .positive("Selecione um leitor"),
  dataEmprestimo: z.string({ required_error: "Data do empréstimo é obrigatória" }).min(1, "Data do empréstimo é obrigatória"),
  dataDevolucao: z.string().nullable().optional(),
});

export type CadastroUsuarioInput = z.infer<typeof cadastroUsuarioSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AutorInput = z.infer<typeof autorSchema>;
export type LivroInput = z.infer<typeof livroSchema>;
export type LeitorInput = z.infer<typeof leitorSchema>;
export type EmprestimoInput = z.infer<typeof emprestimoSchema>;
