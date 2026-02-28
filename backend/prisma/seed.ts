/// <reference types="node" />
import "dotenv/config";
import { prisma } from "../src/config/prisma.js";

async function main() {
  console.log("Seeding...");
  // Add seed logic here
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
