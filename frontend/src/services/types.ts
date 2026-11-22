import type { StatusOrdem } from "shared";

/** Formatos devolvidos pela API (respostas). As entradas vêm dos tipos do shared. */

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
}

export interface Veiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  clienteId: number;
  cliente: Cliente;
}

export interface Mecanico {
  id: number;
  nome: string;
  especialidade: string;
  telefone: string;
}

export interface OrdemServico {
  id: number;
  descricao: string;
  status: StatusOrdem;
  /** Decimal do PostgreSQL chega como texto, ex.: "1450.00" */
  valor: string;
  dataAbertura: string;
  dataConclusao: string | null;
  veiculoId: number;
  mecanicoId: number;
  veiculo: Veiculo;
  mecanico: Mecanico;
}
