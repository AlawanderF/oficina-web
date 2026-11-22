/**
 * Erro de negócio com status HTTP. Lançado pelos services e traduzido pelo middleware de erros.
 * `erros` (opcional) associa a mensagem a um campo, para o formulário exibir perto dele.
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly erros?: Record<string, string>,
  ) {
    super(message);
    this.name = "AppError";
  }
}
