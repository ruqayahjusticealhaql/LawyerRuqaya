import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash("123456", 12);

  // 1. MANAGER
  const accounts = [
    { email: "manager@lawoffice.sa",    name: "المدير العام",              role: "MANAGER",         phone: "0500000001" },
    { email: "content@lawoffice.sa",    name: "مدير المحتوى",              role: "CONTENT_MANAGER", phone: "0500000002" },
    { email: "accountant@lawoffice.sa", name: "المحاسب المالي",            role: "ACCOUNTANT",      phone: "0500000003" },
    { email: "hr@lawoffice.sa",         name: "مدير الموارد البشرية",      role: "HR_MANAGER",      phone: "0500000004" },
    { email: "lawyer@lawoffice.sa",     name: "المحامي الأساسي",           role: "LAWYER",          phone: "0500000005" },
    { email: "advisor@lawoffice.sa",    name: "المستشار القانوني",         role: "ADVISOR",         phone: "0500000006" },
    { email: "secretary@lawoffice.sa",  name: "السكرتير القانوني",         role: "SECRETARY",       phone: "0500000007" },
    { email: "reception@lawoffice.sa",  name: "موظف الاستقبال",            role: "RECEPTIONIST",    phone: "0500000008" },
  ];

  for (const acc of accounts) {
    await prisma.user.upsert({
      where: { email: acc.email },
      update: { role: acc.role, password: defaultPassword, isActive: true },
      create: { name: acc.name, email: acc.email, password: defaultPassword, role: acc.role, phone: acc.phone, isActive: true },
    });
  }

  // Clean old dummy data that might conflict (e.g. users not in the 8 roles)
  const allowedEmails = [
    "manager@lawoffice.sa", "content@lawoffice.sa", "accountant@lawoffice.sa",
    "hr@lawoffice.sa", "lawyer@lawoffice.sa", "advisor@lawoffice.sa",
    "secretary@lawoffice.sa", "reception@lawoffice.sa"
  ];
  await prisma.user.deleteMany({
    where: { email: { notIn: allowedEmails } }
  });


  // Add a dummy client to avoid dropping relations if needed
  const dummyClient = await prisma.client.upsert({
    where: { nationalId: "1000000000" },
    update: {},
    create: {
      name: "عميل تجريبي",
      nationalId: "1000000000",
      phone: "0599999999",
    }
  });

  console.log("✅ تم بناء الـ 8 حسابات بنجاح وإزالة القديم.");
  console.log("كلمة المرور الموحدة: 123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
