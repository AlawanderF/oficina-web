/* Documentação OpenAPI 3 exibida em /docs */
export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "API Oficina Mecânica",
    version: "1.0.0",
    description:
      "Como usar: execute **POST /auth/login** com o usuário do seed, copie o `token` e clique em **Authorize**.",
  },
  tags: [
    {
      name: "Autenticação",
    },
    {
      name: "Clientes",
    },
    {
      name: "Veículos",
    },
    {
      name: "Mecânicos",
    },
    {
      name: "Ordens de serviço",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Erro: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Registro não encontrado",
          },
        },
      },
      ErroValidacao: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Dados inválidos",
          },
          erros: {
            type: "object",
            additionalProperties: {
              type: "string",
            },
            example: {
              cpf: "CPF inválido",
              email: "E-mail inválido",
            },
          },
        },
      },
      CadastroUsuario: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
          nome: {
            type: "string",
            example: "Maria Silva",
          },
          email: {
            type: "string",
            format: "email",
            example: "maria@oficina.com",
          },
          senha: {
            type: "string",
            minLength: 8,
            example: "minhaSenha123",
          },
        },
      },
      Login: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: {
            type: "string",
            example: "professor@oficina.com",
          },
          senha: {
            type: "string",
            example: "senha1234",
          },
        },
      },
      Usuario: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          nome: {
            type: "string",
          },
          email: {
            type: "string",
          },
          criadoEm: {
            type: "string",
            format: "date-time",
          },
        },
      },
      ClienteEntrada: {
        type: "object",
        required: ["nome", "cpf", "telefone", "email"],
        properties: {
          nome: {
            type: "string",
            example: "João da Silva",
          },
          cpf: {
            type: "string",
            description: "11 dígitos, com ou sem máscara. Precisa ser um CPF válido.",
            example: "246.813.579-28",
          },
          telefone: {
            type: "string",
            description: "DDD + número",
            example: "(11) 91234-5678",
          },
          email: {
            type: "string",
            format: "email",
            example: "joao@email.com",
          },
        },
      },
      Cliente: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          nome: {
            type: "string",
          },
          cpf: {
            type: "string",
          },
          telefone: {
            type: "string",
          },
          email: {
            type: "string",
          },
          criadoEm: {
            type: "string",
            format: "date-time",
          },
        },
      },
      VeiculoEntrada: {
        type: "object",
        required: ["placa", "marca", "modelo", "ano", "clienteId"],
        properties: {
          placa: {
            type: "string",
            description: "Antiga (ABC1234) ou Mercosul (ABC1D23)",
            example: "RIO2A18",
          },
          marca: {
            type: "string",
            example: "Renault",
          },
          modelo: {
            type: "string",
            example: "Sandero",
          },
          ano: {
            type: "integer",
            example: 2020,
          },
          clienteId: {
            type: "integer",
            example: 1,
          },
        },
      },
      Veiculo: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          placa: {
            type: "string",
          },
          marca: {
            type: "string",
          },
          modelo: {
            type: "string",
          },
          ano: {
            type: "integer",
          },
          clienteId: {
            type: "integer",
          },
          cliente: {
            $ref: "#/components/schemas/Cliente",
          },
          criadoEm: {
            type: "string",
            format: "date-time",
          },
        },
      },
      MecanicoEntrada: {
        type: "object",
        required: ["nome", "especialidade", "telefone"],
        properties: {
          nome: {
            type: "string",
            example: "Paulo Ribeiro",
          },
          especialidade: {
            type: "string",
            example: "Câmbio automático",
          },
          telefone: {
            type: "string",
            example: "11988887777",
          },
        },
      },
      Mecanico: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          nome: {
            type: "string",
          },
          especialidade: {
            type: "string",
          },
          telefone: {
            type: "string",
          },
          criadoEm: {
            type: "string",
            format: "date-time",
          },
        },
      },
      OrdemServicoEntrada: {
        type: "object",
        required: ["veiculoId", "mecanicoId", "descricao", "status", "valor", "dataAbertura"],
        description: "Se status = CONCLUIDA, dataConclusao é obrigatória e não pode ser anterior à abertura.",
        properties: {
          veiculoId: {
            type: "integer",
            example: 1,
          },
          mecanicoId: {
            type: "integer",
            example: 1,
          },
          descricao: {
            type: "string",
            example: "Troca de embreagem",
          },
          status: {
            type: "string",
            enum: ["ABERTA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"],
            example: "ABERTA",
          },
          valor: {
            type: "number",
            example: 1450,
          },
          dataAbertura: {
            type: "string",
            format: "date",
            example: "2026-11-22",
          },
          dataConclusao: {
            type: "string",
            format: "date",
            nullable: true,
            example: null,
          },
        },
      },
      OrdemServico: {
        type: "object",
        properties: {
          id: {
            type: "integer",
          },
          descricao: {
            type: "string",
          },
          status: {
            type: "string",
            enum: ["ABERTA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"],
          },
          valor: {
            type: "string",
            description: "Decimal serializado como texto",
            example: "1450.00",
          },
          dataAbertura: {
            type: "string",
            format: "date-time",
          },
          dataConclusao: {
            type: "string",
            format: "date-time",
            nullable: true,
          },
          veiculoId: {
            type: "integer",
          },
          mecanicoId: {
            type: "integer",
          },
          veiculo: {
            $ref: "#/components/schemas/Veiculo",
          },
          mecanico: {
            $ref: "#/components/schemas/Mecanico",
          },
          criadoEm: {
            type: "string",
            format: "date-time",
          },
        },
      },
    },
  },
  paths: {
    "/auth/cadastro": {
      post: {
        tags: ["Autenticação"],
        summary: "Cadastra um usuário",
        description: "A senha é armazenada como hash bcrypt e nunca é devolvida.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CadastroUsuario",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Usuário criado (sem a senha)",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Usuario",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Autentica e devolve o token JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Login",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Token JWT (8h) e usuário sem senha",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                    },
                    usuario: {
                      $ref: "#/components/schemas/Usuario",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "E-mail ou senha inválidos",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
    "/clientes": {
      get: {
        tags: ["Clientes"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Lista clientes",
        responses: {
          "200": {
            description: "Lista",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Cliente",
                  },
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Clientes"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Cria cliente",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ClienteEntrada",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Criado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Cliente",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
    },
    "/clientes/{id}": {
      get: {
        tags: ["Clientes"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Busca cliente por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Cliente",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Clientes"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Edita cliente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ClienteEntrada",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Atualizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Cliente",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Clientes"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Remove cliente",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        responses: {
          "204": {
            description: "Removido",
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Registro em uso por outro",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
    "/veiculos": {
      get: {
        tags: ["Veículos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Lista veículos",
        responses: {
          "200": {
            description: "Lista",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Veiculo",
                  },
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Veículos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Cria veículo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VeiculoEntrada",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Criado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Veiculo",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
    },
    "/veiculos/{id}": {
      get: {
        tags: ["Veículos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Busca veículo por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Veiculo",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Veículos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Edita veículo",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/VeiculoEntrada",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Atualizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Veiculo",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Veículos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Remove veículo",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        responses: {
          "204": {
            description: "Removido",
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Registro em uso por outro",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
    "/mecanicos": {
      get: {
        tags: ["Mecânicos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Lista mecânicos",
        responses: {
          "200": {
            description: "Lista",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Mecanico",
                  },
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Mecânicos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Cria mecânico",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MecanicoEntrada",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Criado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Mecanico",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
    },
    "/mecanicos/{id}": {
      get: {
        tags: ["Mecânicos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Busca mecânico por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Mecanico",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Mecânicos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Edita mecânico",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/MecanicoEntrada",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Atualizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Mecanico",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Mecânicos"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Remove mecânico",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        responses: {
          "204": {
            description: "Removido",
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Registro em uso por outro",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
    "/ordens-servico": {
      get: {
        tags: ["Ordens de serviço"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Lista ordens de serviço",
        responses: {
          "200": {
            description: "Lista",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/OrdemServico",
                  },
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Ordens de serviço"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Cria ordem de serviço",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/OrdemServicoEntrada",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Criado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OrdemServico",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
    },
    "/ordens-servico/{id}": {
      get: {
        tags: ["Ordens de serviço"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Busca ordem de serviço por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        responses: {
          "200": {
            description: "Encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OrdemServico",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
      put: {
        tags: ["Ordens de serviço"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Edita ordem de serviço",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/OrdemServicoEntrada",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Atualizado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/OrdemServico",
                },
              },
            },
          },
          "400": {
            description: "Dados inválidos — mensagem por campo",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Valor repetido em campo único ou registro em uso",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ErroValidacao",
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Ordens de serviço"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        summary: "Remove ordem de serviço",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "integer",
              minimum: 1,
            },
            example: 1,
          },
        ],
        responses: {
          "204": {
            description: "Removido",
          },
          "401": {
            description: "Token ausente, inválido ou expirado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "404": {
            description: "Registro não encontrado",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
          "409": {
            description: "Registro em uso por outro",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Erro",
                },
              },
            },
          },
        },
      },
    },
  },
};
