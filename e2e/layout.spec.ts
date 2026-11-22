import { expect, test } from "@playwright/test";

test.describe("Layout e navegação", () => {
  test("painel mostra os indicadores calculados com dados da API", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("OS em aberto")).toBeVisible();
    await expect(page.getByText("Faturamento mensal")).toBeVisible();
    await expect(page.getByText("Ordens recentes")).toBeVisible();
  });

  test("menu lateral recolhe e continua recolhido depois de recarregar", async ({ page }) => {
    await page.goto("/");
    const menu = page.locator(".sidebar");
    await expect(menu).toHaveCSS("width", "240px");

    await page.getByRole("button", { name: "Recolher menu lateral" }).click();
    await expect(menu).toHaveCSS("width", "68px");

    await page.reload();
    await expect(menu).toHaveCSS("width", "68px");
    // recolhido, os itens continuam navegáveis (nome acessível pelo aria-label)
    await page.getByRole("link", { name: "Clientes", exact: true }).click();
    await expect(page).toHaveURL(/\/clientes$/);

    await page.getByRole("button", { name: "Expandir menu lateral" }).click();
    await expect(menu).toHaveCSS("width", "240px");
  });

  test("no celular não há rolagem horizontal e o menu abre como gaveta", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.getByText("Faturamento mensal")).toBeVisible();

    const largura = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(largura).toBeLessThanOrEqual(390);

    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.getByRole("link", { name: "Mecânicos", exact: true }).click();
    await expect(page).toHaveURL(/\/mecanicos$/);
  });

  test("tema escuro pode ser ativado", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Alternar tema" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-mantine-color-scheme", "dark");
  });
});
