## O que muda

<!-- Descreva a mudança e o motivo. Relacione a issue, se houver: Closes #123 -->

## Tipo

- [ ] Nova funcionalidade
- [ ] Correção de bug
- [ ] Refatoração / qualidade
- [ ] Documentação
- [ ] Infra / CI

## Como testar

1.
2.

## Checklist

- [ ] `npm run lint` e `npm run format:check` sem erros
- [ ] `npm run build -w api` e `npm run build -w frontend` sem erros
- [ ] Testes passando (`npm test` e `npm run test:e2e`) e novos testes quando aplicável
- [ ] Schemas novos/alterados ficam no `shared` e são usados na API e no frontend
- [ ] Migration criada com `npm run migrate -w api` (se o schema do Prisma mudou)
- [ ] README/Swagger atualizados (se a API mudou)
