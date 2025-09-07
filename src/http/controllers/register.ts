import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '@/use-case/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export const registerUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = createUserBodySchema.parse(request.body)

  try {
    const registerUseCase = new RegisterUseCase(new PrismaUsersRepository())
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
