import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_EMAIL = "professor@oficina.com";
const SEED_SENHA = "senha1234";

async function main() {
  // Recria os dados de exemplo, na ordem das dependências (filhas antes das pais).
  // As contas de usuário NÃO são apagadas: rodar o seed de novo preserva quem se cadastrou.
  await prisma.ordemServico.deleteMany();
  await prisma.veiculo.deleteMany();
  await prisma.mecanico.deleteMany();
  await prisma.cliente.deleteMany();

  // Usuário do professor: cria se não existe; se existe, restaura a senha documentada no README
  const senhaHash = await bcrypt.hash(SEED_SENHA, 10);
  await prisma.usuario.upsert({
    where: { email: SEED_EMAIL },
    update: { nome: "Professor", senha: senhaHash },
    create: { nome: "Professor", email: SEED_EMAIL, senha: senhaHash },
  });

  const clientes = await Promise.all(
    [
      { nome: "Ana Paula Souza", cpf: "52998224725", telefone: "11987654321", email: "ana.souza@email.com" },
      {
        nome: "Bruno Henrique Lima",
        cpf: "11144477735",
        telefone: "11976543210",
        email: "bruno.lima@email.com",
      },
      {
        nome: "Carla Mendes Rocha",
        cpf: "39053344705",
        telefone: "21965432109",
        email: "carla.rocha@email.com",
      },
      {
        nome: "Diego Martins Alves",
        cpf: "12345678909",
        telefone: "31954321098",
        email: "diego.alves@email.com",
      },
    ].map((data) => prisma.cliente.create({ data })),
  );

  const veiculos = await Promise.all(
    [
      { placa: "ABC1D23", marca: "Volkswagen", modelo: "Gol 1.6", ano: 2019, clienteId: clientes[0].id },
      { placa: "BRA2E19", marca: "Chevrolet", modelo: "Onix LT", ano: 2022, clienteId: clientes[0].id },
      { placa: "QWE4R56", marca: "Fiat", modelo: "Argo Drive", ano: 2021, clienteId: clientes[1].id },
      { placa: "JKL7M89", marca: "Toyota", modelo: "Corolla XEi", ano: 2020, clienteId: clientes[2].id },
      { placa: "FGH3I45", marca: "Honda", modelo: "Civic EXL", ano: 2018, clienteId: clientes[3].id },
      { placa: "XYZ9A87", marca: "Hyundai", modelo: "HB20 Comfort", ano: 2023, clienteId: clientes[3].id },
    ].map((data) => prisma.veiculo.create({ data })),
  );

  const mecanicos = await Promise.all(
    [
      {
        nome: "Roberto Carlos Pereira",
        especialidade: "Motor e injeção eletrônica",
        telefone: "11933332222",
      },
      { nome: "Fernanda Oliveira", especialidade: "Suspensão e freios", telefone: "11944445555" },
      { nome: "Marcos Vinícius Teixeira", especialidade: "Elétrica automotiva", telefone: "11955556666" },
    ].map((data) => prisma.mecanico.create({ data })),
  );

  /**
   * Datas RELATIVAS a hoje: o histórico parece sempre atual, não importa quando o seed rode.
   * Coluna DATE: meia-noite UTC do dia.
   */
  const diasAtras = (n: number) => {
    const hoje = new Date();
    return new Date(Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - n));
  };
  const [gol, onix, argo, corolla, civic, hb20] = veiculos;
  const [roberto, fernanda, marcos] = mecanicos;

  // Em ordem cronológica: as mais recentes ficam com os maiores números de OS
  const ordens = [
    {
      v: corolla,
      m: roberto,
      d: "Revisão de 40.000 km com troca de velas e filtros",
      s: "CONCLUIDA",
      valor: 980,
      ab: 168,
      con: 166,
    },
    {
      v: gol,
      m: fernanda,
      d: "Troca de pastilhas de freio traseiras",
      s: "CONCLUIDA",
      valor: 420,
      ab: 150,
      con: 149,
    },
    {
      v: civic,
      m: marcos,
      d: "Reparo no chicote do farol esquerdo",
      s: "CONCLUIDA",
      valor: 310,
      ab: 141,
      con: 140,
    },
    {
      v: argo,
      m: roberto,
      d: "Limpeza de bicos injetores e corpo de borboleta",
      s: "CONCLUIDA",
      valor: 560,
      ab: 122,
      con: 121,
    },
    {
      v: hb20,
      m: fernanda,
      d: "Substituição de bieletas e buchas da bandeja",
      s: "CONCLUIDA",
      valor: 1150,
      ab: 104,
      con: 101,
    },
    { v: onix, m: roberto, d: "Troca do kit de embreagem", s: "CONCLUIDA", valor: 1980, ab: 92, con: 88 },
    {
      v: corolla,
      m: marcos,
      d: "Diagnóstico e troca do sensor de oxigênio",
      s: "CONCLUIDA",
      valor: 740,
      ab: 75,
      con: 74,
    },
    {
      v: gol,
      m: roberto,
      d: "Troca de óleo e filtros (óleo, ar e combustível)",
      s: "CONCLUIDA",
      valor: 389.9,
      ab: 51,
      con: 51,
    },
    {
      v: argo,
      m: fernanda,
      d: "Substituição de pastilhas e discos de freio dianteiros",
      s: "CONCLUIDA",
      valor: 1240,
      ab: 43,
      con: 41,
    },
    {
      v: corolla,
      m: marcos,
      d: "Diagnóstico de falha intermitente no alternador",
      s: "CONCLUIDA",
      valor: 680.5,
      ab: 33,
      con: 30,
    },
    {
      v: argo,
      m: marcos,
      d: "Troca de bateria (cliente desistiu do serviço)",
      s: "CANCELADA",
      valor: 0,
      ab: 17,
      con: null,
    },
    {
      v: civic,
      m: roberto,
      d: "Higienização do ar-condicionado e troca do filtro de cabine",
      s: "CONCLUIDA",
      valor: 290,
      ab: 12,
      con: 11,
    },
    {
      v: civic,
      m: roberto,
      d: "Revisão de 60.000 km com troca de correia dentada",
      s: "EM_ANDAMENTO",
      valor: 2150,
      ab: 8,
      con: null,
    },
    { v: hb20, m: fernanda, d: "Alinhamento e balanceamento", s: "CONCLUIDA", valor: 180, ab: 6, con: 6 },
    {
      v: onix,
      m: fernanda,
      d: "Troca de amortecedores dianteiros e traseiros",
      s: "EM_ANDAMENTO",
      valor: 1890,
      ab: 4,
      con: null,
    },
    {
      v: hb20,
      m: marcos,
      d: "Instalação de central multimídia e câmera de ré",
      s: "ABERTA",
      valor: 950,
      ab: 2,
      con: null,
    },
    {
      v: gol,
      m: roberto,
      d: "Ruído no motor em marcha lenta: avaliação",
      s: "ABERTA",
      valor: 150,
      ab: 1,
      con: null,
    },
  ] as const;

  await prisma.ordemServico.createMany({
    data: ordens.map((o) => ({
      veiculoId: o.v!.id,
      mecanicoId: o.m!.id,
      descricao: o.d,
      status: o.s,
      valor: o.valor,
      dataAbertura: diasAtras(o.ab),
      dataConclusao: o.con === null ? null : diasAtras(o.con),
    })),
  });

  console.log(`✅ Seed concluído. Login: ${SEED_EMAIL} / ${SEED_SENHA}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
