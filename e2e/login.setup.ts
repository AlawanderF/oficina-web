import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { expect, test as setup } from "@playwright/test";

const ARQUIVO = "e2e/.auth/estado.json";

/**
 * Entra uma única vez com o usuário do seed, pela API, e grava o token no
 * localStorage do navegador (onde o frontend o procura). Assim os demais testes
 * já começam logados e não esbarram no limite de tentativas de login.
 */
setup("login com o usuário do seed", async ({ request, baseURL }) => {
  const resposta = await request.post("http://localhost:3333/auth/login", {
    data: { email: "professor@oficina.com", senha: "senha1234" },
  });
  expect(resposta.ok(), "o seed precisa ter sido rodado (npm run seed -w api)").toBeTruthy();
  const { token, usuario } = await resposta.json();

  mkdirSync(dirname(ARQUIVO), { recursive: true });
  writeFileSync(
    ARQUIVO,
    JSON.stringify({
      cookies: [],
      origins: [
        {
          origin: new URL(baseURL!).origin,
          localStorage: [
            { name: "oficina.token", value: token },
            { name: "oficina.usuario", value: JSON.stringify(usuario) },
          ],
        },
      ],
    }),
  );
});
