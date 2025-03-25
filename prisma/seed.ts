import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.users.createMany({
    data: [
      {
        cpf: '98765432100',
        nome: 'Admin User',
        email: 'admin@example.com',
        password: 'mudar123'
      },

    ]
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })