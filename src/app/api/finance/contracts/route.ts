export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const contract = await prisma.contract.create({
      data: {
        contractNumber: data.contractNumber,
        caseId: data.caseId,
        clientId: data.clientId,
        totalAmount: data.totalAmount,
        notes: data.notes || null,
      },
    });
    return NextResponse.json(contract, { status: 201 });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
