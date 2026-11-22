import { formatarPlaca } from "../lib/formatos";

/** Placa no estilo Mercosul (faixa azul no topo), usada nas listagens. */
export default function Placa({ placa }: { placa: string }) {
  const texto = formatarPlaca(placa);
  return (
    <span className="placa" role="img" aria-label={`Placa ${texto}`}>
      <span className="placa-faixa" />
      <span className="placa-texto">{texto}</span>
    </span>
  );
}
