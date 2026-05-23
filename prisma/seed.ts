import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── ترحيل الأدوار القديمة ────────────────────────────────────────
  await prisma.user.updateMany({
    where: { role: { in: ["SECRETARY", "ACCOUNTANT", "HR_MANAGER", "RECEPTIONIST", "CUSTOMER_SERVICE", "ARCHIVER", "CONTENT_MANAGER"] } },
    data: { role: "LEGAL_SECRETARY" },
  });
  await prisma.user.updateMany({
    where: { role: { in: ["ASSISTANT", "TRAINEE", "PARTNER", "ADVISOR"] } },
    data: { role: "LAWYER" },
  });
  await prisma.user.updateMany({
    where: { role: "EXECUTIVE" },
    data: { role: "MANAGER" },
  });
  const adminPassword     = await bcrypt.hash("Admin@2024", 12);
  const secretaryPassword = await bcrypt.hash("Admin@2024", 12);
  const lawyerPassword    = await bcrypt.hash("Admin@2024", 12);

  const accounts = [
    // ── المدير ──────────────────────────────────────────────────────
    {
      email:    "admin@lawoffice.sa",
      name:     "رقية عبدالرحمن",
      role:     "MANAGER",
      phone:    "0538225224",
      password: adminPassword,
    },
    // ── مدير المحتوى ─────────────────────────────────────────────────
    {
      email:    "content@lawoffice.sa",
      name:     "مدير المحتوى",
      role:     "MANAGER",
      phone:    "",
      password: adminPassword,
    },
    // ── السكرتير القانوني ────────────────────────────────────────────
    {
      email:    "secretary@lawoffice.sa",
      name:     "نورة",
      role:     "LEGAL_SECRETARY",
      phone:    "",
      password: secretaryPassword,
    },
    // ── المحامون (4 حسابات) ──────────────────────────────────────────
    {
      email:    "hessa@lawoffice.sa",
      name:     "حصة",
      role:     "LAWYER",
      phone:    "",
      password: lawyerPassword,
    },
    {
      email:    "abdullah@lawoffice.sa",
      name:     "عبدالله",
      role:     "LAWYER",
      phone:    "",
      password: lawyerPassword,
    },
    {
      email:    "fardan@lawoffice.sa",
      name:     "فردان",
      role:     "LAWYER",
      phone:    "",
      password: lawyerPassword,
    },
    {
      email:    "moath@lawoffice.sa",
      name:     "معاذ",
      role:     "LAWYER",
      phone:    "",
      password: lawyerPassword,
    },
  ];

  for (const acc of accounts) {
    await prisma.user.upsert({
      where:  { email: acc.email },
      update: { role: acc.role, name: acc.name, phone: acc.phone, isActive: true, password: acc.password },
      create: { name: acc.name, email: acc.email, password: acc.password, role: acc.role, phone: acc.phone, isActive: true },
    });
  }

  // عميل تجريبي
  await prisma.client.upsert({
    where:  { nationalId: "1000000000" },
    update: {},
    create: { name: "عميل تجريبي", nationalId: "1000000000", phone: "0599999999" },
  });

  console.log("✅ تم بناء الحسابات: مدير + سكرتير قانوني + 4 محامين (admin / secretary / hessa / abdullah / fardan / moath)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
