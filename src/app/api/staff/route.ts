export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        phone: data.phone || null,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم مسبقاً" }, { status: 400 });
    }
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
