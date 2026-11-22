// Erro com status HTTP, lançado pelos services e traduzido pelo middleware de erros
export class AppError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
