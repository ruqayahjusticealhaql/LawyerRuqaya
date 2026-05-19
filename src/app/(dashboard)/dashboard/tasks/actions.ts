"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(taskId: string, newStatus: string) {
  const session = await getSession();
  if (!session) throw new Error("غير مصرح لك بالقيام بهذا الإجراء");

  const task = await prisma.task.findUnique({ where: { id: taskId }, include: { assignedTo: true } });
  if (!task) throw new Error("المهمة غير موجودة");

  await prisma.task.update({ where: { id: taskId }, data: { status: newStatus } });

  try {
    await prisma.activityLog.create({
      data: {
        userId: session.id,
        action: "UPDATE_STATUS",
        entity: "TASK",
        entityId: taskId,
        changes: JSON.stringify({ from: task.status, to: newStatus }),
      },
    });
  } catch {}

  revalidatePath("/dashboard/tasks");
  return { success: true };
}

export async function createTask(data: {
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  assignedToId: string;
  caseId?: string;
  attachments?: string[];
  parentTaskId?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("غير مصرح لك بالقيام بهذا الإجراء");

  if (!data.title) throw new Error("عنوان المهمة مطلوب");
  if (!data.assignedToId) throw new Error("يجب اختيار العضو المسند إليه المهمة");

  // Determine approval status
  const isSelfAssigned = data.assignedToId === session.id;
  const approvalStatus =
    session.role === "LAWYER" && !isSelfAssigned ? "PENDING_APPROVAL" : "APPROVED";

  const createdTask = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || "",
      priority: data.priority || "MEDIUM",
      status: data.status || "TODO",
      approvalStatus,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      assignedToId: data.assignedToId,
      createdById: session.id,
      caseId: data.caseId || null,
      attachments: data.attachments?.length ? JSON.stringify(data.attachments) : null,
      parentTaskId: data.parentTaskId || null,
    },
  });

  if (approvalStatus === "PENDING_APPROVAL") {
    // Notify admins
    const admins = await prisma.user.findMany({
      where: { role: { in: ["MANAGER", "LEGAL_SECRETARY"] }, isActive: true },
      select: { id: true },
    });
    await Promise.all(
      admins.map((admin) =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            title: "مهمة تنتظر موافقتك",
            message: `أنشأ المحامي ${session.name} مهمة جديدة "${data.title}" وأسندها لعضو آخر — بانتظار موافقتك.`,
            type: "TASK",
            actionUrl: `/dashboard/tasks`,
          },
        })
      )
    );
  } else {
    // Notify assigned person directly
    if (data.assignedToId !== session.id) {
      try {
        await prisma.notification.create({
          data: {
            userId: data.assignedToId,
            title: "مهمة جديدة مسندة إليك",
            message: `تم إسناد مهمة جديدة لك: "${data.title}" من قبل ${session.name}`,
            type: "TASK",
            actionUrl: `/dashboard/tasks`,
          },
        });
      } catch {}
    }
  }

  revalidatePath("/dashboard/tasks");
  return { success: true, task: createdTask };
}

export async function addTaskComment(taskId: string, content: string) {
  const session = await getSession();
  if (!session) throw new Error("غير مصرح");

  const comment = await prisma.taskComment.create({
    data: { taskId, userId: session.id, content },
    include: { user: { select: { id: true, name: true, role: true } } },
  });

  revalidatePath("/dashboard/tasks");
  return { success: true, comment };
}

export async function createSubTask(parentTaskId: string, data: {
  title: string;
  assignedToId: string;
  dueDate?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("غير مصرح");

  const subTask = await prisma.task.create({
    data: {
      title: data.title,
      priority: "MEDIUM",
      status: "TODO",
      approvalStatus: "APPROVED",
      assignedToId: data.assignedToId,
      createdById: session.id,
      parentTaskId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });

  revalidatePath("/dashboard/tasks");
  return { success: true, subTask };
}
