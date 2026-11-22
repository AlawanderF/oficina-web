# Guia de contribuição

## Fluxo de trabalho

1. Atualize a `main`: `git checkout main && git pull`.
2. Crie uma branch: `git checkout -b feat/nome-curto` (ou `fix/...`, `docs/...`).
3. Faça commits pequenos, seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/):
   - `feat(frontend): filtro por status nas ordens de serviço`
   - `fix(api): retorna 409 ao remover cliente com veículos`
   - `docs: atualiza passo a passo do README`
4. Antes de enviar, rode localmente:
   ```bash
   npm run lint && npm run format:check
   npm run build -w api && npm run build -w frontend
   npm test
   ```
5. Abra um pull request para a `main` e preencha o template. O merge só é liberado com o **CI verde** e **1 aprovação**.

## Convenções

- **Validação:** todo schema novo vai no `shared` e é usado na API (`validarBody`) e no frontend (`safeParse`).
- **API:** respeite as camadas `routes → controllers → services → repositories`. Só o repository acessa o Prisma.
- **Banco:** depois de alterar o `schema.prisma`, gere a migration com `npm run migrate -w api -- --name descricao` e versione a pasta `migrations/`.
- **Segredos:** nunca versione o `.env`. Se criar uma variável nova, documente-a no `.env.example`.
