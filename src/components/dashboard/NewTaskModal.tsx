"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import NewTaskForm from "./NewTaskForm";

interface Props {
  users: Array<{ id: string; name: string; role: string }>;
  cases: Array<{ id: string; title: string; caseNumber: string }>;
  currentUserId?: string;
  currentUserRole?: string;
}

export default function NewTaskModal({ users, cases, currentUserId, currentUserRole }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-gold flex items-center gap-2 self-start md:self-auto transform hover:scale-[1.03] transition-all duration-300 shadow-gold"
      >
        <Plus className="w-4 h-4" />
        <span className="font-bold text-sm">إسناد مهمة جديدة</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl"
            style={{ background: "#fff" }}
          >
            <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-[#EADFD3]" dir="rtl">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: "#C5A059" }}>العمليات الإدارية</p>
                <h2 className="text-xl font-extrabold text-[#1E293B]">إسناد وتكليف عمل جديد</h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-[#EADFD3] text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8" dir="rtl">
              <NewTaskForm users={users} cases={cases} onSuccess={() => setOpen(false)} currentUserId={currentUserId} currentUserRole={currentUserRole} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
