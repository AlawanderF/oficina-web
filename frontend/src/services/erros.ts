import { isAxiosError } from "axios";
import type { ZodError } from "zod";

/** Mapa campo -> mensagem, usado nos formulários. A chave "geral" é o aviso do topo. */
export type ErrosCampos = Record<string, string>;

/** Converte o erro do Zod (validação no navegador) em { campo: mensagem }. */
export function errosDoZod(erro: ZodError): ErrosCampos {
  const erros: ErrosCampos = {};
  for (const issue of erro.issues) {
    const campo = issue.path.join(".");
    erros[campo] ??= issue.message;
  }
  return erros;
}

/** Lê a resposta de erro da API: { message, erros: { campo: mensagem } }. */
export function errosDaApi(erro: unknown): { mensagem: string; campos: ErrosCampos } {
  if (isAxiosError(erro)) {
    if (!erro.response) {
      return { mensagem: "Não foi possível conectar à API. Verifique se ela está rodando.", campos: {} };
    }
    const dados = erro.response.data as { message?: string; erros?: ErrosCampos } | undefined;
    return { mensagem: dados?.message ?? "Erro inesperado", campos: dados?.erros ?? {} };
  }
  return { mensagem: "Erro inesperado", campos: {} };
}
