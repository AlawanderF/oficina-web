import axios from "axios";
import type { Autor, Emprestimo, Leitor, Livro, Usuario } from "./types";

// Única instância do Axios: todas as chamadas à API passam por aqui
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
});

// Anexa o token JWT em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token vencido/inválido: volta para o login
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url: string = err.config?.url ?? "";
    if (err.response?.status === 401 && !url.startsWith("/auth")) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ---------- auth ----------
export const authApi = {
  cadastrar: (dados: { nome: string; email: string; senha: string }) =>
    api.post<Usuario>("/auth/cadastro", dados).then((r) => r.data),
  login: (dados: { email: string; senha: string }) =>
    api.post<{ token: string; usuario: Usuario }>("/auth/login", dados).then((r) => r.data),
};

// ---------- CRUD genérico por rota ----------
function crud<T, I>(rota: string) {
  return {
    listar: () => api.get<T[]>(rota).then((r) => r.data),
    criar: (dados: I) => api.post<T>(rota, dados).then((r) => r.data),
    atualizar: (id: number, dados: I) => api.put<T>(`${rota}/${id}`, dados).then((r) => r.data),
    remover: (id: number) => api.delete(`${rota}/${id}`).then(() => undefined),
  };
}

export const autoresApi = crud<Autor, { nome: string; nacionalidade: string }>("/autores");
export const livrosApi = crud<Livro, { titulo: string; isbn: string; anoPublicacao: number; autorId: number }>("/livros");
export const leitoresApi = crud<Leitor, { nome: string; email: string; cpf: string }>("/leitores");
export const emprestimosApi = crud<
  Emprestimo,
  { livroId: number; leitorId: number; dataEmprestimo: string; dataDevolucao: string | null }
>("/emprestimos");
