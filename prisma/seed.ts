import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@example.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin user already exists");
    return;
  }
  const hashed = await hash("admin123", 10);
  await prisma.user.create({
    data: {
      email,
      name: "Admin",
      password: hashed,
      role: "ADMIN",
    },
  });
  console.log("Created admin user:", email, "password: admin123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
