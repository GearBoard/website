import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env.js";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

const { PrismaClient } = await import(
  new URL("../../generated/prisma/client.js", import.meta.url).href
);
export const prisma = new PrismaClient({ adapter });
