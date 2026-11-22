import type { Usuario } from "./types";

export const salvarSessao = (token: string, usuario: Usuario) => {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
};
export const sair = () => localStorage.clear();
export const estaLogado = () => !!localStorage.getItem("token");
export const usuarioLogado = (): Usuario | null => {
  try {
    return JSON.parse(localStorage.getItem("usuario") ?? "null");
  } catch {
    return null;
  }
};
