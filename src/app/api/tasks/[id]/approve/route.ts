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

  const task = await prisma.task.findUnique({ where: { id }, include: { createdBy: true } });
  if (!task) return NextResponse.json({ error: "المهمة غير موجودة" }, { status: 404 });

  if (action === "approve") {
    await prisma.task.update({ where: { id }, data: { approvalStatus: "APPROVED" } });

    await prisma.notification.create({
      data: {
        userId: task.createdById,
        title: "تمت الموافقة على المهمة",
        message: `تمت الموافقة على المهمة "${task.title}" وأصبحت نشطة.`,
        type: "TASK",
        actionUrl: `/dashboard/tasks`,
      },
    });
    if (task.assignedToId !== task.createdById) {
      await prisma.notification.create({
        data: {
          userId: task.assignedToId,
          title: "مهمة جديدة مسندة إليك",
          message: `تم إسناد المهمة "${task.title}" إليك وأصبحت نشطة.`,
          type: "TASK",
          actionUrl: `/dashboard/tasks`,
        },
      });
    }
    return NextResponse.json({ success: true });
  }

  if (action === "reject") {
    await prisma.task.update({ where: { id }, data: { approvalStatus: "REJECTED" } });

    await prisma.notification.create({
      data: {
        userId: task.createdById,
        title: "تم رفض المهمة",
        message: `تم رفض المهمة "${task.title}" من قبل الإدارة.`,
        type: "TASK",
        actionUrl: `/dashboard/tasks`,
      },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "approve_reassign" && reassignTo) {
    await prisma.task.update({
      where: { id },
      data: { approvalStatus: "APPROVED", assignedToId: reassignTo },
    });

    const newUser = await prisma.user.findUnique({ where: { id: reassignTo }, select: { name: true } });

    await prisma.notification.create({
      data: {
        userId: task.createdById,
        title: "تمت الموافقة على المهمة مع تغيير المسند إليه",
        message: `تمت الموافقة على المهمة "${task.title}" وأُسندت إلى ${newUser?.name}.`,
        type: "TASK",
        actionUrl: `/dashboard/tasks`,
      },
    });
    await prisma.notification.create({
      data: {
        userId: reassignTo,
        title: "مهمة جديدة مسندة إليك",
        message: `تم إسناد المهمة "${task.title}" إليك من قبل الإدارة.`,
        type: "TASK",
        actionUrl: `/dashboard/tasks`,
      },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "إجراء غير صالح" }, { status: 400 });
}
