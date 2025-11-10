import type { FastifyInstance } from "fastify";

import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { createGym } from "./create";
import { fetchNearbyGyms } from "./nearby";
import { searchGyms } from "./search";
import { VerifyUserRole } from "@/http/middlewares/verify-user-role";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.get("/gyms/nearby", fetchNearbyGyms);
  app.get("/gyms/search", searchGyms);

  app.post("/gyms", { onRequest: [VerifyUserRole("ADMIN")] }, createGym);
}
