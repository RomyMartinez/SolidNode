import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserProfileUseCase } from "@/use-case/factories/make-get-user-profile-use-case";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

  const response = await makeGetUserProfileUseCase().execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({
    user: {
      ...response.user,
      password_hash: undefined,
    },
  });
}
