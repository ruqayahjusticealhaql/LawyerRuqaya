"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, UserCheck, Clock } from "lucide-react";

interface Props {
  caseId: string;
  caseTitle: string;
  lawyers: Array<{ id: string; name: string; _count: { assignedCases: number } }>;
}

export default function PendingCaseApprovalBanner({ caseId, caseTitle, lawyers }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReassign, setShowReassign] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState("");

  async function submit(action: string, reassignTo?: string) {
    setLoading(true);
    try {
      await fetch(`/api/cases/${caseId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reassignTo }),
      });
      router.refresh();
    } finally {
      setLoading(false);
      setShowReassign(false);
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <p className="font-bold text-amber-900 text-sm">هذه القضية تنتظر موافقتك</p>
          <p className="text-xs text-amber-700 mt-0.5">أضافها أحد المحامين وأسندها لمحامٍ آخر — يمكنك القبول أو الرفض أو إعادة التوجيه.</p>
        </div>
      </div>

      {showReassign ? (
        <div className="flex gap-2 items-center">
          <select
            value={selectedLawyer}
            onChange={(e) => setSelectedLawyer(e.target.value)}
            className="flex-1 text-sm border border-amber-300 rounded-lg px-3 py-2 outline-none focus:border-amber-500 bg-white"
          >
            <option value="">اختر المحامي الجديد</option>
            {lawyers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l._count.assignedCases} قضية)
              </option>
            ))}
          </select>
          <button
            onClick={() => selectedLawyer && submit("approve_reassign", selectedLawyer)}
            disabled={!selectedLawyer || loading}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? "..." : "تأكيد"}
          </button>
          <button
            onClick={() => setShowReassign(false)}
            className="px-4 py-2 border border-amber-300 text-amber-700 text-sm font-bold rounded-lg hover:bg-amber-100 transition-colors"
          >
            إلغاء
          </button>
        </div>
      ) : (
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => submit("approve")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> قبول وتفعيل القضية
          </button>
          <button
            onClick={() => setShowReassign(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors"
          >
            <UserCheck className="w-4 h-4" /> قبول مع تغيير المحامي
          </button>
          <button
            onClick={() => submit("reject")}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
          >
            <XCircle className="w-4 h-4" /> رفض القضية
          </button>
        </div>
      )}
    </div>
  );
}
