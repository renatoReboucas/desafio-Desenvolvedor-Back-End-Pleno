# Desafio Técnico - Desenvolvedor Back-End Pleno

## 🎯 Objetivo

API RESTful para gerenciamento de usuários, desenvolvida com Node.js e boas práticas de código.

## 🛠️ Tecnologias Utilizadas

- Node.js com Fastify
- TypeScript
- PostgreSQL com Prisma
- Vitest para testes unitários
- JWT para autenticação
- Docker para containerização

## 📋 Requisitos do Sistema

- Node.js (versão LTS recomendada)
- PostgreSQL
- Docker Compose

## 🚀 Como Executar

### Configuração Inicial

1. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis necessárias no arquivo `.env`

### Executando com Docker

```bash
docker-compose up -d
```

### Executando Localmente

1. Execute as migrações do banco de dados:

```bash
npx prisma migrate dev
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## 📌 Endpoints da API

### Autenticação

- **POST /register**

  - Cadastro de usuário
  - Corpo da requisição:
    ```json
    {
      "nome": "string",
      "email": "string",
      "senha": "string"
    }
    ```

- **POST /login**
  - Login do usuário
  - Retorna JWT válido
  - Corpo da requisição:
    ```json
    {
      "email": "string",
      "senha": "string"
    }
    ```

### Gestão de Usuários

- **GET /users**
  - Lista usuários (requer autenticação)
  - CPF retornado de forma anonimizada (ex: \*\*\*.456.789-00)

## 🧪 Testes

Execute os testes unitários:

```bash
npm test
```

## 🏗️ Critérios de Avaliação

- ✅ Código limpo e organizado
- ✅ Uso correto de TypeScript
- ✅ Implementação segura da autenticação com JWT
- ✅ Testes básicos com Vitest
- ✅ Uso adequado do Git

## 🔥 Entrega

1. O código deve ser submetido em um repositório público no GitHub ou GitLab
2. Enviar o link do repositório para a equipe de recrutamento

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).
