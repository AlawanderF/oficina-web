/** Formatação de dados para exibição (não altera o que é enviado à API). */

export const formatarCpf = (cpf: string) => cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

export const mascararCpf = (valor: string) => {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  return d.replace(/^(\d{3})(\d)/, "$1.$2").replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1-$2");
};

export const mascararTelefone = (valor: string) => {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  if (d.length < 3) return `(${d}`;
  const tamanhoLocal = d.length > 10 ? 5 : 4;
  const parcial = d.slice(2);
  if (parcial.length <= tamanhoLocal) return `(${d.slice(0, 2)}) ${parcial}`;
  return `(${d.slice(0, 2)}) ${parcial.slice(0, tamanhoLocal)}-${parcial.slice(tamanhoLocal)}`;
};

export const mascararPlaca = (valor: string) => {
  const d = valor.replace(/[^a-z0-9]/gi, "").slice(0, 7).toUpperCase();
  return /^[A-Z]{3}\d{0,4}$/.test(d) && d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}` : d;
};

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
