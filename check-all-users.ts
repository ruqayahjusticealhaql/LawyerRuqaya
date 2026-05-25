import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
const accounts = [
  { email: "admin@lawoffice.sa",     password: "Ruqaya@2026"   },
  { email: "content@lawoffice.sa",   password: "Content@2026"  },
  { email: "secretary@lawoffice.sa", password: "Noura@2026"    },
  { email: "hessa@lawoffice.sa",     password: "Hessa@2026"    },
  { email: "abdullah@lawoffice.sa",  password: "Abdullah@2026" },
  { email: "fardan@lawoffice.sa",    password: "Fardan@2026"   },
  { email: "moath@lawoffice.sa",     password: "Moath@2026"    },
];
async function main() {
  for (const acc of accounts) {
    const user = await prisma.user.findUnique({ where: { email: acc.email } });
    const valid = user ? await bcrypt.compare(acc.password, user.password) : false;
    console.log(`${acc.email} | ${acc.password} | ${valid ? "✅" : "❌"}`);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
