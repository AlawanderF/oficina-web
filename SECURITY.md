# Segurança

## Medidas adotadas

- **Senhas:** são guardadas só como hash bcrypt (custo 10, com salt aleatório) e nunca aparecem nas respostas da API.
- **Autenticação:** JWT com validade de 8 h. Todas as rotas de CRUD exigem `Authorization: Bearer <token>`.
- **Login:** a mensagem de erro é a mesma para e-mail ou senha incorretos, o que evita enumeração de usuários. Há rate limit de 50 tentativas a cada 15 minutos por IP.
- **Entrada:** todo `POST` e `PUT` é validado com Zod, e o corpo da requisição tem limite de 100 kB.
- **Cabeçalhos HTTP:** Helmet, com CSP desativada só porque a UI do Swagger usa scripts inline. CORS restrito à origem do frontend (`CORS_ORIGIN`).
- **Configuração:** as variáveis de ambiente são validadas na inicialização. Segredos ficam fora do Git (`.env` está no `.gitignore`).
- **Automação:** o CodeQL roda em todo PR e uma vez por semana, e o Dependabot verifica as dependências toda semana.

- **Robustez:** entradas inválidas nunca viram erro 500. Isso vale para ids fora do intervalo do banco, datas impossíveis, caracteres de controle, corpo grande demais e tipos errados. Há testes de regressão para cada caso em `api/tests/api.test.ts`.
- **Tempo constante no login:** o bcrypt roda mesmo quando o e-mail não existe (com um hash falso), então o tempo de resposta não revela quais e-mails estão cadastrados.

## Decisões de projeto (riscos aceitos)

| Decisão                                                  | Motivo                                                          | Em produção, faríamos                                      |
| -------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------- |
| `POST /auth/cadastro` é público                          | O enunciado pede uma tela de cadastro de usuário antes do login | Cadastro só por um administrador, ou convite por e-mail    |
| O token JWT não pode ser revogado antes de expirar (8 h) | Simplicidade: não há tabela de sessões                          | Token curto com _refresh token_, ou uma lista de revogação |
| `JWT_SECRET` de exemplo público no `.env.example`        | Facilita rodar o projeto para a correção                        | Segredo forte e único, guardado num cofre de segredos      |

## Alertas conhecidos do `npm audit` (avaliados)

| Pacote                | Alerta                                                                                                                                              | Por que não afeta este projeto                                                                                            | Ação                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `zod` < 4.6.6         | [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5): consumo de memória ao validar coleções muito grandes                      | Nenhum schema valida arrays ou coleções, e o corpo das requisições é limitado a 100 kB                                    | Migrar para o Zod 4 (major, com mudanças na API de mensagens) |
| `react-router` < 7.18 | [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) e [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg) | Todas as rotas de navegação são fixas no código (sem redirecionamento a partir de entrada do usuário) e o app não usa SSR | Migrar para o React Router 7 (major)                          |

O job de auditoria do CI avisa sobre esses alertas, mas não bloqueia o merge.

## Como reportar uma vulnerabilidade

Abra uma _security advisory_ privada no GitHub, na aba **Security** do repositório. Não use issues públicas para isso.
