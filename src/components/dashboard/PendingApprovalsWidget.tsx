"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle2, XCircle, UserCheck, Scale, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ROLE_LABELS } from "@/lib/roles";

interface PendingCase {
  id: string;
  title: string;
  caseNumber: string;
  createdBy: { name: string };
  lawyer: { id: string; name: string } | null;
}

interface PendingTask {
  id: string;
  title: string;
  createdBy: { name: string };
  assignedTo: { id: string; name: string; role: string };
}

interface Props {
  pendingCases: PendingCase[];
  pendingTasks: PendingTask[];
  lawyers: Array<{ id: string; name: string }>;
  users: Array<{ id: string; name: string; role: string }>;
}

export default function PendingApprovalsWidget({ pendingCases, pendingTasks, lawyers, users }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [reassignCaseId, setReassignCaseId] = useState<string | null>(null);
  const [reassignTaskId, setReassignTaskId] = useState<string | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const total = pendingCases.length + pendingTasks.length;
  if (total === 0) return null;

  async function handleCaseAction(caseId: string, action: string, reassignTo?: string) {
    setLoadingId(caseId);
    try {
      await fetch(`/api/cases/${caseId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reassignTo }),
      });
      router.refresh();
    } finally {
      setLoadingId(null);
      setReassignCaseId(null);
      setSelectedLawyer("");
    }
  }

  async function handleTaskAction(taskId: string, action: string, reassignTo?: string) {
    setLoadingId(taskId);
    try {
      await fetch(`/api/tasks/${taskId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reassignTo }),
      });
      router.refresh();
    } finally {
      setLoadingId(null);
      setReassignTaskId(null);
      setSelectedUser("");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 bg-amber-50 border-b border-amber-100">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-amber-900">بانتظار موافقتك</h2>
          <p className="text-xs text-amber-700">{total} طلب يحتاج مراجعة</p>
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {/* Pending Cases */}
        {pendingCases.map((c) => (
          <div key={c.id} className="px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Scale className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-800 truncate">{c.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    قضية · {c.caseNumber} · أضافها {c.createdBy.name}
                    {c.lawyer ? ` · مسندة إلى ${c.lawyer.name}` : ""}
                  </p>
                </div>
              </div>
              <Link href={`/dashboard/cases/${c.id}`} className="text-xs text-slate-400 hover:text-slate-600 flex-shrink-0 flex items-center gap-1">
                عرض <ChevronLeft className="w-3 h-3" />
              </Link>
            </div>

            {reassignCaseId === c.id ? (
              <div className="mt-3 flex gap-2 items-center">
                <select
                  value={selectedLawyer}
                  onChange={(e) => setSelectedLawyer(e.target.value)}
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
                >
                  <option value="">اختر المحامي الجديد</option>
                  {lawyers.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => selectedLawyer && handleCaseAction(c.id, "approve_reassign", selectedLawyer)}
                  disabled={!selectedLawyer || loadingId === c.id}
                  className="px-3 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                >
                  تأكيد
                </button>
                <button onClick={() => setReassignCaseId(null)} className="px-3 py-2 border border-slate-200 text-xs rounded-lg text-slate-500">
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleCaseAction(c.id, "approve")}
                  disabled={loadingId === c.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> قبول
                </button>
                <button
                  onClick={() => setReassignCaseId(c.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" /> قبول مع تغيير المحامي
                </button>
                <button
                  onClick={() => handleCaseAction(c.id, "reject")}
                  disabled={loadingId === c.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" /> رفض
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Pending Tasks */}
        {pendingTasks.map((t) => (
          <div key={t.id} className="px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-800 truncate">{t.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    مهمة · أنشأها {t.createdBy.name} · مسندة إلى {t.assignedTo.name}
                  </p>
                </div>
              </div>
            </div>

            {reassignTaskId === t.id ? (
              <div className="mt-3 flex gap-2 items-center">
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400"
                >
                  <option value="">اختر الشخص الجديد</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({ROLE_LABELS[u.role] || u.role})</option>
                  ))}
                </select>
                <button
                  onClick={() => selectedUser && handleTaskAction(t.id, "approve_reassign", selectedUser)}
                  disabled={!selectedUser || loadingId === t.id}
                  className="px-3 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                >
                  تأكيد
                </button>
                <button onClick={() => setReassignTaskId(null)} className="px-3 py-2 border border-slate-200 text-xs rounded-lg text-slate-500">
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="mt-3 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleTaskAction(t.id, "approve")}
                  disabled={loadingId === t.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> قبول
                </button>
                <button
                  onClick={() => setReassignTaskId(t.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" /> قبول مع تغيير المسند إليه
                </button>
                <button
                  onClick={() => handleTaskAction(t.id, "reject")}
                  disabled={loadingId === t.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" /> رفض
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
