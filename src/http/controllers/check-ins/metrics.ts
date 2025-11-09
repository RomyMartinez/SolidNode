import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetUserMetricsUseCase } from "@/use-case/factories/make-get-user-metrics-use-case";

export async function metricsCheckIns(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const getUserMetricsUseCase = makeGetUserMetricsUseCase();
  const metrics = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send(metrics);
}
