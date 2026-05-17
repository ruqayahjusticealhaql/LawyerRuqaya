export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "ACCOUNTANT")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const expense = await prisma.caseExpense.create({
      data: {
        caseId: data.caseId,
        description: data.description,
        amount: data.amount,
        notes: data.notes || null,
      },
    });
    return NextResponse.json(expense, { status: 201 });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
