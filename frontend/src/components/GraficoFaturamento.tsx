import { Text, Tooltip } from "@mantine/core";
import { formatarMoeda } from "../lib/formatos";

export interface PontoMensal {
  /** Rótulo curto do mês, ex.: "nov" */
  mes: string;
  /** Rótulo completo para o tooltip, ex.: "novembro de 2026" */
  mesCompleto: string;
  valor: number;
  quantidade: number;
}

const compacto = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Arredonda o topo do eixo para um valor "redondo" divisível em 4 faixas. */
function topoDoEixo(maximo: number) {
  if (maximo <= 0) return 1000;
  const potencia = 10 ** Math.floor(Math.log10(maximo));
  return [1, 2, 4, 5, 8, 10].find((m) => m * potencia >= maximo)! * potencia;
}

const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Gráfico de barras do faturamento mensal (o mês atual em destaque). */
export default function GraficoFaturamento({ dados }: { dados: PontoMensal[] }) {
  const topo = topoDoEixo(Math.max(...dados.map((d) => d.valor)));
  // Linhas de grade e rótulos do eixo saem do mesmo cálculo: sempre alinhados
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => f * topo);

  return (
    <div className="grafico" role="img" aria-label="Faturamento dos últimos seis meses">
      <div className="grafico-plot">
        {marcas.map((m) => (
          <div
            key={m}
            className="grafico-linha"
            data-base={m === 0 || undefined}
            style={{ bottom: `${(m / topo) * 100}%` }}
          >
            <span className="grafico-valor num">{m === 0 ? "R$ 0" : compacto.format(m)}</span>
          </div>
        ))}
        <div className="grafico-barras">
          {dados.map((d, i) => (
            <Tooltip
              key={d.mesCompleto}
              label={
                <>
                  <Text size="xs" fw={600}>
                    {maiuscula(d.mesCompleto)}
                  </Text>
                  <Text size="xs" className="num">
                    {formatarMoeda(d.valor)} · {d.quantidade} OS
                  </Text>
                </>
              }
            >
              <div
                className="grafico-coluna"
                tabIndex={0}
                aria-label={`${d.mesCompleto}: ${formatarMoeda(d.valor)}`}
              >
                <div
                  className="grafico-barra"
                  data-atual={i === dados.length - 1 || undefined}
                  style={{ height: `${(d.valor / topo) * 100}%` }}
                />
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="grafico-meses" aria-hidden>
        {dados.map((d) => (
          <span key={d.mesCompleto}>{maiuscula(d.mes)}</span>
        ))}
      </div>
    </div>
  );
}
