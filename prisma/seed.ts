import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const managerPassword        = await bcrypt.hash("admin123",     12);
  const legalSecretaryPassword = await bcrypt.hash("secretary123", 12);
  const lawyerPassword         = await bcrypt.hash("lawyer123",    12);

  const accounts = [
    // ── المدير ──────────────────────────────────────────────────────
    {
      email:    "ruqayyah@lawoffice.sa",
      name:     "رقية عبدالرحمن",
      role:     "MANAGER",
      phone:    "0538225224",
      password: managerPassword,
    },
    // ── السكرتير القانوني ────────────────────────────────────────────
    {
      email:    "secretary@lawoffice.sa",
      name:     "السكرتير القانوني",
      role:     "LEGAL_SECRETARY",
      phone:    "",
      password: legalSecretaryPassword,
    },
    // ── المحامون (4 حسابات) ──────────────────────────────────────────
    {
      email:    "lawyer1@lawoffice.sa",
      name:     "حصة",
      role:     "LAWYER",
      phone:    "",
      password: lawyerPassword,
    },
    {
      email:    "lawyer2@lawoffice.sa",
      name:     "عبدالله",
      role:     "LAWYER",
      phone:    "",
      password: lawyerPassword,
    },
    {
      email:    "lawyer3@lawoffice.sa",
      name:     "فردان",
      role:     "LAWYER",
      phone:    "",
      password: lawyerPassword,
    },
    {
      email:    "lawyer4@lawoffice.sa",
      name:     "معاذ",
      role:     "LAWYER",
      phone:    "",
      password: lawyerPassword,
    },
  ];

  for (const acc of accounts) {
    await prisma.user.upsert({
      where:  { email: acc.email },
      update: { role: acc.role, name: acc.name, phone: acc.phone, isActive: true },
      create: { name: acc.name, email: acc.email, password: acc.password, role: acc.role, phone: acc.phone, isActive: true },
    });
  }

  // عميل تجريبي
  await prisma.client.upsert({
    where:  { nationalId: "1000000000" },
    update: {},
    create: { name: "عميل تجريبي", nationalId: "1000000000", phone: "0599999999" },
  });

  console.log("✅ تم بناء الحسابات: مدير + سكرتير قانوني + 4 محامين");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
