import { expect, test, type Page } from "@playwright/test";
import { sufixo } from "./util";

/** Escolhe a primeira opção de um select do Mantine carregado pela API. */
async function escolherPrimeira(page: Page, rotulo: string) {
  await page.getByRole("dialog").getByLabel(rotulo).click();
  await page.getByRole("option").first().click();
}

test.describe("Ordens de serviço", () => {
  test("selects de veículo e mecânico vêm da API (não se digita o id)", async ({ page }) => {
    await page.goto("/ordens-servico");
    await page.getByRole("button", { name: "Nova OS" }).click();

    await page.getByRole("dialog").getByLabel("Veículo").click();
    await expect(page.getByRole("option")).not.toHaveCount(0);
    await expect(page.getByRole("option", { name: /ABC1D23/ })).toBeVisible();
  });

  test("OS concluída exige data de conclusão (regra de negócio do shared)", async ({ page }) => {
    await page.goto("/ordens-servico");
    await page.getByRole("button", { name: "Nova OS" }).click();
    const modal = page.getByRole("dialog");

    await escolherPrimeira(page, "Veículo");
    await escolherPrimeira(page, "Mecânico responsável");
    await modal.getByLabel("Descrição do serviço").fill("Revisão completa de teste");
    await modal.getByLabel("Valor").fill("350");
    await modal.getByLabel("Status").click();
    await page.getByRole("option", { name: "Concluída" }).click();
    await modal.getByRole("button", { name: "Salvar" }).click();

    await expect(modal.getByText("Informe a data de conclusão para OS concluída")).toBeVisible();
  });

  test("cria uma OS, a lista mostra veículo e mecânico pelo nome, e remove", async ({ page }) => {
    const descricao = `Serviço E2E ${sufixo()}`;
    await page.goto("/ordens-servico");
    await page.getByRole("button", { name: "Nova OS" }).click();
    const modal = page.getByRole("dialog");

    await escolherPrimeira(page, "Veículo");
    await escolherPrimeira(page, "Mecânico responsável");
    await modal.getByLabel("Descrição do serviço").fill(descricao);
    await modal.getByLabel("Valor").fill("199,90");
    await modal.getByRole("button", { name: "Salvar" }).click();
    await expect(modal).toBeHidden();

    await page.getByPlaceholder(/Buscar por nº/).fill(descricao);
    const linha = page.locator("tbody tr").first();
    await expect(linha).toContainText(descricao);
    await expect(linha).toContainText("R$ 199,90");
    await expect(linha.locator(".placa")).toBeVisible(); // veículo vindo do include

    await linha.getByRole("button", { name: "Remover" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Remover" }).click();
    await expect(page.getByText("Nenhum resultado")).toBeVisible();
  });

  test("filtro por status mostra só as OS daquele status", async ({ page }) => {
    await page.goto("/ordens-servico");
    await page.getByRole("textbox", { name: "Filtrar por status" }).click();
    await page.getByRole("option", { name: "Cancelada" }).click();

    const linhas = page.locator("tbody tr");
    await expect(linhas.first()).toBeVisible();
    for (const linha of await linhas.all()) await expect(linha).toContainText("Cancelada");
  });
});
