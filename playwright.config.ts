import { defineConfig, devices } from "@playwright/test";

/**
 * Testes de ponta a ponta: abrem o sistema num navegador de verdade e usam as telas
 * como um usuário (login, cadastros, validações, menu). Requer o banco no ar, com
 * migrations e seed aplicados (veja o README).
 *
 * Localmente usa o Google Chrome já instalado; no CI usa o Chromium do Playwright.
 */
const CI = Boolean(process.env.CI);
const ESTADO_LOGADO = "e2e/.auth/estado.json";

export default defineConfig({
  testDir: "e2e",
  // Os testes alteram o mesmo banco: rodar um de cada vez evita interferência
  fullyParallel: false,
  workers: 1,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:5173",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // 1) Faz login uma vez pela API e guarda a sessão para os demais testes
    { name: "login", testMatch: /.*\.setup\.ts/ },
    // 2) Testes do sistema, já autenticados
    {
      name: "sistema",
      dependencies: ["login"],
      use: { ...devices["Desktop Chrome"], channel: CI ? undefined : "chrome", storageState: ESTADO_LOGADO },
    },
  ],
  // Sobe a API e o frontend (ou reaproveita os que já estiverem rodando, fora do CI)
  webServer: [
    {
      command: "npm run dev -w api",
      url: "http://localhost:3333/health",
      reuseExistingServer: !CI,
      timeout: 90_000,
    },
    {
      command: "npm run dev -w frontend",
      url: "http://localhost:5173",
      reuseExistingServer: !CI,
      timeout: 90_000,
    },
  ],
});
