// src/__tests__/student.test.ts
import { FastifyInstance } from 'fastify'
import Fastify from 'fastify'
import { StudentRoutes } from '../Routes/Student'
import { prisma } from '../lib/prisma'
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest'

interface Student {
  id: string
  ra: number
  cpf: string
  nome: string
  email: string
}

const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify()
  app.register(StudentRoutes)
  return app
}

describe('Student API', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildApp()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  beforeEach(async () => {
    await prisma.student.deleteMany()
  })

  it('deve cadastrar um novo aluno', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/students',
      payload: {
        ra: 123456,
        cpf: '12345678901',
        nome: 'Aluno Teste',
        email: 'aluno@teste.com',
      },
    })

    console.log('Cadastro de aluno:', response.json())

    expect(response.statusCode).toBe(201)
    expect(response.json()).toHaveProperty('id')
  })

  it('deve listar alunos cadastrados', async () => {
    await app.inject({
      method: 'POST',
      url: '/students',
      payload: {
        ra: 123456,
        cpf: '12345678901',
        nome: 'Aluno Teste',
        email: 'aluno@teste.com',
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: '/students',
    })

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.json())).toBe(true)
    expect(response.json().length).toBe(1)
  })

  it('deve editar cadastro de aluno', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/students',
      payload: {
        ra: 654321,
        cpf: '10987654321',
        nome: 'Aluno Editar',
        email: 'alunoeditar@teste.com',
      },
    })

    const student = createResponse.json()

    const updateResponse = await app.inject({
      method: 'PUT',
      url: `/students/${student.id}`,
      payload: {
        nome: 'Aluno Editado',
        email: 'alunoeditado@teste.com',
      },
    })

    expect(updateResponse.statusCode).toBe(200)
    expect(updateResponse.json().nome).toBe('Aluno Editado')
  })

  it('deve excluir cadastro de aluno', async () => {
    const existingStudentResponse = await app.inject({
      method: 'GET',
      url: '/students',
    })

    const existingStudents = existingStudentResponse.json() as Student[]
    let studentId: string | undefined

    const studentRA: number = 789012
    const studentCPF: string = '21098765432'
    const studentName: string = 'Aluno Excluir'
    const studentEmail: string = 'alunoexcluir@teste.com'

    if (
      !existingStudents.some((student: Student) => student.ra === studentRA)
    ) {
      const createResponse = await app.inject({
        method: 'POST',
        url: '/students',
        payload: {
          ra: studentRA,
          cpf: studentCPF,
          nome: studentName,
          email: studentEmail,
        },
      })

      const student = createResponse.json()
      studentId = student.id
    } else {
      const existingStudent = existingStudents.find(
        (student: Student) => student.ra === studentRA
      )

      if (existingStudent) {
        studentId = existingStudent.id
      } else {
        throw new Error('Aluno não encontrado')
      }
    }

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/students/${studentId}`,
    })

    expect(deleteResponse.statusCode).toBe(204)
  })
})
