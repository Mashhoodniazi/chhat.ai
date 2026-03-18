import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@chaat.ai";
  const password = "@dmin@bdul123";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN", plan: "BUSINESS", password: hashed },
    });
    console.log(`✓ User ${email} already exists — password and role updated.`);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name: "Admin",
      plan: "BUSINESS",
      role: "ADMIN",
    },
  });

  console.log(`✓ Admin user created: ${user.email} (id: ${user.id})`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
