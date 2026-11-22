# 📚 Sistema de Biblioteca

🎥 **Vídeo de apresentação:** _COLE_O_LINK_DO_VIDEO_AQUI_

Projeto final de Desenvolvimento Web (A2): sistema web completo com PostgreSQL + Prisma, API Node/Express/TypeScript, validação com Zod (pacote `shared`), Swagger e frontend React + Vite + TypeScript.

## Integrantes

| Nome completo | RGM | O que fez |
| --- | --- | --- |
| Alawander Fernandes da Silva | 38890232 | Banco de dados (Prisma, migrations, seed, Docker), API (camadas, CRUD, bcrypt/login) |
| Dereck Patrick Morais de Sá | 38283051 | Frontend (telas, modais, selects, busca), schemas Zod no `shared`, Swagger |

## Tema e tabelas

Tema: **Biblioteca**.

| Tabela | Campos principais | Ligações |
| --- | --- | --- |
| `Autor` | nome, nacionalidade | — |
| `Livro` | titulo, **isbn (@unique)**, anoPublicacao | `autorId` → Autor |
| `Leitor` | nome, **email (@unique)**, **cpf (@unique)** | — |
| `Emprestimo` | dataEmprestimo, dataDevolucao | `livroId` → Livro e `leitorId` → Leitor (**ligada a duas**) |
| `Usuario` | nome, **email (@unique)**, senha (hash bcrypt) | tabela de login (não conta nas 4) |

```
Autor 1───N Livro 1───N Emprestimo N───1 Leitor
```

## Como rodar (do zero)

Pré-requisitos: **Node 20+**, **npm** e **Docker** (ou um PostgreSQL local).

1. **Instalar as dependências** (na raiz; instala `shared`, `api` e `frontend` e já compila o `shared`):
   ```bash
   npm install
   ```
2. **Subir o banco** (PostgreSQL em Docker, porta 5433):
   ```bash
   docker compose up -d
   ```
   > Sem Docker? Use um PostgreSQL local e ajuste a `DATABASE_URL` no passo 3.
3. **Criar o `.env` da API** a partir do exemplo:
   ```bash
   # Linux/Mac/Git Bash
   cp api/.env.example api/.env
   # Windows PowerShell
   Copy-Item api/.env.example api/.env
   ```
4. **Rodar as migrations e o seed:**
   ```bash
   npm run migrate -w api
   npm run seed -w api
   ```
5. **Subir a API** (http://localhost:3333 — Swagger em http://localhost:3333/docs):
   ```bash
   npm run dev -w api
   ```
6. **Subir o frontend** (em outro terminal — http://localhost:5173):
   ```bash
   npm run dev -w frontend
   ```

### Builds

```bash
npm run build -w api
npm run build -w frontend
```

## Usuário do seed (para entrar no sistema)

| E-mail | Senha |
| --- | --- |
| `professor@biblioteca.com` | `senha123` |

No Swagger: faça `POST /auth/login`, copie o `token` e clique em **Authorize**.

## Estrutura

```
shared/      schemas Zod (usados pela API e pelo frontend) + tipos
api/         Express: routes → controllers → services → repositories → Prisma
frontend/    React + Vite + Mantine + Axios (services/api.ts)
```

## Principais rotas

| Recurso | Rotas |
| --- | --- |
| Auth (público) | `POST /auth/cadastro`, `POST /auth/login` |
| CRUD (exige token) | `/autores`, `/livros`, `/leitores`, `/emprestimos` — `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` |

Status: `201` ao criar, `204` ao remover, `404` id inexistente, `400` dado inválido (mensagem por campo), `409` valor repetido em campo único.
