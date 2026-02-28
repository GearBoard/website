/// <reference types="node" />
import "dotenv/config";
import { prisma } from "../src/config/prisma.js";

const departments = [
  { name: "Computer Engineering" },
  { name: "Electrical Engineering" },
  { name: "Mechanical Engineering" },
  { name: "Civil Engineering" },
  { name: "Mathematics" },
  { name: "Physics" },
  { name: "Chemistry" },
];

async function main() {
  console.log("Seeding...");

  console.log("Seeding departments...");
  const existing = await prisma.department.count();
  if (existing === 0) {
    const created = await prisma.department.createMany({
      data: departments,
    });
    console.log(`Created ${created.count} department(s).`);
  } else {
    console.log(`Departments already exist (${existing}), skipping.`);
  }
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
