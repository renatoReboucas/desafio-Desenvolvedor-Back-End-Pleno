import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { UserRoutes } from '../Routes/Users'
import { LoginRoutes } from '../Routes/Login'

export const build = async () => {
  const app = fastify()

  app.register(fastifyJwt, {
    secret: 'teste'
  })

  app.register(UserRoutes, { prefix: '/users' })
  app.register(LoginRoutes, { prefix: '/login' })

  return app
}
