/** Formatação de dados para exibição (não altera o que é enviado à API). */

export const formatarCpf = (cpf: string) => cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

export function formatarTelefone(tel: string) {
  if (tel.length === 11) return tel.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  return tel.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
}

export const formatarPlaca = (placa: string) =>
  /^[A-Z]{3}\d{4}$/.test(placa) ? `${placa.slice(0, 3)}-${placa.slice(3)}` : placa;

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatarMoeda = (valor: number | string) => moeda.format(Number(valor));

/** Datas do banco são só dia (sem hora): exibir em UTC evita "voltar um dia". */
export const formatarData = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";

/** "2026-11-22T00:00:00.000Z" -> "2026-11-22" (valor de <input type="date">) */
export const paraInputData = (iso: string | null) => (iso ? iso.slice(0, 10) : "");

export const hojeIso = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD no fuso local

/** Busca sem diferenciar maiúsculas nem acentos. */
export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export const contem = (campos: (string | number)[], termo: string) =>
  normalizar(campos.join(" ")).includes(normalizar(termo.trim()));
