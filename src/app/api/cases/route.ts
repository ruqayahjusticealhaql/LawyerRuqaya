export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const cases = await prisma.case.findMany({
    where: session.role === "LAWYER" ? { lawyerId: session.id } : {},
    include: { client: true, lawyer: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(cases);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "SECRETARY")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const newCase = await prisma.case.create({
      data: {
        title: data.title,
        caseNumber: data.caseNumber,
        type: data.type || "OTHER",
        clientId: data.clientId,
        lawyerId: data.lawyerId || null,
        createdById: data.createdById,
        court: data.court || null,
        description: data.description || null,
        nextSession: data.nextSession ? new Date(data.nextSession) : null,
        appealDeadline: data.appealDeadline ? new Date(data.appealDeadline) : null,
      },
    });
    return NextResponse.json(newCase, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "رقم القضية مستخدم مسبقاً" }, { status: 400 });
    }
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
