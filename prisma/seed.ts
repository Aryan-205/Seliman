import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add any non-user seeding here (e.g. menu items, categories)
  console.log("Seed completed.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
