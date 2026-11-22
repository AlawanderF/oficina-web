import { notifications } from "@mantine/notifications";
import { useCallback, useEffect, useState } from "react";
import type { ZodType, ZodTypeDef } from "zod";
import type { CrudApi } from "../services/api";
import { errosDaApi, errosDoZod, type ErrosCampos } from "../services/erros";

interface Opcoes<T extends { id: number }, F, I> {
  /** Serviço Axios do recurso (services/api.ts) */
  api: CrudApi<T, I>;
  /** Schema do pacote shared — o MESMO usado pela API no validarBody */
  schema: ZodType<I, ZodTypeDef, unknown>;
  /** Estado inicial do formulário (novo registro) */
  formVazio: F;
  /** Converte um registro da lista para o formato do formulário (edição) */
  paraForm: (registro: T) => F;
  /** Converte o formulário para o formato esperado pelo schema (ex.: "3" -> 3) */
  paraEntrada?: (form: F) => unknown;
  /** Nome no singular, para as mensagens ("Cliente") */
  nome: string;
}

/**
 * Concentra a lógica que as 4 telas de cadastro têm em comum:
 * listar (useEffect), abrir o modal para criar/editar, validar com o schema
 * do shared, salvar via Axios, mostrar os erros da API e remover com confirmação.
 */
export function useCrud<T extends { id: number }, F, I>(opcoes: Opcoes<T, F, I>) {
  const { api, schema, formVazio, paraForm, paraEntrada, nome } = opcoes;

  const [registros, setRegistros] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState<T | null>(null);
  const [form, setForm] = useState<F>(formVazio);
  const [erros, setErros] = useState<ErrosCampos>({});
  const [salvando, setSalvando] = useState(false);

  const [removendo, setRemovendo] = useState<T | null>(null);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setRegistros(await api.listar());
      setErroLista("");
    } catch (erro) {
      setErroLista(errosDaApi(erro).mensagem);
    } finally {
      setCarregando(false);
    }
  }, [api]);

  // Lista os registros vindos da API ao abrir a tela
  useEffect(() => {
    void carregar();
  }, [carregar]);

  /** Atualiza um campo do formulário e limpa o erro dele. */
  function alterar<K extends keyof F>(campo: K, valor: F[K]) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
    setErros(({ [campo as string]: _removido, ...resto }) => resto);
  }

  function abrirNovo() {
    setEditando(null);
    setForm(formVazio);
    setErros({});
    setModalAberto(true);
  }

  function abrirEdicao(registro: T) {
    setEditando(registro);
    setForm(paraForm(registro));
    setErros({});
    setModalAberto(true);
  }

  const fecharModal = () => setModalAberto(false);

  /** Botão Salvar: valida no navegador -> chama a API -> recarrega a lista. */
  async function salvar() {
    // 1) Validação no frontend com o schema do shared (safeParse)
    const resultado = schema.safeParse(paraEntrada ? paraEntrada(form) : form);
    if (!resultado.success) {
      setErros(errosDoZod(resultado.error));
      return;
    }

    // 2) Envio pela camada de serviço (Axios)
    setSalvando(true);
    try {
      if (editando) await api.atualizar(editando.id, resultado.data);
      else await api.criar(resultado.data);

      setModalAberto(false);
      notifications.show({
        color: "teal",
        title: editando ? `${nome} atualizado(a)` : `${nome} cadastrado(a)`,
        message: "As alterações foram salvas.",
      });
      await carregar();
    } catch (erro) {
      // 3) Erros da API (validação 400, valor repetido 409...) aparecem no formulário
      const { mensagem, campos } = errosDaApi(erro);
      setErros({ ...campos, geral: mensagem });
    } finally {
      setSalvando(false);
    }
  }

  const pedirRemocao = (registro: T) => setRemovendo(registro);
  const cancelarRemocao = () => setRemovendo(null);

  async function confirmarRemocao() {
    if (!removendo) return;
    setConfirmandoRemocao(true);
    try {
      await api.remover(removendo.id);
      notifications.show({ color: "teal", title: `${nome} removido(a)`, message: "Registro excluído." });
      await carregar();
    } catch (erro) {
      notifications.show({
        color: "red",
        title: "Não foi possível remover",
        message: errosDaApi(erro).mensagem,
      });
    } finally {
      setConfirmandoRemocao(false);
      setRemovendo(null);
    }
  }

  return {
    registros,
    carregando,
    erroLista,
    recarregar: carregar,
    // formulário
    modalAberto,
    editando,
    form,
    alterar,
    erros,
    salvando,
    abrirNovo,
    abrirEdicao,
    fecharModal,
    salvar,
    // remoção
    removendo,
    confirmandoRemocao,
    pedirRemocao,
    cancelarRemocao,
    confirmarRemocao,
  };
}
