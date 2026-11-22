import { IconTool } from "@tabler/icons-react";

interface Props {
  /** Mostra só o símbolo (menu recolhido) */
  compacta?: boolean;
  /** Cor do texto do subtítulo (a barra lateral é sempre escura) */
  claro?: boolean;
}

/** Logotipo do AutoGestor: símbolo laranja + nome. */
export default function Marca({ compacta = false, claro = true }: Props) {
  return (
    <span className="marca" style={claro ? undefined : { color: "var(--mantine-color-text)" }}>
      <span className="marca-simbolo" aria-hidden>
        <IconTool size={18} stroke={2} />
      </span>
      {!compacta && (
        <span>
          <span className="marca-nome" style={{ display: "block" }}>
            AutoGestor
          </span>
          <span className="marca-sub" style={{ display: "block" }}>
            Gestão de oficina
          </span>
        </span>
      )}
    </span>
  );
}
