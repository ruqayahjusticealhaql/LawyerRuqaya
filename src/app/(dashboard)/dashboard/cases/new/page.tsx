import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NewCaseForm from "@/components/dashboard/cases/NewCaseForm";

export default async function NewCasePage() {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY", "LAWYER")) {
    redirect("/dashboard/cases");
  }

  const [clients, lawyers] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ where: { role: { in: ["LAWYER"] }, isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary-700">قضية جديدة</h1>
        <p className="text-gray-500 text-sm mt-1">أدخل بيانات القضية الجديدة</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <NewCaseForm clients={clients} lawyers={lawyers} createdById={session!.id} currentUserId={session!.id} currentUserRole={session!.role} />
      </div>
    </div>
  );
}
