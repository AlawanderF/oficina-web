import { describe, expect, it } from "vitest";
import {
  cadastroUsuarioSchema,
  clienteSchema,
  cpfValido,
  dataValida,
  loginSchema,
  mecanicoSchema,
  ordemServicoSchema,
  veiculoSchema,
} from "../src";

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

describe("mecanicoSchema", () => {
  it("aceita dados válidos e normaliza o telefone", () => {
    expect(
      mecanicoSchema.parse({ nome: "Maria Silva", especialidade: "Mecânica", telefone: "(11) 98888-7777" }),
    ).toEqual({ nome: "Maria Silva", especialidade: "Mecânica", telefone: "11988887777" });
  });

  it("rejeita nome com menos de 3 letras", () => {
    const resultado = mecanicoSchema.safeParse({
      nome: "Al",
      especialidade: "Mecânica",
      telefone: "11988887777",
    });
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues.find((issue) => issue.path[0] === "nome")?.message).toBe(
        "Nome deve ter pelo menos 3 caracteres",
      );
    }
  });

  it("rejeita telefone sem DDD", () => {
    expect(
      mecanicoSchema.safeParse({ nome: "Maria Silva", especialidade: "Mecânica", telefone: "98888777" })
        .success,
    ).toBe(false);
  });
});

describe("cadastroUsuarioSchema", () => {
  it("rejeita senha com menos de 8 caracteres", () => {
    expect(
      cadastroUsuarioSchema.safeParse({ nome: "Maria Silva", email: "maria@email.com", senha: "curta" })
        .success,
    ).toBe(false);
  });

  it("remove espaços e converte o e-mail para minúsculas", () => {
    expect(
      cadastroUsuarioSchema.parse({ nome: "Maria Silva", email: " Maria@Email.com ", senha: "senha123" })
        .email,
    ).toBe("maria@email.com");
  });
});

describe("loginSchema", () => {
  it("rejeita e-mail inválido", () => {
    expect(loginSchema.safeParse({ email: "invalido", senha: "senha123" }).success).toBe(false);
  });

  it("rejeita senha vazia com a mensagem esperada", () => {
    const resultado = loginSchema.safeParse({ email: "maria@email.com", senha: "" });
    expect(resultado.success).toBe(false);
    if (!resultado.success) {
      expect(resultado.error.issues.find((issue) => issue.path[0] === "senha")?.message).toBe(
        "Senha é obrigatória",
      );
    }
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

describe("dataValida", () => {
  it("aceita datas reais no formato AAAA-MM-DD", () => {
    expect(dataValida("2026-11-22")).toBe(true);
    expect(dataValida("2024-02-29")).toBe(true); // ano bissexto
  });

  it("rejeita datas impossíveis, com hora/fuso ou formato errado", () => {
    for (const d of ["2026-02-30", "2025-02-29", "2026-13-01", "2026-11-01T00:00:00Z", "22/11/2026", ""]) {
      expect(dataValida(d), d).toBe(false);
    }
  });
});

describe("ordemServicoSchema: valor", () => {
  const base = {
    veiculoId: 1,
    mecanicoId: 1,
    descricao: "Troca de óleo",
    status: "ABERTA",
    dataAbertura: "2026-11-10",
  };

  it("aceita até 2 casas decimais (inclusive valores com erro de ponto flutuante como 0.1 + 0.2)", () => {
    expect(ordemServicoSchema.safeParse({ ...base, valor: 1450.5 }).success).toBe(true);
    expect(ordemServicoSchema.safeParse({ ...base, valor: 0.1 + 0.2 }).success).toBe(true);
  });

  it("rejeita mais de 2 casas decimais", () => {
    expect(ordemServicoSchema.safeParse({ ...base, valor: 10.555 }).success).toBe(false);
  });

  it("rejeita id acima do INT do banco", () => {
    expect(ordemServicoSchema.safeParse({ ...base, valor: 10, veiculoId: 2_147_483_648 }).success).toBe(
      false,
    );
  });
});
