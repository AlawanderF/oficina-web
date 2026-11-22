import rateLimit from "express-rate-limit";

const mensagem = { message: "Muitas requisições. Tente novamente em alguns minutos." };

/** Login e cadastro: poucas tentativas por IP (proteção contra força bruta de senha). */
export const limiteAutenticacao = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: mensagem,
});

/** Rotas autenticadas: teto generoso por IP, contra abuso e varredura em massa dos dados. */
export const limiteApi = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: mensagem,
});
