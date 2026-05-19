export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hasRole } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY")) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await params;
  const { action, reassignTo } = await req.json();
  // action: "approve" | "reject" | "approve_reassign"

  const caseData = await prisma.case.findUnique({ where: { id }, include: { createdBy: true } });
  if (!caseData) return NextResponse.json({ error: "القضية غير موجودة" }, { status: 404 });

  if (action === "approve") {
    await prisma.case.update({ where: { id }, data: { status: "ACTIVE" } });

    // Notify case creator
    await prisma.notification.create({
      data: {
        userId: caseData.createdById,
        title: "تمت الموافقة على القضية",
        message: `تمت الموافقة على القضية "${caseData.title}" وأصبحت نشطة.`,
        type: "CASE",
        actionUrl: `/dashboard/cases/${id}`,
      },
    });
    // Notify assigned lawyer if different from creator
    if (caseData.lawyerId && caseData.lawyerId !== caseData.createdById) {
      await prisma.notification.create({
        data: {
          userId: caseData.lawyerId,
          title: "قضية جديدة مسندة إليك",
          message: `تم إسناد القضية "${caseData.title}" إليك وأصبحت نشطة.`,
          type: "CASE",
          actionUrl: `/dashboard/cases/${id}`,
        },
      });
    }

    return NextResponse.json({ success: true, message: "تمت الموافقة على القضية" });
  }

  if (action === "reject") {
    await prisma.case.update({ where: { id }, data: { status: "CLOSED" } });

    await prisma.notification.create({
      data: {
        userId: caseData.createdById,
        title: "تم رفض القضية",
        message: `تم رفض القضية "${caseData.title}" من قبل الإدارة.`,
        type: "CASE",
        actionUrl: `/dashboard/cases/${id}`,
      },
    });

    return NextResponse.json({ success: true, message: "تم رفض القضية" });
  }

  if (action === "approve_reassign" && reassignTo) {
    await prisma.case.update({
      where: { id },
      data: { status: "ACTIVE", lawyerId: reassignTo },
    });

    const newLawyer = await prisma.user.findUnique({ where: { id: reassignTo }, select: { name: true } });

    await prisma.notification.create({
      data: {
        userId: caseData.createdById,
        title: "تمت الموافقة على القضية مع تغيير المسؤول",
        message: `تمت الموافقة على القضية "${caseData.title}" وأُسندت إلى ${newLawyer?.name}.`,
        type: "CASE",
        actionUrl: `/dashboard/cases/${id}`,
      },
    });
    await prisma.notification.create({
      data: {
        userId: reassignTo,
        title: "قضية جديدة مسندة إليك",
        message: `تم إسناد القضية "${caseData.title}" إليك من قبل الإدارة.`,
        type: "CASE",
        actionUrl: `/dashboard/cases/${id}`,
      },
    });

    return NextResponse.json({ success: true, message: "تمت الموافقة مع تغيير المسؤول" });
  }

  return NextResponse.json({ error: "إجراء غير صالح" }, { status: 400 });
}
