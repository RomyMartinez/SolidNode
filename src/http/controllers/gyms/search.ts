import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeSearchGymsUseCase } from "@/use-case/factories/make-search-gyms-use-case";

export async function searchGyms(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsBodySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { query, page } = searchGymsBodySchema.parse(request.query);

  const searchGymsUseCase = makeSearchGymsUseCase();
  const gyms = await searchGymsUseCase.execute({
    query,
    page,
  });

  return reply.status(200).send(gyms);
}
