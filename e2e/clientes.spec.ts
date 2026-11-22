import { expect, test } from "@playwright/test";
import { gerarCpf, sufixo } from "./util";

test.describe("Clientes", () => {
  test("cria, busca, edita e remove um cliente", async ({ page }) => {
    const nome = `Cliente E2E ${sufixo()}`;
    const modal = page.getByRole("dialog");

    await page.goto("/clientes");
    await expect(page.getByText("Ana Paula Souza")).toBeVisible(); // listagem vinda da API

    // Criar: primeiro sem dados (validação na tela), depois com CPF repetido (erro da API)
    await page.getByRole("button", { name: "Novo cliente" }).click();
    await modal.getByRole("button", { name: "Salvar" }).click();
    await expect(modal.getByText("CPF inválido")).toBeVisible();

    await modal.getByLabel("Nome completo").fill(nome);
    await modal.getByLabel("CPF").fill("529.982.247-25"); // já existe no seed
    await modal.getByLabel("Telefone").fill("(11) 91234-5678");
    await modal.getByLabel("E-mail").fill("e2e@teste.com");
    await modal.getByRole("button", { name: "Salvar" }).click();
    await expect(modal.getByText("CPF já cadastrado")).toBeVisible(); // 409, nunca 500

    await modal.getByLabel("CPF").fill(gerarCpf());
    await modal.getByRole("button", { name: "Salvar" }).click();
    await expect(modal).toBeHidden();

    // Buscar (.filter na lista)
    await page.getByPlaceholder("Buscar por nome, CPF, e-mail ou telefone").fill(nome);
    const linhas = page.locator("tbody tr");
    await expect(linhas).toHaveCount(1);

    // Editar no mesmo modal, já preenchido
    await linhas.first().getByRole("button", { name: "Editar" }).click();
    await expect(modal.getByLabel("Nome completo")).toHaveValue(nome);
    await modal.getByLabel("Nome completo").fill(`${nome} Editado`);
    await modal.getByRole("button", { name: "Salvar" }).click();
    await expect(page.getByText(`${nome} Editado`)).toBeVisible();

    // Remover com confirmação
    await linhas.first().getByRole("button", { name: "Remover" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Remover" }).click();
    await expect(page.getByText("Nenhum resultado")).toBeVisible();
  });

  test("não remove cliente que tem veículos (chave estrangeira)", async ({ page }) => {
    await page.goto("/clientes");
    await page.getByPlaceholder("Buscar por nome, CPF, e-mail ou telefone").fill("Ana Paula");
    await page.locator("tbody tr").first().getByRole("button", { name: "Remover" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Remover" }).click();

    await expect(page.getByText("Não foi possível remover")).toBeVisible();
    await expect(page.getByText("Ana Paula Souza")).toBeVisible();
  });
});
