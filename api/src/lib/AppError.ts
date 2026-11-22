/** Erro de negócio com status HTTP. Lançado pelos services, traduzido pelo middleware de erros. */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
