import { expect, test } from "@playwright/test";
import { sufixo } from "./util";

// Estes testes começam SEM sessão: testam o próprio login e cadastro
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Cadastro e login", () => {
  test("rota protegida sem login leva para a tela de login", async ({ page }) => {
    await page.goto("/clientes");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  });

  test("cadastro valida no navegador (Zod do shared) antes de chamar a API", async ({ page }) => {
    const chamadas: string[] = [];
    page.on("request", (r) => r.url().includes("/auth/cadastro") && chamadas.push(r.url()));

    await page.goto("/cadastro");
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("Nome deve ter pelo menos 3 caracteres")).toBeVisible();
    await expect(page.getByText("E-mail inválido")).toBeVisible();
    await expect(page.getByText("A senha deve ter pelo menos 8 caracteres")).toBeVisible();
    expect(chamadas, "dado inválido não deve chegar à API").toHaveLength(0);
  });

  test("cria uma conta nova e entra com ela", async ({ page }) => {
    const email = `e2e-${sufixo()}@oficina.com`;

    await page.goto("/cadastro");
    await page.getByLabel("Nome completo").fill("Usuário de Teste");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha").fill("senhaDeTeste123");
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("Conta criada com sucesso")).toBeVisible();
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha").fill("senhaDeTeste123");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Faturamento mensal")).toBeVisible();
  });

  test("e-mail já cadastrado aparece no campo", async ({ page }) => {
    await page.goto("/cadastro");
    await page.getByLabel("Nome completo").fill("Outro Professor");
    await page.getByLabel("E-mail").fill("professor@oficina.com");
    await page.getByLabel("Senha").fill("qualquerSenha123");
    await page.getByRole("button", { name: "Criar conta" }).click();

    await expect(page.getByText("E-mail já cadastrado")).toBeVisible();
  });

  test("senha errada mostra o erro da API", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-mail").fill("professor@oficina.com");
    await page.getByLabel("Senha").fill("senhaErrada");
    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("E-mail ou senha inválidos")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
