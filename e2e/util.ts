/** Sufixo curto e único por execução, para os dados criados pelos testes não colidirem. */
export const sufixo = () => Date.now().toString(36).slice(-5) + Math.floor(Math.random() * 1000);

/** Gera um CPF válido (dígitos verificadores corretos), já com máscara. */
export function gerarCpf(): string {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("");
  const digito = (s: string) => {
    let soma = 0;
    for (let i = 0; i < s.length; i++) soma += Number(s[i]) * (s.length + 1 - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  const d1 = digito(base);
  const cpf = base + d1 + digito(base + d1);
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}
