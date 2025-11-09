import { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { createCheckIn } from "./create";
import { validateCheckIn } from "./validate";
import { historyCheckIns } from "./history";
import { metricsCheckIns } from "./metrics";

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/check-ins", historyCheckIns);
  app.get("/check-ins/metrics", metricsCheckIns);

  app.post("/gyms/:gymId/check-ins", createCheckIn);

  app.patch("/check-ins/:checkInId/validate", validateCheckIn);
}
