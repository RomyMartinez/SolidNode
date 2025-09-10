import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAuthenticateUseCase } from "@/use-case/factories/make-authenticate-use-case";
import { InvalidCredentialsError } from "@/use-case/errors/invalid-credentials-error";

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authenticateUserBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateUserBodySchema.parse(request.body);

  try {
    const authenticateUseCase = makeAuthenticateUseCase();

    await authenticateUseCase.execute({
      email,
      password,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: err.message,
      });
    }
    throw err;
  }

  return reply.status(200).send();
}
