import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'


export async function UserRoutes(app: FastifyInstance) {
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify()
    try {
      const users = await prisma.users.findMany()

      const maskedUsers = users.map(user => ({
        ...user,
        cpf: user.cpf.replace(/^\d{3}|\d{3}$/g, '***')
      }))

      return reply.send(maskedUsers)
    } catch (err) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const createUserSchema = z.object({
      nome: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
      cpf: z.string().length(11)
    })

    try {
      const { nome, email, password, cpf } = createUserSchema.parse(request.body)

      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [{ email }, { cpf }]
        }
      })

      if (existingUser) {
        return reply.status(400).send({
          error: 'Email ou CPF já cadastrado'
        })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.users.create({
        data: {
          nome,
          email,
          password: hashedPassword,
          cpf
        }
      })

      const { password: _, ...userWithoutPassword } = user
      return reply.status(201).send(userWithoutPassword)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return reply
          .status(400)
          .send({ error: 'Erro de validação', details: err.errors })
      }
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })


}