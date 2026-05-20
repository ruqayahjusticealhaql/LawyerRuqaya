import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate, formatDateTime, formatCurrency, CASE_STATUS_LABELS, CASE_TYPE_LABELS } from "@/lib/utils";
import { Scale, Calendar, FileText, DollarSign, Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";
import AssignLawyerModal from "@/components/dashboard/cases/AssignLawyerModal";
import PendingCaseApprovalBanner from "@/components/dashboard/cases/PendingCaseApprovalBanner";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return null;

  const caseData = await prisma.case.findUnique({
    where: { id },
    include: {
      client: true,
      lawyer: true,
      sessions: { orderBy: { date: "desc" } },
      documents: { orderBy: { uploadedAt: "desc" } },
      contract: { include: { invoices: true, receipts: true } },
      expenses: { orderBy: { date: "desc" } },
      createdBy: true,
    },
  });

  if (!caseData) notFound();

  const isAdmin = session.role === "MANAGER" || session.role === "LEGAL_SECRETARY";
  const isAssignedLawyer = session.role === "LAWYER" && caseData.lawyerId === session.id;

  const canEdit = isAdmin || isAssignedLawyer;
  const canSeeFinance = isAdmin;
  const totalExpenses = caseData.expenses.reduce((sum, e) => sum + e.amount, 0);

  const lawyers = canEdit
    ? await prisma.user.findMany({
        where: { role: "LAWYER", isActive: true },
        select: { id: true, name: true, _count: { select: { assignedCases: true } } },
        orderBy: { name: "asc" },
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Read-only banner for non-assigned lawyers */}
      {session.role === "LAWYER" && !isAssignedLawyer && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", color: "#B45309" }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          هذه القضية مسندة لمحامٍ آخر — أنت في وضع القراءة فقط
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard/cases" className="text-gray-400 hover:text-primary-700 text-sm">
              ← القضايا
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500">{caseData.caseNumber}</span>
          </div>
          <h1 className="text-2xl font-bold text-primary-700">{caseData.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              caseData.status === "ACTIVE" ? "bg-green-100 text-green-700" :
              caseData.status === "WON" ? "bg-blue-100 text-blue-700" :
              caseData.status === "LOST" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {CASE_STATUS_LABELS[caseData.status]}
            </span>
            <span className="text-sm text-gray-500">{CASE_TYPE_LABELS[caseData.type]}</span>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-3">
            <AssignLawyerModal
              caseId={id}
              lawyers={lawyers}
              currentLawyerId={caseData.lawyerId}
            />
            <Link href={`/dashboard/cases/${id}/edit`} className="btn-primary">
              تعديل القضية
            </Link>
          </div>
        )}
      </div>

      {/* Alert: Pending Approval */}
      {caseData.status === "PENDING_APPROVAL" && canEdit && (
        <PendingCaseApprovalBanner
          caseId={id}
          caseTitle={caseData.title}
          lawyers={lawyers}
        />
      )}
      {caseData.status === "PENDING_APPROVAL" && !canEdit && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-semibold">هذه القضية بانتظار موافقة الإدارة قبل تفعيلها.</p>
        </div>
      )}

      {/* Alert: Appeal Deadline */}
      {caseData.appealDeadline && new Date(caseData.appealDeadline) > new Date() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div>
            <span className="font-semibold text-yellow-700">تنبيه: مدة الاستئناف تنتهي في </span>
            <span className="text-yellow-700">{formatDate(caseData.appealDeadline)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-primary-700 mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5" /> تفاصيل القضية
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">العميل:</span> <span className="font-medium">{caseData.client.name}</span></div>
              <div><span className="text-gray-500">رقم القضية:</span> <span className="font-medium font-mono">{caseData.caseNumber}</span></div>
              <div><span className="text-gray-500">المحكمة:</span> <span className="font-medium">{caseData.court || "-"}</span></div>
              <div><span className="text-gray-500">المحامي:</span> <span className="font-medium">{caseData.lawyer?.name || "-"}</span></div>
              <div><span className="text-gray-500">تاريخ البدء:</span> <span className="font-medium">{formatDate(caseData.startDate)}</span></div>
              <div><span className="text-gray-500">الجلسة القادمة:</span> <span className="font-medium text-primary-700">{caseData.nextSession ? formatDateTime(caseData.nextSession) : "-"}</span></div>
            </div>
            {caseData.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-sm leading-relaxed">{caseData.description}</p>
              </div>
            )}
          </div>

          {/* Hearing Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary-700 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> سجل الجلسات
              </h2>
              {canEdit && (
                <Link href={`/dashboard/cases/${id}/session/new`} className="flex items-center gap-1 text-gold text-sm font-semibold hover:underline">
                  <Plus className="w-4 h-4" /> إضافة جلسة
                </Link>
              )}
            </div>
            {caseData.sessions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">لا توجد جلسات مسجّلة</p>
            ) : (
              <div className="space-y-3">
                {caseData.sessions.map((s) => (
                  <div key={s.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{formatDateTime(s.date)}</div>
                        {s.court && <div className="text-xs text-gray-500 mt-0.5">{s.court}</div>}
                        {s.result && <div className="text-sm text-gray-700 mt-2">{s.result}</div>}
                        {s.notes && <div className="text-xs text-gray-500 mt-1">{s.notes}</div>}
                      </div>
                      {s.nextDate && (
                        <div className="text-xs text-primary-700 bg-primary-50 px-2 py-1 rounded-lg">
                          التالية: {formatDate(s.nextDate)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary-700 flex items-center gap-2">
                <FileText className="w-5 h-5" /> المستندات
              </h2>
              {canEdit && (
                <Link href={`/dashboard/cases/${id}/documents`} className="flex items-center gap-1 text-gold text-sm font-semibold hover:underline">
                  <Plus className="w-4 h-4" /> رفع مستند
                </Link>
              )}
            </div>
            {caseData.documents.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">لا توجد مستندات مرفوعة</p>
            ) : (
              <div className="space-y-2">
                {caseData.documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">{d.name}</div>
                        <div className="text-xs text-gray-400">{formatDate(d.uploadedAt)}</div>
                      </div>
                    </div>
                    <a href={d.fileUrl} target="_blank" className="text-primary-700 text-sm hover:underline">
                      فتح
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Financial */}
        <div className="space-y-6">
          {canSeeFinance && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-primary-700 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> الحساب المالي
              </h2>
              {caseData.contract ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">إجمالي العقد</span>
                    <span className="font-bold text-gray-800">{formatCurrency(caseData.contract.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المحصّل</span>
                    <span className="font-bold text-green-600">{formatCurrency(caseData.contract.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المتبقي</span>
                    <span className="font-bold text-red-500">{formatCurrency(caseData.contract.totalAmount - caseData.contract.paidAmount)}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">مصاريف القضية</span>
                      <span className="font-bold text-orange-500">{formatCurrency(totalExpenses)}</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/finance?caseId=${id}`} className="btn-primary w-full text-center text-sm mt-3 block">
                    تفاصيل الحساب
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm mb-3">لا يوجد عقد مالي</p>
                  <Link href={`/dashboard/finance/new?caseId=${id}`} className="btn-primary text-sm">
                    إنشاء عقد
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Client Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-primary-700 mb-4">بيانات العميل</h2>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-500">الاسم: </span><span className="font-medium">{caseData.client.name}</span></div>
              <div><span className="text-gray-500">الجوال: </span><span className="font-medium" dir="ltr">{caseData.client.phone}</span></div>
              {caseData.client.email && <div><span className="text-gray-500">البريد: </span><span className="font-medium">{caseData.client.email}</span></div>}
              {caseData.client.nationalId && <div><span className="text-gray-500">الهوية: </span><span className="font-medium" dir="ltr">{caseData.client.nationalId}</span></div>}
            </div>
            <Link href={`/dashboard/clients/${caseData.clientId}`} className="text-gold text-sm hover:underline mt-3 block">
              ملف العميل الكامل ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
