# 🔧 AutoGestor: sistema de gestão para oficina mecânica

🎥 **Vídeo de apresentação:** [Assistir no Google Drive](https://drive.google.com/file/d/13IqXF6fxtFW5eEUs3VXyF9Km-CKjOXIm/view?usp=sharing)

[![CI](https://github.com/AlawanderF/oficina-web/actions/workflows/ci.yml/badge.svg)](https://github.com/AlawanderF/oficina-web/actions/workflows/ci.yml)
[![CodeQL](https://github.com/AlawanderF/oficina-web/actions/workflows/codeql.yml/badge.svg)](https://github.com/AlawanderF/oficina-web/actions/workflows/codeql.yml)

Projeto final de **Desenvolvimento Web (A2)**: um sistema web completo, do banco à tela, para gerenciar clientes, veículos, mecânicos e ordens de serviço de uma oficina.

| Camada    | Tecnologias                                                              |
| --------- | ------------------------------------------------------------------------ |
| Banco     | PostgreSQL 16 (Docker) + Prisma ORM                                      |
| API       | Node.js, Express, TypeScript, JWT, bcrypt, Helmet, rate limit            |
| Validação | Zod, com schemas no pacote `shared` usados **pela API e pelo frontend**  |
| Docs      | Swagger (OpenAPI 3) em `/docs`                                           |
| Frontend  | React 18, Vite, TypeScript, Mantine 7, Axios                             |
| Qualidade | ESLint, Prettier, Vitest + Supertest, GitHub Actions, CodeQL, Dependabot |

---

## 👥 Integrantes

| Nome completo                | RGM      | O que fez                                                                                   |
| ---------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| Alawander Fernandes da Silva | 38890232 | Banco de dados (Prisma, migrations, seed, Docker), API (camadas, CRUD, autenticação), CI/CD |
| Dereck Patrick Morais de Sá  | 38283051 | Frontend (telas, modais, selects, busca, painel), schemas Zod no `shared`, Swagger          |

---

## 🗂️ Tema e tabelas

Tema: **Oficina mecânica**.

| Tabela         | Campos principais                                             | Ligações (chave estrangeira)                                        |
| -------------- | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| `Cliente`      | nome, **cpf (@unique)**, telefone, email                      | —                                                                   |
| `Veiculo`      | **placa (@unique)**, marca, modelo, ano                       | `clienteId` → Cliente                                               |
| `Mecanico`     | nome, especialidade, telefone                                 | —                                                                   |
| `OrdemServico` | descrição, status, valor, data de abertura, data de conclusão | `veiculoId` → Veículo **e** `mecanicoId` → Mecânico (ligada a duas) |
| `Usuario`      | nome, **email (@unique)**, senha (hash bcrypt)                | tabela de login (não conta nas 4)                                   |

```
Cliente 1 ──── N Veiculo 1 ──── N OrdemServico N ──── 1 Mecanico
```

Regras de negócio:

- **CPF** é validado pelos dígitos verificadores e a **placa** aceita os padrões antigo (`ABC1234`) e Mercosul (`ABC1D23`).
- Uma OS **concluída** exige data de conclusão, e essa data não pode ser anterior à abertura.
- Não é possível remover um registro que está em uso. Por exemplo, um cliente com veículos recebe 409 com uma mensagem clara.

---

## 🚀 Como rodar (do zero)

**Pré-requisitos:** [Node.js 20+](https://nodejs.org) e [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou um PostgreSQL local).

### 1. Clonar e instalar as dependências

Na raiz do projeto, o comando abaixo instala os três pacotes (`shared`, `api` e `frontend`) e já compila o `shared`:

```bash
git clone https://github.com/AlawanderF/oficina-web.git
cd oficina-web
npm install
```

### 2. Subir o banco de dados

O PostgreSQL roda no Docker, na **porta 5433**, para não conflitar com um Postgres já instalado na máquina. O `--wait` só devolve o terminal quando o banco está pronto:

```bash
docker compose up -d --wait
```

> **Sem Docker?** Crie um banco num PostgreSQL local e ajuste a `DATABASE_URL` no passo 3.

### 3. Criar o `.env` da API

```bash
# Linux / macOS / Git Bash
cp api/.env.example api/.env

# Windows (PowerShell)
Copy-Item api/.env.example api/.env
```

Os valores padrão já funcionam com o `docker-compose.yml`. Todas as variáveis estão documentadas em [`api/.env.example`](api/.env.example).

### 4. Rodar as migrations e o seed

```bash
npm run migrate -w api
npm run seed -w api
```

### 5. Subir a API

```bash
npm run dev -w api
```

- API: <http://localhost:3333>
- Swagger: <http://localhost:3333/docs>

### 6. Subir o frontend (em outro terminal)

```bash
npm run dev -w frontend
```

Acesse <http://localhost:5173>.

### Problemas comuns

| Sintoma                                                             | Causa e solução                                                                                                   |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `Can't reach database server at localhost:5433`                     | O banco não está no ar. Rode `docker compose up -d --wait` e confira com `docker ps`.                             |
| `port is already allocated` ao subir o Docker                       | A porta 5433 está em uso. Troque `"5433:5432"` no `docker-compose.yml` e a porta na `DATABASE_URL` do `api/.env`. |
| `Variáveis de ambiente inválidas` ao subir a API                    | O arquivo `api/.env` não existe. Refaça o passo 3.                                                                |
| `EPERM: operation not permitted, rename ... query_engine` (Windows) | A API está rodando e segura o arquivo do Prisma. Pare a API (Ctrl+C) e repita o comando.                          |
| Docker Desktop: "WSL needs updating"                                | No PowerShell como administrador: `wsl --update`. Depois reinicie o Docker Desktop.                               |

---

## 🔑 Usuário do seed

| E-mail                  | Senha       |
| ----------------------- | ----------- |
| `professor@oficina.com` | `senha1234` |

**No Swagger:** execute `POST /auth/login` com esse usuário, copie o `token` e clique em **Authorize**.

---

## 🧱 Arquitetura

```
.
├── shared/                 # Schemas Zod + tipos: a fonte única da validação
├── api/
│   ├── prisma/             # schema.prisma, migrations/ e seed.ts
│   ├── src/
│   │   ├── routes/         # URLs + middlewares (validarBody, autenticar)
│   │   ├── controllers/    # HTTP: lê a requisição e define o status
│   │   ├── services/       # Regras de negócio (404, bcrypt, JWT)
│   │   ├── repositories/   # Acesso ao banco via Prisma
│   │   ├── middlewares/    # validarSchema.ts, auth.ts, erros.ts
│   │   ├── app.ts          # Montagem do Express (testável)
│   │   └── server.ts       # Inicialização
│   └── tests/              # Testes de integração (Vitest + Supertest)
├── frontend/
│   └── src/
│       ├── services/api.ts # Axios: todas as chamadas à API
│       ├── hooks/useCrud.ts# Listar, criar/editar no modal, remover
│       ├── components/     # Layout, tabelas, modais
│       └── pages/          # Login, Cadastro, Painel e as 4 telas
└── .github/                # CI, CodeQL, Dependabot, templates
```

**Caminho de um "Salvar":**

```
Botão Salvar (página) → useCrud.salvar() → schema.safeParse() [shared]
  → services/api.ts (Axios) → POST /clientes
  → routes → validarBody(schema) [mesmo schema do shared] → controller
  → service → repository → Prisma → PostgreSQL
  ← 201 + JSON ← (ou 400/409 com mensagem por campo, exibida no formulário)
```

### Rotas da API

| Recurso                   | Rotas                                                     |
| ------------------------- | --------------------------------------------------------- |
| Autenticação (pública)    | `POST /auth/cadastro`, `POST /auth/login`                 |
| CRUD (exige token JWT)    | `/clientes`, `/veiculos`, `/mecanicos`, `/ordens-servico` |
| Operações de cada recurso | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`  |
| Saúde                     | `GET /health`                                             |

**Status HTTP:** `201` ao criar, `204` ao remover, `400` para dado inválido (com mensagem por campo), `401` sem token, `404` para id inexistente e `409` para valor repetido em campo único ou registro em uso.

---

## ✅ Qualidade

```bash
npm run build -w api        # build da API
npm run build -w frontend   # build do frontend
npm run lint                # ESLint
npm run format:check        # Prettier
npm test                    # testes do shared + integração da API (requer o banco)
npm run test:e2e            # testes de ponta a ponta no navegador (requer o banco + seed)
```

Os **testes de ponta a ponta** (pasta `e2e/`, com Playwright) abrem o sistema num navegador e usam as telas como um usuário: cadastro, login, CRUD de clientes, validações, CPF repetido, selects, filtro, menu recolhível e layout no celular. Eles sobem a API e o frontend sozinhos (ou reaproveitam os que já estiverem rodando). Localmente usam o Google Chrome instalado. Sem o Chrome, rode antes `npx playwright install chromium`.

> O seed recria os dados de exemplo, mas **não apaga as contas de usuário**: rodar o seed de novo preserva quem se cadastrou (e restaura a senha do usuário do professor).

Cada push e cada pull request rodam no **GitHub Actions**:

- **CI:** lint, formatação, checagem de tipos, os dois builds e os testes de integração contra um PostgreSQL real. O mesmo job executa o passo a passo deste README (`.env`, migrations e seed) e um smoke test com a API no ar, o Swagger e o login do seed.
- **Testes de ponta a ponta:** num job próprio, o Playwright testa as telas no Chromium com a API e o banco de verdade.
- **CodeQL:** análise estática de segurança.
- **Dependabot:** atualização semanal de dependências. Um bot aprova e faz o merge automático só das atualizações _patch/minor_, e só depois que o CI passa. Atualizações _major_ pedem revisão humana.

Veja também o [guia de contribuição](CONTRIBUTING.md).
