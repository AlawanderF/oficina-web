import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_EMAIL = "professor@oficina.com";
const SEED_SENHA = "senha1234";

async function main() {
  // Limpa na ordem das dependências (filhas antes das pais) para o seed ser idempotente
  await prisma.ordemServico.deleteMany();
  await prisma.veiculo.deleteMany();
  await prisma.mecanico.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.usuario.deleteMany();

  await prisma.usuario.create({
    data: { nome: "Professor", email: SEED_EMAIL, senha: await bcrypt.hash(SEED_SENHA, 10) },
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

  const d = (s: string) => new Date(s);
  await prisma.ordemServico.createMany({
    data: [
      {
        veiculoId: veiculos[0].id,
        mecanicoId: mecanicos[0].id,
        descricao: "Troca de óleo e filtros (óleo, ar e combustível)",
        status: "CONCLUIDA",
        valor: 389.9,
        dataAbertura: d("2026-10-02"),
        dataConclusao: d("2026-10-02"),
      },
      {
        veiculoId: veiculos[2].id,
        mecanicoId: mecanicos[1].id,
        descricao: "Substituição de pastilhas e discos de freio dianteiros",
        status: "CONCLUIDA",
        valor: 1240.0,
        dataAbertura: d("2026-10-10"),
        dataConclusao: d("2026-10-12"),
      },
      {
        veiculoId: veiculos[3].id,
        mecanicoId: mecanicos[2].id,
        descricao: "Diagnóstico de falha intermitente no alternador",
        status: "CONCLUIDA",
        valor: 680.5,
        dataAbertura: d("2026-10-20"),
        dataConclusao: d("2026-10-23"),
      },
      {
        veiculoId: veiculos[4].id,
        mecanicoId: mecanicos[0].id,
        descricao: "Revisão de 60.000 km com troca de correia dentada",
        status: "EM_ANDAMENTO",
        valor: 2150.0,
        dataAbertura: d("2026-11-14"),
      },
      {
        veiculoId: veiculos[1].id,
        mecanicoId: mecanicos[1].id,
        descricao: "Alinhamento, balanceamento e troca de amortecedores",
        status: "EM_ANDAMENTO",
        valor: 1890.0,
        dataAbertura: d("2026-11-18"),
      },
      {
        veiculoId: veiculos[5].id,
        mecanicoId: mecanicos[2].id,
        descricao: "Instalação de central multimídia e câmera de ré",
        status: "ABERTA",
        valor: 950.0,
        dataAbertura: d("2026-11-20"),
      },
      {
        veiculoId: veiculos[0].id,
        mecanicoId: mecanicos[0].id,
        descricao: "Ruído no motor em marcha lenta: avaliação",
        status: "ABERTA",
        valor: 150.0,
        dataAbertura: d("2026-11-21"),
      },
      {
        veiculoId: veiculos[2].id,
        mecanicoId: mecanicos[2].id,
        descricao: "Troca de bateria (cliente desistiu do serviço)",
        status: "CANCELADA",
        valor: 0,
        dataAbertura: d("2026-11-05"),
      },
    ],
  });

  console.log(`✅ Seed concluído. Login: ${SEED_EMAIL} / ${SEED_SENHA}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
