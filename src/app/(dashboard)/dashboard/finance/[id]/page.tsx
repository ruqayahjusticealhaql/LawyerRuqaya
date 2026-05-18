import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { formatCurrency, formatDate, PAYMENT_STATUS_LABELS } from "@/lib/utils";
import { DollarSign, Plus, Receipt, FileText } from "lucide-react";
import Link from "next/link";
import AddReceiptForm from "@/components/dashboard/finance/AddReceiptForm";
import AddExpenseForm from "@/components/dashboard/finance/AddExpenseForm";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY")) {
    redirect("/dashboard");
  }

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      case: { include: { expenses: { orderBy: { date: "desc" } } } },
      client: true,
      invoices: { orderBy: { createdAt: "desc" } },
      receipts: { orderBy: { paymentDate: "desc" } },
    },
  });

  if (!contract) notFound();

  const remaining = contract.totalAmount - contract.paidAmount;
  const totalExpenses = contract.case.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/finance" className="text-gray-400 hover:text-primary-700 text-sm">← الحسابات</Link>
        <h1 className="text-2xl font-bold text-primary-700 mt-2">عقد رقم: {contract.contractNumber}</h1>
        <p className="text-gray-500 text-sm">{contract.client.name} · {contract.case.title}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "إجمالي العقد", value: formatCurrency(contract.totalAmount), color: "text-gray-800" },
          { label: "المحصّل", value: formatCurrency(contract.paidAmount), color: "text-green-600" },
          { label: "المتبقي", value: formatCurrency(remaining), color: "text-red-500" },
          { label: "المصاريف", value: formatCurrency(totalExpenses), color: "text-orange-500" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className={`text-2xl font-bold ${item.color}`}>{item.value}</div>
            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receipts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-primary-700 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5" /> سندات القبض
          </h2>
          <AddReceiptForm contractId={contract.id} />
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {contract.receipts.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg text-sm">
                <div>
                  <div className="font-medium text-gray-800">{formatCurrency(r.amount)}</div>
                  <div className="text-xs text-gray-500">{formatDate(r.paymentDate)} · {r.paymentMethod}</div>
                  {r.notes && <div className="text-xs text-gray-400">{r.notes}</div>}
                </div>
                <span className="text-xs text-green-600 font-mono">{r.receiptNumber}</span>
              </div>
            ))}
            {contract.receipts.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">لا توجد مقبوضات</p>
            )}
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-primary-700 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> مصاريف القضية
          </h2>
          <AddExpenseForm caseId={contract.caseId} />
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {contract.case.expenses.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg text-sm">
                <div>
                  <div className="font-medium text-gray-800">{e.description}</div>
                  <div className="text-xs text-gray-500">{formatDate(e.date)}</div>
                  {e.notes && <div className="text-xs text-gray-400">{e.notes}</div>}
                </div>
                <span className="font-bold text-orange-600">{formatCurrency(e.amount)}</span>
              </div>
            ))}
            {contract.case.expenses.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">لا توجد مصاريف</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
