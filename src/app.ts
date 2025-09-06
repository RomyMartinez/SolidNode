import fastify from 'fastify'
import { PrismaClient } from '../generated/prisma/client'

export const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Romy',
    email: 'romy@example.com',
  },
})

export const app = fastify()
