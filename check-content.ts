import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.findUnique({ where: { email: "content@lawoffice.sa" } });
  const valid = user ? await bcrypt.compare("Admin@2026", user.password) : false;
  console.log("الإيميل:", user?.email);
  console.log("الاسم:", user?.name);
  console.log("الدور في DB:", user?.role);
  console.log("isActive:", user?.isActive);
  console.log("كلمة السر صحيحة:", valid ? "✅" : "❌");
}
main().catch(console.error).finally(() => prisma.$disconnect());
