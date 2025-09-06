import fastify from 'fastify'
import { PrismaClient } from '../generated/prisma/client'

export const prisma = new PrismaClient()

export const app = fastify()
