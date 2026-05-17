export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();

  const hearingSession = await prisma.hearingSession.create({
    data: {
      caseId: id,
      date: new Date(data.date),
      court: data.court || null,
      result: data.result || null,
      notes: data.notes || null,
      nextDate: data.nextDate ? new Date(data.nextDate) : null,
    },
  });

  return NextResponse.json(hearingSession, { status: 201 });
}
