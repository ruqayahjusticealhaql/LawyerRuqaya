"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Send, CheckCircle2, Circle, Loader2, MessageSquare, GitBranch } from "lucide-react";
import { ROLE_LABELS } from "@/lib/roles";
import { createSubTask, addTaskComment, updateTaskStatus } from "../actions";

interface SubTask { id: string; title: string; status: string; dueDate: string | null; assignedTo: { id: string; name: string } }
interface Comment { id: string; content: string; createdAt: string; user: { id: string; name: string; role: string } }

interface Props {
  task: { id: string; status: string; subTasks: SubTask[]; taskComments: Comment[] };
  users: Array<{ id: string; name: string; role: string }>;
  currentUserId: string;
}

const STATUS_LABEL: Record<string, string> = {
  TODO: "جديدة", IN_PROGRESS: "قيد التنفيذ", REVIEW: "مراجعة", DONE: "مكتملة", COMPLETED: "مكتملة",
};

export default function TaskDetailClient({ task, users, currentUserId }: Props) {
  const router = useRouter();
  const [subTasks, setSubTasks] = useState(task.subTasks);
  const [comments, setComments] = useState(task.taskComments);
  const [status, setStatus] = useState(task.status);

  // Sub-task form
  const [showSubForm, setShowSubForm] = useState(false);
  const [subTitle, setSubTitle] = useState("");
  const [subAssignee, setSubAssignee] = useState(currentUserId);
  const [subDue, setSubDue] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  // Comment form
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // Status change
  const [statusLoading, setStatusLoading] = useState(false);

  async function handleAddSubTask() {
    if (!subTitle.trim()) return;
    setSubLoading(true);
    try {
      const res = await createSubTask(task.id, { title: subTitle, assignedToId: subAssignee, dueDate: subDue || undefined });
      if (res.success) {
        setSubTasks(prev => [...prev, { ...res.subTask, dueDate: res.subTask.dueDate ? String(res.subTask.dueDate) : null, assignedTo: users.find(u => u.id === subAssignee) || { id: subAssignee, name: "" } } as any]);
        setSubTitle(""); setSubDue(""); setShowSubForm(false);
        router.refresh();
      }
    } finally { setSubLoading(false); }
  }

  async function handleToggleSubTask(subId: string, currentStatus: string) {
    const newStatus = (currentStatus === "DONE" || currentStatus === "COMPLETED") ? "TODO" : "DONE";
    await updateTaskStatus(subId, newStatus);
    setSubTasks(prev => prev.map(s => s.id === subId ? { ...s, status: newStatus } : s));
    router.refresh();
  }

  async function handleComment() {
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [...prev, newComment]);
        setComment("");
      }
    } finally { setCommentLoading(false); }
  }

  async function handleStatusChange(newStatus: string) {
    setStatusLoading(true);
    try {
      await updateTaskStatus(task.id, newStatus);
      setStatus(newStatus);
      router.refresh();
    } finally { setStatusLoading(false); }
  }

  return (
    <div className="space-y-6">

      {/* Status change */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">تغيير حالة المهمة</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "TODO", label: "جديدة" },
            { value: "IN_PROGRESS", label: "قيد التنفيذ" },
            { value: "REVIEW", label: "مراجعة" },
            { value: "DONE", label: "مكتملة" },
          ].map(s => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              disabled={statusLoading || status === s.value}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                status === s.value
                  ? "bg-[#0B1325] text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
              } disabled:opacity-50`}
            >
              {statusLoading && status !== s.value ? <Loader2 className="w-3.5 h-3.5 animate-spin inline mr-1" /> : null}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tasks */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-slate-400" />
            <h2 className="text-base font-bold text-slate-800">المهام الفرعية</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
              {subTasks.filter(s => s.status === "DONE" || s.status === "COMPLETED").length}/{subTasks.length}
            </span>
          </div>
          <button
            onClick={() => setShowSubForm(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#C5A059] hover:text-[#b8944d] transition-colors"
          >
            <Plus className="w-4 h-4" /> إضافة مهمة فرعية
          </button>
        </div>

        {showSubForm && (
          <div className="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <input
              type="text"
              placeholder="عنوان المهمة الفرعية *"
              value={subTitle}
              onChange={e => setSubTitle(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-[#C5A059]"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={subAssignee}
                onChange={e => setSubAssignee(e.target.value)}
                className="text-sm rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-[#C5A059] bg-white"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={subDue}
                onChange={e => setSubDue(e.target.value)}
                className="text-sm rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-[#C5A059]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddSubTask}
                disabled={subLoading || !subTitle.trim()}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#b8944d] text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-colors"
              >
                {subLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "إضافة"}
              </button>
              <button
                onClick={() => setShowSubForm(false)}
                className="px-4 py-2 border border-slate-200 text-sm text-slate-500 rounded-lg hover:bg-slate-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        )}

        {subTasks.length === 0 && !showSubForm ? (
          <p className="text-sm text-slate-400 text-center py-4">لا توجد مهام فرعية بعد</p>
        ) : (
          <div className="space-y-2">
            {subTasks.map(sub => {
              const isDone = sub.status === "DONE" || sub.status === "COMPLETED";
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <button onClick={() => handleToggleSubTask(sub.id, sub.status)} className="flex-shrink-0">
                    {isDone
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      : <Circle className="w-5 h-5 text-slate-300" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isDone ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {sub.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {sub.assignedTo.name}
                      {sub.dueDate ? ` · ${new Date(sub.dueDate).toLocaleDateString("ar-SA")}` : ""}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isDone ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>
                    {STATUS_LABEL[sub.status] || sub.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comments / Timeline */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-slate-400" />
          <h2 className="text-base font-bold text-slate-800">التعليقات والتحديثات</h2>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{comments.length}</span>
        </div>

        {comments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">لا توجد تعليقات بعد</p>
        ) : (
          <div className="space-y-4 mb-5">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B1325] to-[#1A253C] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {c.user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-800">{c.user.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString("ar-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add comment */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#b8944d] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            أ
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="أضف تعليقاً أو تحديثاً..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleComment()}
              className="flex-1 text-sm rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:border-[#C5A059] bg-slate-50"
            />
            <button
              onClick={handleComment}
              disabled={commentLoading || !comment.trim()}
              className="w-10 h-10 rounded-xl bg-[#C5A059] hover:bg-[#b8944d] text-white flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              {commentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
