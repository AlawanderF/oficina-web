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

/** Maior valor da coluna INT do PostgreSQL. Ids acima disso derrubariam a consulta. */
export const INT_MAX = 2_147_483_647;

/** Mensagens em português também para tipo errado (ex.: número no lugar de texto). */
const textoBase = (campo: string, obrigatorio = `${campo} é obrigatório`) =>
  z.string({ required_error: obrigatorio, invalid_type_error: `${campo} deve ser um texto` });

/*
 * Caracteres de controle (ex.: NUL \u0000) não são digitáveis e o PostgreSQL recusa
 * o NUL em colunas TEXT (viraria erro 500). Campos de uma linha recusam todos;
 * descrições aceitam quebra de linha (\n, \r) e tabulação (\t).
 */
// eslint-disable-next-line no-control-regex
const CONTROLE = /[\u0000-\u001f\u007f]/;
// eslint-disable-next-line no-control-regex
const CONTROLE_EXCETO_LINHA = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const texto = (campo: string, min = 2, max = 120) =>
  textoBase(campo)
    .trim()
    .min(min, `${campo} deve ter pelo menos ${min} caracteres`)
    .max(max, `${campo} deve ter no máximo ${max} caracteres`)
    .refine((s) => !CONTROLE.test(s), `${campo} contém caracteres inválidos`);

/** Texto longo (descrições): aceita quebra de linha e tabulação, recusa os demais controles. */
const textoLongo = (campo: string, min: number, max: number) =>
  textoBase(campo)
    .trim()
    .min(min, `${campo} deve ter pelo menos ${min} caracteres`)
    .max(max, `${campo} deve ter no máximo ${max} caracteres`)
    .refine((s) => !CONTROLE_EXCETO_LINHA.test(s), `${campo} contém caracteres inválidos`);

const email = textoBase("E-mail")
  .trim()
  .toLowerCase()
  .max(254, "E-mail muito longo")
  .email("E-mail inválido");

const cpf = textoBase("CPF").transform(somenteDigitos).refine(cpfValido, "CPF inválido");

const telefone = textoBase("Telefone")
  .transform(somenteDigitos)
  .refine((s) => /^\d{10,11}$/.test(s), "Telefone deve ter DDD + número (10 ou 11 dígitos)");

/** Placa antiga (ABC1234) ou Mercosul (ABC1D23). Aceita hífen/minúsculas. */
const placa = textoBase("Placa", "Placa é obrigatória")
  .transform((s) => s.replace(/[^a-z0-9]/gi, "").toUpperCase())
  .refine((s) => /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(s), "Placa inválida (ex.: ABC1D23)");

const idRelacionado = (campo: string) =>
  z
    .number({
      required_error: `${campo} é obrigatório`,
      invalid_type_error: `Selecione ${campo.toLowerCase()}`,
    })
    .int(`Selecione ${campo.toLowerCase()}`)
    .positive(`Selecione ${campo.toLowerCase()}`)
    .max(INT_MAX, `${campo} inválido`);

/** true se "YYYY-MM-DD" é uma data real do calendário (rejeita 2026-02-30, 2026-13-01...). */
export function dataValida(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** Data sem hora no formato YYYY-MM-DD (o mesmo do <input type="date">). */
const data = (campo: string) =>
  z
    .string({ required_error: `${campo} é obrigatória`, invalid_type_error: `${campo} inválida` })
    .refine(dataValida, `${campo} inválida (use AAAA-MM-DD)`);

/** bcrypt considera só os primeiros 72 BYTES (acentos ocupam 2 bytes em UTF-8). */
const tamanhoEmBytes = (s: string) => new TextEncoder().encode(s).length;

// ---------------------------------------------------------------------------
// Usuário (login)
// ---------------------------------------------------------------------------

export const cadastroUsuarioSchema = z.object({
  nome: texto("Nome", 3),
  email,
  senha: z
    .string({ required_error: "Senha é obrigatória", invalid_type_error: "Senha deve ser um texto" })
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .refine((s) => tamanhoEmBytes(s) <= 72, "A senha é longa demais (máximo de 72 bytes)"),
});

export const loginSchema = z.object({
  email,
  senha: z
    .string({ required_error: "Senha é obrigatória", invalid_type_error: "Senha deve ser um texto" })
    .min(1, "Senha é obrigatória")
    .max(200, "Senha inválida"),
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

export const veiculoSchema = z.object({
  placa,
  marca: texto("Marca", 2, 40),
  modelo: texto("Modelo", 1, 60),
  ano: z
    .number({ required_error: "Ano é obrigatório", invalid_type_error: "Ano deve ser um número" })
    .int("Ano deve ser inteiro")
    .min(1950, "Ano deve ser a partir de 1950")
    // calculado a cada validação (não "congela" o ano em que o servidor subiu)
    .refine((ano) => ano <= new Date().getFullYear() + 1, "Ano não pode ser posterior ao próximo ano"),
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
    descricao: textoLongo("Descrição", 5, 500),
    status: z.enum(STATUS_ORDEM, { errorMap: () => ({ message: "Selecione um status válido" }) }),
    valor: z
      .number({ required_error: "Valor é obrigatório", invalid_type_error: "Valor deve ser um número" })
      .min(0, "Valor não pode ser negativo")
      .max(9_999_999.99, "Valor muito alto")
      // evita arredondamento silencioso no banco (coluna DECIMAL(10,2))
      .refine((v) => Math.abs(Math.round(v * 100) - v * 100) < 1e-6, "Use no máximo 2 casas decimais"),
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
    // datas já validadas como YYYY-MM-DD: a comparação de texto equivale à cronológica
    if (os.dataConclusao && os.dataConclusao < os.dataAbertura) {
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
