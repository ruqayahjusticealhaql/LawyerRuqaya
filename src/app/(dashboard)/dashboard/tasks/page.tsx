import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TasksRegistry from "@/components/dashboard/TasksRegistry";
import NewTaskModal from "@/components/dashboard/NewTaskModal";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const [tasks, users, cases] = await Promise.all([
    prisma.task.findMany({
      include: { assignedTo: true, createdBy: true, case: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { isActive: true, role: { in: ["MANAGER", "LAWYER", "LEGAL_SECRETARY", "CONTENT_MANAGER"] } },
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

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>العمليات الإدارية</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>إدارة المهام والعمليات التشاركية</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>إسناد المهام بين الكادر القانوني والمحاسبي وتتبع الخط الزمني للإنجاز</p>
        </div>
        <NewTaskModal users={users} cases={cases} currentUserId={session.id} currentUserRole={session.role} />
      </div>

      <TasksRegistry initialTasks={tasks} currentUserId={session.id} currentUserRole={session.role} />

    </div>
  );
}
