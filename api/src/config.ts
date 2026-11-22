import "dotenv/config";
import { z } from "zod";

/** Variáveis de ambiente validadas na inicialização: falha cedo e com mensagem clara. */
const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL inválida"),
  PORT: z.coerce.number().int().positive().default(3333),
  JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter pelo menos 16 caracteres"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const resultado = envSchema.safeParse(process.env);
if (!resultado.success) {
  console.error("❌ Variáveis de ambiente inválidas:", resultado.error.flatten().fieldErrors);
  console.error("   Crie o arquivo api/.env a partir de api/.env.example (veja o README).");
  process.exit(1);
}

export const config = resultado.data;
