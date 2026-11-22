import type { Usuario } from "./types";

const CHAVE_TOKEN = "oficina.token";
const CHAVE_USUARIO = "oficina.usuario";

export function salvarSessao(token: string, usuario: Usuario) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

export function encerrarSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}

export const lerToken = () => localStorage.getItem(CHAVE_TOKEN);

export const estaAutenticado = () => Boolean(lerToken());

export function usuarioAtual(): Usuario | null {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIO) ?? "null") as Usuario | null;
  } catch {
    return null;
  }
}
