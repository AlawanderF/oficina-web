import { describe, expect, it } from "vitest";
import { clienteSchema, cpfValido, ordemServicoSchema, veiculoSchema } from "../src";

describe("cpfValido", () => {
  it("aceita CPFs com dígitos verificadores corretos", () => {
    expect(cpfValido("52998224725")).toBe(true);
    expect(cpfValido("11144477735")).toBe(true);
  });

  it("rejeita dígito errado, tamanho errado e sequências repetidas", () => {
    expect(cpfValido("52998224726")).toBe(false);
    expect(cpfValido("1234567890")).toBe(false);
    expect(cpfValido("11111111111")).toBe(false);
  });
});

describe("clienteSchema", () => {
  it("normaliza CPF, telefone e e-mail", () => {
    const r = clienteSchema.parse({
      nome: "  Ana Souza ",
      cpf: "529.982.247-25",
      telefone: "(11) 98765-4321",
      email: " Ana@Email.COM ",
    });
    expect(r).toEqual({
      nome: "Ana Souza",
      cpf: "52998224725",
      telefone: "11987654321",
      email: "ana@email.com",
    });
  });

  it("devolve mensagem por campo", () => {
    const r = clienteSchema.safeParse({ nome: "A", cpf: "000", telefone: "1", email: "x" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const campos = r.error.issues.map((i) => i.path[0]);
      expect(campos).toEqual(expect.arrayContaining(["nome", "cpf", "telefone", "email"]));
    }
  });
});

describe("veiculoSchema", () => {
  const base = { marca: "Fiat", modelo: "Uno", ano: 2015, clienteId: 1 };

  it("aceita placa antiga e Mercosul, normalizando para maiúsculas", () => {
    expect(veiculoSchema.parse({ ...base, placa: "abc-1234" }).placa).toBe("ABC1234");
    expect(veiculoSchema.parse({ ...base, placa: "bra2e19" }).placa).toBe("BRA2E19");
  });

  it("rejeita placa inválida", () => {
    expect(veiculoSchema.safeParse({ ...base, placa: "12ABC34" }).success).toBe(false);
  });
});

describe("ordemServicoSchema", () => {
  const base = {
    veiculoId: 1,
    mecanicoId: 1,
    descricao: "Troca de óleo",
    valor: 200,
    dataAbertura: "2026-11-10",
  };

  it("exige data de conclusão quando a OS está concluída", () => {
    const r = ordemServicoSchema.safeParse({ ...base, status: "CONCLUIDA" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path).toEqual(["dataConclusao"]);
  });

  it("não aceita conclusão antes da abertura", () => {
    const r = ordemServicoSchema.safeParse({ ...base, status: "CONCLUIDA", dataConclusao: "2026-11-01" });
    expect(r.success).toBe(false);
  });

  it("aceita OS aberta sem data de conclusão", () => {
    expect(ordemServicoSchema.safeParse({ ...base, status: "ABERTA" }).success).toBe(true);
  });
});
