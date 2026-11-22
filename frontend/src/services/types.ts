export interface Usuario { id: number; nome: string; email: string }
export interface Autor { id: number; nome: string; nacionalidade: string }
export interface Livro { id: number; titulo: string; isbn: string; anoPublicacao: number; autorId: number; autor: Autor }
export interface Leitor { id: number; nome: string; email: string; cpf: string }
export interface Emprestimo {
  id: number; livroId: number; leitorId: number;
  dataEmprestimo: string; dataDevolucao: string | null;
  livro: Livro; leitor: Leitor;
}
