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
    const receiptNumber = `RCP-${Date.now()}`;

    const receipt = await prisma.receipt.create({
      data: {
        receiptNumber,
        contractId: data.contractId,
        amount: data.amount,
        paymentMethod: data.paymentMethod || "cash",
        notes: data.notes || null,
      },
    });

    // Update contract paid amount and status
    const contract = await prisma.contract.findUnique({
      where: { id: data.contractId },
      include: { receipts: true },
    });

    if (contract) {
      const totalPaid = contract.receipts.reduce((s, r) => s + r.amount, 0) + data.amount;
      let paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE" = "PARTIAL";
      if (totalPaid >= contract.totalAmount) paymentStatus = "PAID";
      else if (totalPaid === 0) paymentStatus = "PENDING";

      await prisma.contract.update({
        where: { id: data.contractId },
        data: { paidAmount: totalPaid, paymentStatus },
      });
    }

    return NextResponse.json(receipt, { status: 201 });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
