export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const updatedCase = await prisma.case.update({
    where: { id },
    data: {
      ...(data.nextSession !== undefined ? { nextSession: data.nextSession ? new Date(data.nextSession) : null } : {}),
      ...(data.appealDeadline !== undefined ? { appealDeadline: data.appealDeadline ? new Date(data.appealDeadline) : null } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.title ? { title: data.title } : {}),
      ...(data.type ? { type: data.type } : {}),
      ...(data.clientId ? { clientId: data.clientId } : {}),
      ...(data.lawyerId !== undefined ? { lawyerId: data.lawyerId || null } : {}),
      ...(data.court !== undefined ? { court: data.court || null } : {}),
      ...(data.description !== undefined ? { description: data.description || null } : {}),
    },
  });

  return NextResponse.json(updatedCase);
}
