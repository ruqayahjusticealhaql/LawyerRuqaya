import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TasksRegistry from "@/components/dashboard/TasksRegistry";

export const dynamic = "force-dynamic";

export default async function MyTasksPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const [tasks, users, cases] = await Promise.all([
    prisma.task.findMany({
      where: { assignedToId: session.id },
      include: { assignedTo: true, createdBy: true, case: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, role: true },
      orderBy: { name: "asc" },
    }),
    prisma.case.findMany({
      select: { id: true, title: true, caseNumber: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>المهام المسندة إليّ</p>
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>مهامي</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>المهام المسندة إليك مباشرة ({tasks.length} مهمة)</p>
      </div>

      <TasksRegistry initialTasks={tasks} currentUserId={session.id} currentUserRole={session.role} defaultScope="MINE" />
    </div>
  );
}
