import axios from "axios";
import type {
  CadastroUsuarioInput,
  ClienteInput,
  LoginInput,
  MecanicoInput,
  OrdemServicoInput,
  VeiculoInput,
} from "shared";
import { encerrarSessao, lerToken } from "./sessao";
import type { Cliente, Mecanico, OrdemServico, Usuario, Veiculo } from "./types";

/** Instância única do Axios: toda chamada à API passa por aqui. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333",
  timeout: 15_000,
});

// Anexa o token JWT em toda requisição
api.interceptors.request.use((config) => {
  const token = lerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Sessão expirada: limpa e volta ao login (exceto nas próprias rotas de auth)
api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const url: string = erro.config?.url ?? "";
    if (erro.response?.status === 401 && !url.startsWith("/auth")) {
      encerrarSessao();
      window.location.assign("/login?expirada=1");
    }
    return Promise.reject(erro);
  },
);

// ---------------------------------------------------------------------------
// Autenticação
// ---------------------------------------------------------------------------
export const authApi = {
  cadastrar: (dados: CadastroUsuarioInput) => api.post<Usuario>("/auth/cadastro", dados).then((r) => r.data),
  login: (dados: LoginInput) =>
    api.post<{ token: string; usuario: Usuario }>("/auth/login", dados).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// CRUD: mesmo contrato para os 4 recursos
// ---------------------------------------------------------------------------
export interface CrudApi<T, I> {
  listar(): Promise<T[]>;
  criar(dados: I): Promise<T>;
  atualizar(id: number, dados: I): Promise<T>;
  remover(id: number): Promise<void>;
}

function criarCrud<T, I>(rota: string): CrudApi<T, I> {
  return {
    listar: () => api.get<T[]>(rota).then((r) => r.data),
    criar: (dados) => api.post<T>(rota, dados).then((r) => r.data),
    atualizar: (id, dados) => api.put<T>(`${rota}/${id}`, dados).then((r) => r.data),
    remover: (id) => api.delete(`${rota}/${id}`).then(() => undefined),
  };
}

export const clientesApi = criarCrud<Cliente, ClienteInput>("/clientes");
export const veiculosApi = criarCrud<Veiculo, VeiculoInput>("/veiculos");
export const mecanicosApi = criarCrud<Mecanico, MecanicoInput>("/mecanicos");
export const ordensApi = criarCrud<OrdemServico, OrdemServicoInput>("/ordens-servico");
