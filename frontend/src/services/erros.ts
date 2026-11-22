import { isAxiosError } from "axios";

export type Erros = Record<string, string>;

interface ZodLike {
  issues: { path: (string | number)[]; message: string }[];
}

// Converte erro do Zod (validação no navegador) em { campo: mensagem }
export function zodErros(error: ZodLike): Erros {
  const erros: Erros = {};
  for (const issue of error.issues) {
    const campo = issue.path.join(".");
    if (!erros[campo]) erros[campo] = issue.message;
  }
  return erros;
}

// Lê a resposta de erro da API: mensagem geral + mensagem por campo
export function erroApi(err: unknown): { message: string; campos: Erros } {
  if (isAxiosError(err)) {
    if (!err.response) return { message: "Não foi possível conectar à API", campos: {} };
    const data = err.response.data as { message?: string; erros?: Erros };
    return { message: data?.message ?? "Erro inesperado", campos: data?.erros ?? {} };
  }
  return { message: "Erro inesperado", campos: {} };
}
