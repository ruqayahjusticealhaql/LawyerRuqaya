import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// Maps any legacy role string to one of the 3 active roles
function normalizeRole(role: string): string {
  const secretaryRoles = new Set([
    "SECRETARY", "ACCOUNTANT", "HR_MANAGER", "RECEPTIONIST",
    "CUSTOMER_SERVICE", "ARCHIVER",
  ]);
  const lawyerRoles = new Set(["ASSISTANT", "TRAINEE", "PARTNER", "ADVISOR"]);

  if (secretaryRoles.has(role)) return "LEGAL_SECRETARY";
  if (lawyerRoles.has(role))    return "LAWYER";
  if (role === "EXECUTIVE")     return "MANAGER";
  return role; // MANAGER, LAWYER, LEGAL_SECRETARY pass through unchanged
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  const session = await prisma.accountSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: normalizeRole(session.user.role),
  };
}

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.accountSession.create({
    data: { userId: user.id, token, expiresAt },
  });

  return { token, user };
}

export async function signOut(token: string) {
  await prisma.accountSession.deleteMany({ where: { token } });
}

export function hasRole(user: SessionUser | null, ...roles: string[]) {
  if (!user) return false;
  return roles.includes(user.role);
}



