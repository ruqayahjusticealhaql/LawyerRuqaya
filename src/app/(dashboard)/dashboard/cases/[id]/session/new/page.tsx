import { getSession, hasRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewSessionForm from "@/components/dashboard/cases/NewSessionForm";

export default async function NewSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY", "LAWYER")) {
    redirect(`/dashboard/cases/${id}`);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary-700">إضافة جلسة جديدة</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <NewSessionForm caseId={id} />
      </div>
    </div>
  );
}
