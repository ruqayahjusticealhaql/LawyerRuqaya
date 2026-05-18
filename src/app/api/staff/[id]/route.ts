export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();

  const updateData: Record<string, unknown> = {};
  if (data.name)     updateData.name  = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone || null;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 12);
  if (typeof data.isActive === "boolean") updateData.isActive = data.isActive;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    const { password: _, ...safe } = user;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent deleting yourself
  if (session?.id === id) {
    return NextResponse.json({ error: "لا يمكن حذف حسابك الخاص" }, { status: 400 });
  }

  try {
    await prisma.user.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
