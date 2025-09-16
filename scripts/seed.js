import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const hash = bcrypt.hashSync(password, 10);

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password: hash, name: "Super Admin" },
  });

  console.log(`✅ Admin created/updated: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
