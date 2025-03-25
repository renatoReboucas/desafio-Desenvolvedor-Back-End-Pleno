import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import 'dotenv/config'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { UserRoutes } from '../Routes/Users'
import { LoginRoutes } from '../Routes/Login'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cors, {
  origin: true,
})

app.register(fastifyJwt, {
  secret: "teste",
});

app.get('/ping', async () => {
  return { ping: 'pong' }
})

app.register(UserRoutes, { prefix: 'api/user' })
app.register(LoginRoutes, { prefix: 'api/auth' })

app
  .listen({
    port: !process.env.PORT ? 3333 : parseInt(process.env.PORT),
    host: '0.0.0.0',
  })
  .then(() => {
    console.info(`🚀 Server is running on port ${process.env.PORT || 3333}`)
  })
