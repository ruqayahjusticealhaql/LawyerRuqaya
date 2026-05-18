import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NewContractForm from "@/components/dashboard/finance/NewContractForm";

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ caseId?: string }>;
}) {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY")) redirect("/dashboard");

  const params = await searchParams;

  const cases = await prisma.case.findMany({
    where: { contract: null },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary-700">عقد جديد</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <NewContractForm cases={cases} defaultCaseId={params.caseId} />
      </div>
    </div>
  );
}
