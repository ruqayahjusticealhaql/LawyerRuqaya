export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const clients = await prisma.client.findMany({
    include: { _count: { select: { cases: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "SECRETARY")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const client = await prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        nationalId: data.nationalId || null,
        address: data.address || null,
        notes: data.notes || null,
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "رقم الهوية مستخدم مسبقاً" }, { status: 400 });
    }
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
