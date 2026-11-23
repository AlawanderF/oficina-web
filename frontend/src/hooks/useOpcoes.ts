import { useCallback, useEffect, useState } from "react";
import { errosDaApi } from "../services/erros";

export function useOpcoes<T>(carregarDados: () => Promise<T[]>, ativo: boolean) {
  const [dados, setDados] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      setDados(await carregarDados());
    } catch (e) {
      setErro(errosDaApi(e).mensagem);
      setDados([]);
    } finally {
      setCarregando(false);
    }
  }, [carregarDados]);

  useEffect(() => {
    if (ativo) void carregar();
  }, [ativo, carregar]);

  return { dados, carregando, erro, recarregar: carregar };
}
