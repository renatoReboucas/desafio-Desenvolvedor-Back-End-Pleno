import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import z from 'zod'
import bcrypt from 'bcrypt'

export async function LoginRoutes(app: FastifyInstance) {
  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    try {
      const { email, password } = loginSchema.parse(request.body)

      const user = await prisma.users.findUnique({
        where: { email },
      })

      if (!user) {
        return reply.status(401).send({ error: 'Usuário não encontrado' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        return reply.status(401).send({ error: 'Senha incorreta' })
      }

      const token = app.jwt.sign(
        {
          email: user.email,
          nome: user.nome,
        },
        {
          sub: `${user.id}`,
          expiresIn: '30 days',
        }
      )
      return reply.send({ token })
    } catch (err) {
      console.error(err)
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })
}
