import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'

export async function StudentRoutes(app: FastifyInstance) {
  app.get('/students', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const students = await prisma.student.findMany()
      return students
    } catch (err) {
      return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
  })

  app.post(
    '/students',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const createStudentSchema = z.object({
        ra: z.number(),
        cpf: z.string(),
        nome: z.string(),
        email: z.string().email(),
      })

      try {
        const { ra, cpf, nome, email } = createStudentSchema.parse(request.body)

        const existingStudent = await prisma.student.findFirst({
          where: {
            OR: [{ email }, { cpf }, { ra }],
          },
        })

        if (existingStudent) {
          return reply.status(400).send({
            error: 'Email, CPF ou RA já cadastrado',
          })
        }

        const student = await prisma.student.create({
          data: {
            ra,
            cpf,
            nome,
            email,
          },
        })

        return reply.status(201).send(student)
      } catch (err) {
        if (err instanceof z.ZodError) {
          return reply
            .status(400)
            .send({ error: 'Erro de validação', details: err.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
      }
    }
  )

  app.put(
    '/students/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const updateStudentSchema = z.object({
        nome: z.string().optional(),
        email: z.string().email().optional(),
      })

      try {
        const { id } = request.params as { id: string }
        const updates = updateStudentSchema.parse(request.body)

        const existingStudent = await prisma.student.findUnique({
          where: { id },
        })

        if (!existingStudent) {
          return reply.status(404).send({ error: 'Aluno não encontrado' })
        }

        const student = await prisma.student.update({
          where: { id },
          data: updates,
        })

        return reply.status(200).send(student)
      } catch (err) {
        if (err instanceof z.ZodError) {
          return reply
            .status(400)
            .send({ error: 'Erro de validação', details: err.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
      }
    }
  )

  app.delete(
    '/students/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string }

        const existingStudent = await prisma.student.findUnique({
          where: { id },
        })

        if (!existingStudent) {
          return reply.status(404).send({ error: 'Aluno não encontrado' })
        }
        await prisma.student.delete({
          where: { id },
        })

        return reply.status(204).send()
      } catch (err) {
        return reply.status(500).send({ error: 'Erro interno do servidor' })
      }
    }
  )
}
