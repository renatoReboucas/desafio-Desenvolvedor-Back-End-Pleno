import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import 'dotenv/config'
import cors from '@fastify/cors'
import { StudentRoutes } from '../Routes/Student'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: true,
})

app.get('/ping', async () => {
  return { ping: 'pong' }
})

app.register(StudentRoutes, { prefix: 'api/student' })

app
  .listen({
    port: !process.env.PORT ? 3333 : parseInt(process.env.PORT),
    host: '0.0.0.0',
  })
  .then(() => {
    console.info(`🚀 Server is running on port ${process.env.PORT || 3333}`)
  })
