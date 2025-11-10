import { randomUUID } from "crypto";
import "dotenv/config";
import { execSync } from "node:child_process";
import type { Environment } from "vitest";
import { prisma } from "@/lib/prisma";

function generateSchemaName(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    const schema = randomUUID();
    const databaseURL = generateSchemaName(schema);

    console.log("schema", schema);

    process.env.DATABASE_URL = databaseURL;

    console.log("DATABASE_URL", databaseURL);

    execSync(`pnpm prisma db push`);

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );

        await prisma.$disconnect();
      },
    };
  },
};
