// Documentação OpenAPI exibida em /docs
export const swaggerSpec = {
  "openapi": "3.0.3",
  "info": {
    "title": "API Biblioteca",
    "version": "1.0.0",
    "description": "Faça login em POST /auth/login, copie o token e clique em Authorize."
  },
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    },
    "schemas": {
      "Erro": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string"
          },
          "erros": {
            "type": "object",
            "additionalProperties": {
              "type": "string"
            }
          }
        }
      },
      "CadastroUsuario": {
        "type": "object",
        "required": [
          "nome",
          "email",
          "senha"
        ],
        "properties": {
          "nome": {
            "type": "string",
            "example": "Maria Silva"
          },
          "email": {
            "type": "string",
            "example": "maria@email.com"
          },
          "senha": {
            "type": "string",
            "minLength": 6,
            "example": "123456"
          }
        }
      },
      "Login": {
        "type": "object",
        "required": [
          "email",
          "senha"
        ],
        "properties": {
          "email": {
            "type": "string",
            "example": "professor@biblioteca.com"
          },
          "senha": {
            "type": "string",
            "example": "senha123"
          }
        }
      },
      "Usuario": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "nome": {
            "type": "string"
          },
          "email": {
            "type": "string"
          }
        }
      },
      "AutorEntrada": {
        "type": "object",
        "required": [
          "nome",
          "nacionalidade"
        ],
        "properties": {
          "nome": {
            "type": "string",
            "example": "Jorge Amado"
          },
          "nacionalidade": {
            "type": "string",
            "example": "Brasileira"
          }
        }
      },
      "Autor": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "nome": {
            "type": "string"
          },
          "nacionalidade": {
            "type": "string"
          }
        }
      },
      "LivroEntrada": {
        "type": "object",
        "required": [
          "titulo",
          "isbn",
          "anoPublicacao",
          "autorId"
        ],
        "properties": {
          "titulo": {
            "type": "string",
            "example": "Capitães da Areia"
          },
          "isbn": {
            "type": "string",
            "description": "13 dígitos",
            "example": "9788535914000"
          },
          "anoPublicacao": {
            "type": "integer",
            "example": 1937
          },
          "autorId": {
            "type": "integer",
            "example": 1
          }
        }
      },
      "Livro": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "titulo": {
            "type": "string"
          },
          "isbn": {
            "type": "string"
          },
          "anoPublicacao": {
            "type": "integer"
          },
          "autorId": {
            "type": "integer"
          },
          "autor": {
            "$ref": "#/components/schemas/Autor"
          }
        }
      },
      "LeitorEntrada": {
        "type": "object",
        "required": [
          "nome",
          "email",
          "cpf"
        ],
        "properties": {
          "nome": {
            "type": "string",
            "example": "Diego Rocha"
          },
          "email": {
            "type": "string",
            "example": "diego@email.com"
          },
          "cpf": {
            "type": "string",
            "description": "11 dígitos",
            "example": "44444444444"
          }
        }
      },
      "Leitor": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "nome": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "cpf": {
            "type": "string"
          }
        }
      },
      "EmprestimoEntrada": {
        "type": "object",
        "required": [
          "livroId",
          "leitorId",
          "dataEmprestimo"
        ],
        "properties": {
          "livroId": {
            "type": "integer",
            "example": 1
          },
          "leitorId": {
            "type": "integer",
            "example": 1
          },
          "dataEmprestimo": {
            "type": "string",
            "example": "2026-11-20"
          },
          "dataDevolucao": {
            "type": "string",
            "nullable": true,
            "example": null
          }
        }
      },
      "Emprestimo": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "livroId": {
            "type": "integer"
          },
          "leitorId": {
            "type": "integer"
          },
          "dataEmprestimo": {
            "type": "string"
          },
          "dataDevolucao": {
            "type": "string",
            "nullable": true
          },
          "livro": {
            "$ref": "#/components/schemas/Livro"
          },
          "leitor": {
            "$ref": "#/components/schemas/Leitor"
          }
        }
      }
    }
  },
  "paths": {
    "/auth/cadastro": {
      "post": {
        "tags": [
          "Auth"
        ],
        "summary": "Cadastra usuário (senha vira hash bcrypt)",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CadastroUsuario"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Criado (sem senha)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Usuario"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      "post": {
        "tags": [
          "Auth"
        ],
        "summary": "Login: devolve o token JWT",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/Login"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Token e usuário (sem senha)",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string"
                    },
                    "usuario": {
                      "$ref": "#/components/schemas/Usuario"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "E-mail ou senha inválidos",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/autores": {
      "get": {
        "tags": [
          "Autor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Lista autores",
        "responses": {
          "200": {
            "description": "Lista",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Autor"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Autor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Cria (Autor)",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AutorEntrada"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Criado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Autor"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/autores/{id}": {
      "get": {
        "tags": [
          "Autor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Busca por id (Autor)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Autor"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Autor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Edita (Autor)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AutorEntrada"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Atualizado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Autor"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Autor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Remove (Autor)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Removido"
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Registro em uso por outro",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/livros": {
      "get": {
        "tags": [
          "Livro"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Lista livros",
        "responses": {
          "200": {
            "description": "Lista",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Livro"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Livro"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Cria (Livro)",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LivroEntrada"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Criado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Livro"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/livros/{id}": {
      "get": {
        "tags": [
          "Livro"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Busca por id (Livro)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Livro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Livro"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Edita (Livro)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LivroEntrada"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Atualizado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Livro"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Livro"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Remove (Livro)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Removido"
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Registro em uso por outro",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/leitores": {
      "get": {
        "tags": [
          "Leitor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Lista leitores",
        "responses": {
          "200": {
            "description": "Lista",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Leitor"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Leitor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Cria (Leitor)",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LeitorEntrada"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Criado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Leitor"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/leitores/{id}": {
      "get": {
        "tags": [
          "Leitor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Busca por id (Leitor)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Leitor"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Leitor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Edita (Leitor)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LeitorEntrada"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Atualizado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Leitor"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Leitor"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Remove (Leitor)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Removido"
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Registro em uso por outro",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/emprestimos": {
      "get": {
        "tags": [
          "Emprestimo"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Lista emprestimos",
        "responses": {
          "200": {
            "description": "Lista",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Emprestimo"
                  }
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Emprestimo"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Cria (Emprestimo)",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EmprestimoEntrada"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Criado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Emprestimo"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    },
    "/emprestimos/{id}": {
      "get": {
        "tags": [
          "Emprestimo"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Busca por id (Emprestimo)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Emprestimo"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Emprestimo"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Edita (Emprestimo)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EmprestimoEntrada"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Atualizado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Emprestimo"
                }
              }
            }
          },
          "400": {
            "description": "Dados inválidos (mensagem por campo)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Valor repetido em campo único",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Emprestimo"
        ],
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "summary": "Remove (Emprestimo)",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "Removido"
          },
          "401": {
            "description": "Token ausente ou inválido",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "404": {
            "description": "Id não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          },
          "409": {
            "description": "Registro em uso por outro",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Erro"
                }
              }
            }
          }
        }
      }
    }
  }
} as any;
