import { z } from "zod";

/*
 * Schemas de validação compartilhados entre a API (middleware validarBody)
 * e o frontend (safeParse antes de enviar). Uma única fonte de verdade.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const somenteDigitos = (s: string) => s.replace(/\D/g, "");

/** Valida CPF pelos dígitos verificadores (rejeita sequências repetidas). */
export function cpfValido(cpf: string): boolean {
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  const digito = (base: string) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (base.length + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = digito(cpf.slice(0, 9));
  const d2 = digito(cpf.slice(0, 9) + d1);
  return cpf.endsWith(`${d1}${d2}`);
}

const texto = (campo: string, min = 2, max = 120) =>
  z
    .string({ required_error: `${campo} é obrigatório`, invalid_type_error: `${campo} inválido` })
    .trim()
    .min(min, `${campo} deve ter pelo menos ${min} caracteres`)
    .max(max, `${campo} deve ter no máximo ${max} caracteres`);

const email = z
  .string({ required_error: "E-mail é obrigatório" })
  .trim()
  .toLowerCase()
  .email("E-mail inválido");

const cpf = z
  .string({ required_error: "CPF é obrigatório" })
  .transform(somenteDigitos)
  .refine(cpfValido, "CPF inválido");

const telefone = z
  .string({ required_error: "Telefone é obrigatório" })
  .transform(somenteDigitos)
  .refine((s) => /^\d{10,11}$/.test(s), "Telefone deve ter DDD + número (10 ou 11 dígitos)");

/** Placa antiga (ABC1234) ou Mercosul (ABC1D23). Aceita hífen/minúsculas. */
const placa = z
  .string({ required_error: "Placa é obrigatória" })
  .transform((s) => s.replace(/[^a-z0-9]/gi, "").toUpperCase())
  .refine((s) => /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(s), "Placa inválida (ex.: ABC1D23)");

const idRelacionado = (campo: string) =>
  z
    .number({
      required_error: `${campo} é obrigatório`,
      invalid_type_error: `Selecione ${campo.toLowerCase()}`,
    })
    .int()
    .positive(`Selecione ${campo.toLowerCase()}`);

const data = (campo: string) =>
  z.string({ required_error: `${campo} é obrigatória` }).regex(/^\d{4}-\d{2}-\d{2}/, `${campo} inválida`);

// ---------------------------------------------------------------------------
// Usuário (login)
// ---------------------------------------------------------------------------

export const cadastroUsuarioSchema = z.object({
  nome: texto("Nome", 3),
  email,
  senha: z
    .string({ required_error: "Senha é obrigatória" })
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres"),
});

export const loginSchema = z.object({
  email,
  senha: z.string({ required_error: "Senha é obrigatória" }).min(1, "Senha é obrigatória"),
});

// ---------------------------------------------------------------------------
// Domínio: Oficina mecânica
// ---------------------------------------------------------------------------

export const clienteSchema = z.object({
  nome: texto("Nome", 3),
  cpf,
  telefone,
  email,
});

const anoMaximo = new Date().getFullYear() + 1;

export const veiculoSchema = z.object({
  placa,
  marca: texto("Marca", 2, 40),
  modelo: texto("Modelo", 1, 60),
  ano: z
    .number({ required_error: "Ano é obrigatório", invalid_type_error: "Ano deve ser um número" })
    .int("Ano deve ser inteiro")
    .min(1950, "Ano deve ser a partir de 1950")
    .max(anoMaximo, `Ano deve ser até ${anoMaximo}`),
  clienteId: idRelacionado("Cliente"),
});

export const mecanicoSchema = z.object({
  nome: texto("Nome", 3),
  especialidade: texto("Especialidade", 3, 60),
  telefone,
});

export const STATUS_ORDEM = ["ABERTA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"] as const;
export type StatusOrdem = (typeof STATUS_ORDEM)[number];

export const STATUS_ORDEM_LABEL: Record<StatusOrdem, string> = {
  ABERTA: "Aberta",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

export const ordemServicoSchema = z
  .object({
    veiculoId: idRelacionado("Veículo"),
    mecanicoId: idRelacionado("Mecânico"),
    descricao: texto("Descrição", 5, 500),
    status: z.enum(STATUS_ORDEM, { errorMap: () => ({ message: "Selecione um status válido" }) }),
    valor: z
      .number({ required_error: "Valor é obrigatório", invalid_type_error: "Valor deve ser um número" })
      .min(0, "Valor não pode ser negativo")
      .max(9_999_999.99, "Valor muito alto"),
    dataAbertura: data("Data de abertura"),
    dataConclusao: data("Data de conclusão").nullable().optional(),
  })
  // Regras de negócio que envolvem mais de um campo
  .superRefine((os, ctx) => {
    if (os.status === "CONCLUIDA" && !os.dataConclusao) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dataConclusao"],
        message: "Informe a data de conclusão para OS concluída",
      });
    }
    if (os.dataConclusao && os.dataConclusao.slice(0, 10) < os.dataAbertura.slice(0, 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dataConclusao"],
        message: "Conclusão não pode ser antes da abertura",
      });
    }
  });

// ---------------------------------------------------------------------------
// Tipos inferidos dos schemas (usados na API e no frontend)
// ---------------------------------------------------------------------------

export type CadastroUsuarioInput = z.infer<typeof cadastroUsuarioSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
export type VeiculoInput = z.infer<typeof veiculoSchema>;
export type MecanicoInput = z.infer<typeof mecanicoSchema>;
export type OrdemServicoInput = z.infer<typeof ordemServicoSchema>;
