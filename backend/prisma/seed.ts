/// <reference types="node" />
import "dotenv/config";
import { prisma } from "../src/config/prisma.js";

const departments = [
  { facultyId: 1n, name: "Computer Engineering" },
  { facultyId: 1n, name: "Electrical Engineering" },
  { facultyId: 1n, name: "Mechanical Engineering" },
  { facultyId: 1n, name: "Civil Engineering" },
  { facultyId: 2n, name: "Mathematics" },
  { facultyId: 2n, name: "Physics" },
  { facultyId: 2n, name: "Chemistry" },
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
