import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

const sufixo = Date.now().toString().slice(-6);
const usuario = { nome: "Usuário de Teste", email: `teste${sufixo}@oficina.com`, senha: "senhaSegura123" };
let token = "";

const auth = () => ({ Authorization: `Bearer ${token}` });

// CPF válido gerado a partir de 9 dígitos aleatórios
function gerarCpf(): string {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("");
  const dv = (s: string) => {
    let soma = 0;
    for (let i = 0; i < s.length; i++) soma += Number(s[i]) * (s.length + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = dv(base);
  return base + d1 + dv(base + d1);
}

afterAll(async () => {
  await prisma.usuario.deleteMany({ where: { email: usuario.email } });
  await prisma.$disconnect();
});

describe("Auth", () => {
  it("cadastra usuário sem devolver a senha (201)", async () => {
    const res = await request(app).post("/auth/cadastro").send(usuario);
    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty("senha");
    expect(res.body.email).toBe(usuario.email);
  });

  it("guarda a senha como hash bcrypt, nunca em texto puro", async () => {
    const salvo = await prisma.usuario.findUniqueOrThrow({ where: { email: usuario.email } });
    expect(salvo.senha).not.toBe(usuario.senha);
    expect(salvo.senha).toMatch(/^\$2[aby]\$/);
  });

  it("recusa e-mail repetido (409)", async () => {
    const res = await request(app).post("/auth/cadastro").send(usuario);
    expect(res.status).toBe(409);
  });

  it("recusa senha errada (401)", async () => {
    const res = await request(app).post("/auth/login").send({ email: usuario.email, senha: "errada123" });
    expect(res.status).toBe(401);
  });

  it("faz login e devolve token sem senha (200)", async () => {
    const res = await request(app).post("/auth/login").send({ email: usuario.email, senha: usuario.senha });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf("string");
    expect(res.body.usuario).not.toHaveProperty("senha");
    token = res.body.token;
  });

  it("bloqueia rota protegida sem token (401)", async () => {
    const res = await request(app).get("/clientes");
    expect(res.status).toBe(401);
  });
});

describe("Fluxo completo: cliente -> veículo -> mecânico -> ordem de serviço", () => {
  const cpf = gerarCpf();
  const placa = `TST${Math.floor(Math.random() * 10)}A${sufixo.slice(-2)}`;
  const ids = { cliente: 0, veiculo: 0, mecanico: 0, ordem: 0 };

  beforeAll(() => {
    expect(token).not.toBe("");
  });

  it("valida o corpo com Zod e devolve a mensagem por campo (400)", async () => {
    const res = await request(app).post("/clientes").set(auth()).send({ nome: "A", cpf: "123", email: "x" });
    expect(res.status).toBe(400);
    expect(res.body.erros).toHaveProperty("nome");
    expect(res.body.erros).toHaveProperty("cpf");
    expect(res.body.erros).toHaveProperty("telefone");
    expect(res.body.erros).toHaveProperty("email");
  });

  it("cria cliente (201) normalizando o CPF", async () => {
    const formatado = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
    const res = await request(app).post("/clientes").set(auth()).send({
      nome: "Cliente Teste",
      cpf: formatado,
      telefone: "(11) 91234-5678",
      email: "Cliente@Teste.com",
    });
    expect(res.status).toBe(201);
    expect(res.body.cpf).toBe(cpf);
    expect(res.body.email).toBe("cliente@teste.com");
    ids.cliente = res.body.id;
  });

  it("recusa CPF repetido com mensagem clara (409, não 500)", async () => {
    const res = await request(app)
      .post("/clientes")
      .set(auth())
      .send({ nome: "Outro Cliente", cpf, telefone: "11912345678", email: "outro@teste.com" });
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/CPF/);
    expect(res.body.erros).toHaveProperty("cpf");
  });

  it("cria veículo ligado ao cliente e lista com o nome do cliente (include)", async () => {
    const res = await request(app)
      .post("/veiculos")
      .set(auth())
      .send({ placa, marca: "Fiat", modelo: "Uno", ano: 2015, clienteId: ids.cliente });
    expect(res.status).toBe(201);
    ids.veiculo = res.body.id;

    const lista = await request(app).get("/veiculos").set(auth());
    const criado = lista.body.find((v: { id: number }) => v.id === ids.veiculo);
    expect(criado.cliente.nome).toBe("Cliente Teste");
  });

  it("cria mecânico (201)", async () => {
    const res = await request(app)
      .post("/mecanicos")
      .set(auth())
      .send({ nome: "Mecânico Teste", especialidade: "Motor", telefone: "11999998888" });
    expect(res.status).toBe(201);
    ids.mecanico = res.body.id;
  });

  it("exige data de conclusão para OS concluída (regra de negócio, 400)", async () => {
    const res = await request(app).post("/ordens-servico").set(auth()).send({
      veiculoId: ids.veiculo,
      mecanicoId: ids.mecanico,
      descricao: "Troca de óleo",
      status: "CONCLUIDA",
      valor: 200,
      dataAbertura: "2026-11-01",
    });
    expect(res.status).toBe(400);
    expect(res.body.erros).toHaveProperty("dataConclusao");
  });

  it("cria OS e a listagem traz veículo, cliente e mecânico (include)", async () => {
    const res = await request(app).post("/ordens-servico").set(auth()).send({
      veiculoId: ids.veiculo,
      mecanicoId: ids.mecanico,
      descricao: "Troca de óleo e filtro",
      status: "ABERTA",
      valor: 250.5,
      dataAbertura: "2026-11-01",
    });
    expect(res.status).toBe(201);
    ids.ordem = res.body.id;

    const lista = await request(app).get("/ordens-servico").set(auth());
    const os = lista.body.find((o: { id: number }) => o.id === ids.ordem);
    expect(os.veiculo.placa).toBe(placa);
    expect(os.veiculo.cliente.nome).toBe("Cliente Teste");
    expect(os.mecanico.nome).toBe("Mecânico Teste");
  });

  it("edita OS (200)", async () => {
    const res = await request(app).put(`/ordens-servico/${ids.ordem}`).set(auth()).send({
      veiculoId: ids.veiculo,
      mecanicoId: ids.mecanico,
      descricao: "Troca de óleo e filtro",
      status: "CONCLUIDA",
      valor: 300,
      dataAbertura: "2026-11-01",
      dataConclusao: "2026-11-02",
    });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("CONCLUIDA");
  });

  it("não remove cliente com veículos vinculados (409)", async () => {
    const res = await request(app).delete(`/clientes/${ids.cliente}`).set(auth());
    expect(res.status).toBe(409);
  });

  it("devolve 404 para id inexistente e 400 para id inválido", async () => {
    expect((await request(app).get("/clientes/999999999").set(auth())).status).toBe(404);
    expect(
      (
        await request(app)
          .put("/mecanicos/999999999")
          .set(auth())
          .send({ nome: "Fulano", especialidade: "Motor", telefone: "11999998888" })
      ).status,
    ).toBe(404);
    expect((await request(app).get("/clientes/abc").set(auth())).status).toBe(400);
  });

  it("remove em cascata manual: OS, veículo, mecânico e cliente (204)", async () => {
    expect((await request(app).delete(`/ordens-servico/${ids.ordem}`).set(auth())).status).toBe(204);
    expect((await request(app).delete(`/veiculos/${ids.veiculo}`).set(auth())).status).toBe(204);
    expect((await request(app).delete(`/mecanicos/${ids.mecanico}`).set(auth())).status).toBe(204);
    expect((await request(app).delete(`/clientes/${ids.cliente}`).set(auth())).status).toBe(204);
    expect((await request(app).get(`/clientes/${ids.cliente}`).set(auth())).status).toBe(404);
  });
});
