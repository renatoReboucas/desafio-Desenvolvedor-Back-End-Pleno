import { FastifyInstance } from 'fastify'
import Fastify from 'fastify'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'
import { UserRoutes } from '../Routes/Users'
import { LoginRoutes } from '../Routes/Login'
import fastifyJwt from '@fastify/jwt'

const build = async (): Promise<FastifyInstance> => {
  const app = Fastify()
  app.register(fastifyJwt, {
    secret: "teste",
  });
  app.register(UserRoutes)
  app.register(LoginRoutes)
  return app
}

describe('User Routes', () => {
  let app: any // Definindo o tipo da variável app como 'any'

  beforeAll(async () => {
    app = await build() // Inicializa a aplicação
  })

  afterAll(async () => {
    await prisma.$disconnect() // Desconecta do banco de dados
  })

  beforeEach(async () => {
    await prisma.users.deleteMany() // Limpa a tabela de usuários antes de cada teste
  })

  it('deve retornar todos os usuários com CPF mascarado', async () => {

    // Cria um novo usuário
    await prisma.users.create({
      data: {
        nome: 'Teste',
        email: 'teste@example.com',
        password: await bcrypt.hash('senha123', 10),
        cpf: '12345678901',
      },
    })

    // Faz login para obter o token JWT
    const loginResponse = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        email: 'teste@example.com',
        password: 'senha123',
      },
    })

    const { token } = JSON.parse(loginResponse.payload)

    // Faz a requisição para obter os usuários
    const response = await app.inject({
      method: 'GET',
      url: '/',
      headers: {
        Authorization: `Bearer ${token}`, // Usa o token obtido
      },
    })

    expect(response.statusCode).toBe(200)
    const users = JSON.parse(response.payload)
    expect(users[0].cpf).toBe('***45678***') // Verifica se o CPF está mascarado
  })

    it('deve registrar um novo usuário', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/register',
        payload: {
          nome: 'Novo Usuário',
          email: 'novo@usuario.com',
          password: 'senha123',
          cpf: '12345678901',
        },
      })

      expect(response.statusCode).toBe(201)
      const user = JSON.parse(response.payload)
      expect(user.email).toBe('novo@usuario.com')
      expect(user.cpf).toBe('12345678901')
    })

    it('não deve permitir registro com email ou CPF já existente', async () => {
      await prisma.users.create({
        data: {
          nome: 'Usuário Existente',
          email: 'existente@usuario.com',
          password: await bcrypt.hash('senha123', 10),
          cpf: '12345678901',
        },
      })

      const response = await app.inject({
        method: 'POST',
        url: '/register',
        payload: {
          nome: 'Outro Usuário',
          email: 'existente@usuario.com',
          password: 'senha123',
          cpf: '09876543210',
        },
      })

      expect(response.statusCode).toBe(400)
      expect(JSON.parse(response.payload).error).toBe(
        'Email ou CPF já cadastrado'
      )
    })
})
