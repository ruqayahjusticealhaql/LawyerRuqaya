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
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  // Only MANAGER, LEGAL_SECRETARY, and LAWYER can create cases
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY", "LAWYER")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  try {
    const data = await req.json();

    // Determine approval status based on role and assignment
    let caseStatus = "ACTIVE";
    if (session.role === "LAWYER") {
      const isSelfAssigned = data.lawyerId === session.id;
      if (!isSelfAssigned && data.lawyerId) {
        // Assigning to another lawyer — requires approval
        caseStatus = "PENDING_APPROVAL";
      }
      // Self-assign or unassigned → ACTIVE immediately
    }

    const newCase = await prisma.case.create({
      data: {
        title: data.title,
        caseNumber: data.caseNumber,
        type: data.type || "OTHER",
        status: caseStatus,
        clientId: data.clientId,
        lawyerId: data.lawyerId || null,
        createdById: session.id,
        court: data.court || null,
        description: data.description || null,
        nextSession: data.nextSession ? new Date(data.nextSession) : null,
        appealDeadline: data.appealDeadline ? new Date(data.appealDeadline) : null,
      },
    });

    // If pending approval, notify managers and secretaries
    if (caseStatus === "PENDING_APPROVAL") {
      const admins = await prisma.user.findMany({
        where: { role: { in: ["MANAGER", "LEGAL_SECRETARY"] }, isActive: true },
        select: { id: true },
      });
      await Promise.all(
        admins.map((admin) =>
          prisma.notification.create({
            data: {
              userId: admin.id,
              title: "قضية تنتظر موافقتك",
              message: `أضاف المحامي ${session.name} قضية جديدة "${data.title}" وأسندها لمحامٍ آخر — بانتظار موافقتك.`,
              type: "CASE",
              actionUrl: `/dashboard/cases/${newCase.id}`,
            },
          })
        )
      );
    }

    return NextResponse.json(newCase, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "رقم القضية مستخدم مسبقاً" }, { status: 400 });
    }
    return NextResponse.json({ error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}
