"use client";

import React, { useState } from "react";
import {
  CheckCircle2, Clock, AlertCircle, Plus, Search,
  Kanban, List, User, Briefcase, Calendar
} from "lucide-react";
import Link from "next/link";
import { updateTaskStatus } from "@/app/(dashboard)/dashboard/tasks/actions";
import { formatDate } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/roles";

interface TasksRegistryProps {
  initialTasks: any[];
  currentUserId?: string;
  currentUserRole?: string;
  defaultScope?: "ALL" | "MINE";
}

export default function TasksRegistry({ initialTasks, currentUserId, currentUserRole, defaultScope = "ALL" }: TasksRegistryProps) {
  const isAdmin = currentUserRole === "MANAGER" || currentUserRole === "LEGAL_SECRETARY";
  const canEditTask = (task: any) => isAdmin || task.assignedToId === currentUserId;
  const [taskScope, setTaskScope] = useState<"ALL" | "MINE">(defaultScope);
  const [tasks, setTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const STATUS_LABELS: Record<string, string> = {
    TODO: "جديدة",
    CREATED: "جديدة",
    IN_PROGRESS: "قيد التنفيذ",
    REVIEW: "قيد المراجعة",
    DONE: "مكتملة",
    COMPLETED: "مكتملة",
  };

  const PRIORITY_LABELS: Record<string, string> = {
    HIGH: "عالية",
    MEDIUM: "متوسطة",
    LOW: "منخفضة",
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "DONE" || t.status === "COMPLETED").length;
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS" || t.status === "REVIEW").length;
  const delayedTasks = tasks.filter(t => {
    if (t.status === "DONE" || t.status === "COMPLETED") return false;
    return t.dueDate && new Date(t.dueDate) < new Date();
  }).length;

  const scopedTasks = taskScope === "MINE" ? tasks.filter(t => t.assignedToId === currentUserId) : tasks;

  const filteredTasks = scopedTasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.case?.title || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      task.status === statusFilter ||
      (statusFilter === "TODO" && task.status === "CREATED") ||
      (statusFilter === "COMPLETED" && (task.status === "DONE" || task.status === "COMPLETED"));

    const matchesPriority =
      priorityFilter === "ALL" ||
      task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    setActionLoading(taskId);
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      if (result.success) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (e: any) {
      alert(e.message || "فشل تحديث حالة المهمة");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">

      {/* ── SCOPE TABS ── */}
      <div className="flex gap-2 bg-white border border-[#EADFD3] rounded-2xl p-2 w-fit shadow-sm">
        <button
          onClick={() => setTaskScope("ALL")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${taskScope === "ALL" ? "bg-[#C5A059] text-white shadow-sm" : "text-slate-500 hover:text-[#1E293B]"}`}
        >
          مهام المكتب
          <span className="mr-2 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-white/20">
            {tasks.length}
          </span>
        </button>
        <button
          onClick={() => setTaskScope("MINE")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${taskScope === "MINE" ? "bg-[#C5A059] text-white shadow-sm" : "text-slate-500 hover:text-[#1E293B]"}`}
        >
          مهامي
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${taskScope === "MINE" ? "bg-white/30 text-white" : "bg-[#C5A059] text-white"}`}>
            {tasks.filter(t => t.assignedToId === currentUserId).length}
          </span>
        </button>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">إجمالي المهام المجدولة</p>
              <p className="text-3xl font-black text-[#1E293B] mt-1">{totalTasks}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
              <List className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-bold text-[#C5A059]">متابعة وتوجيه كادر المكتب</p>
        </div>

        <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">قيد التنفيذ والمراجعة</p>
              <p className="text-3xl font-black text-amber-500 mt-1">{inProgressTasks}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-slate-400">تتطلب متابعة وإنجاز مستمر</p>
        </div>

        <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">مهام مكتملة بنجاح</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{completedTasks}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] font-bold text-emerald-600">أداء تشغيلي ممتاز للفريق</p>
          </div>
        </div>

        <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">متجاوزة لتاريخ الاستحقاق</p>
              <p className="text-3xl font-black text-red-500 mt-1">{delayedTasks}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <p className="text-[11px] font-bold text-red-500">تحتاج تدخل فوري ومراجعة</p>
          </div>
        </div>

      </div>

      {/* ── SEARCH & FILTER BAR ── */}
      <div className="bg-white border border-[#EADFD3] rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالنشاط، العضو الكادر، أو القضية..."
            className="w-full rounded-xl pr-11 pl-4 py-2.5 text-sm bg-[#FAF8F5] border border-[#EADFD3] text-[#1E293B] placeholder-slate-400 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-bold rounded-xl px-3 py-2.5 bg-[#FAF8F5] border border-[#EADFD3] text-[#1E293B] focus:border-[#C5A059] outline-none"
          >
            <option value="ALL">كل الحالات التشغيلية</option>
            <option value="TODO">جديدة / معلقة</option>
            <option value="IN_PROGRESS">قيد التنفيذ</option>
            <option value="REVIEW">قيد المراجعة</option>
            <option value="COMPLETED">مكتملة</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-bold rounded-xl px-3 py-2.5 bg-[#FAF8F5] border border-[#EADFD3] text-[#1E293B] focus:border-[#C5A059] outline-none"
          >
            <option value="ALL">كل مستويات الأولوية</option>
            <option value="HIGH">أولوية عاجلة</option>
            <option value="MEDIUM">أولوية متوسطة</option>
            <option value="LOW">أولوية منخفضة</option>
          </select>

          <div className="flex border border-[#EADFD3] rounded-xl overflow-hidden p-0.5 bg-[#FAF8F5]">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#C5A059] text-white" : "text-slate-400 hover:text-[#1E293B]"}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`p-2 rounded-lg transition-all ${viewMode === "board" ? "bg-[#C5A059] text-white" : "text-slate-400 hover:text-[#1E293B]"}`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* ── LIST VIEW ── */}
      {viewMode === "list" ? (
        <div className="bg-white border border-[#EADFD3] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EADFD3]">
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs">اسم المهمة والنشاط القانوني</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs">العضو المسند إليه</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs">الأولوية</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs">الحالة</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs text-center">مسار الإنجاز</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs">تاريخ التسليم</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-xs text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EADFD3]">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400 font-semibold">
                      لا توجد مهام مطابقة لخيارات البحث والفرز المحددة.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const statusIndex = ["TODO", "CREATED", "IN_PROGRESS", "REVIEW", "DONE", "COMPLETED"].indexOf(task.status);
                    const progressStep = statusIndex >= 4 ? 4 : statusIndex >= 3 ? 3 : statusIndex >= 2 ? 2 : 1;

                    const priorityClasses: Record<string, string> = {
                      HIGH: "text-red-600 bg-red-50 border border-red-200",
                      MEDIUM: "text-amber-600 bg-amber-50 border border-amber-200",
                      LOW: "text-emerald-600 bg-emerald-50 border border-emerald-200",
                    };

                    const statusClasses: Record<string, string> = {
                      TODO: "text-slate-600 bg-slate-100 border border-slate-200",
                      CREATED: "text-slate-600 bg-slate-100 border border-slate-200",
                      IN_PROGRESS: "text-amber-600 bg-amber-50 border border-amber-200",
                      REVIEW: "text-purple-600 bg-purple-50 border border-purple-200",
                      DONE: "text-emerald-600 bg-emerald-50 border border-emerald-200",
                      COMPLETED: "text-emerald-600 bg-emerald-50 border border-emerald-200",
                    };

                    return (
                      <tr key={task.id} className="hover:bg-[#FAF8F5] transition-colors cursor-pointer" onClick={() => window.location.href = `/dashboard/tasks/${task.id}`}>

                        <td className="px-6 py-5">
                          <Link href={`/dashboard/tasks/${task.id}`} onClick={e => e.stopPropagation()} className="font-bold text-[#1E293B] text-sm hover:text-[#C5A059] transition-colors">{task.title}</Link>
                          {task.description && (
                            <p className="text-xs text-slate-400 mt-1 max-w-sm truncate">{task.description}</p>
                          )}
                          {task.case && (
                            <div className="text-[11px] font-bold mt-2 flex items-center gap-1.5 text-[#C5A059] bg-[#FDF8F0] px-2.5 py-0.5 rounded-full w-fit border border-[#EADFD3]">
                              <Briefcase className="w-3 h-3" />
                              <span>قضية: {task.case.title} ({task.case.caseNumber})</span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#FDF8F0] border border-[#EADFD3] flex items-center justify-center font-bold text-sm text-[#C5A059]">
                              {task.assignedTo.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-[#1E293B] text-sm">{task.assignedTo.name}</div>
                              <div className="text-[10px] text-[#C5A059] font-semibold">{ROLE_LABELS[task.assignedTo.role] || task.assignedTo.role}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${priorityClasses[task.priority] || ""}`}>
                            {PRIORITY_LABELS[task.priority] || task.priority}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusClasses[task.status] || ""}`}>
                            {STATUS_LABELS[task.status] || task.status}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5 justify-center" dir="rtl">
                            <span className="text-[10px] text-slate-400 font-bold ml-1">تم الإنشاء</span>
                            <div className={`w-2.5 h-2.5 rounded-full ${progressStep >= 1 ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <div className={`w-8 h-0.5 ${progressStep >= 2 ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <div className={`w-2.5 h-2.5 rounded-full ${progressStep >= 2 ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <div className={`w-8 h-0.5 ${progressStep >= 3 ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <div className={`w-2.5 h-2.5 rounded-full ${progressStep >= 3 ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <div className={`w-8 h-0.5 ${progressStep >= 4 ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <div className={`w-2.5 h-2.5 rounded-full ${progressStep >= 4 ? "bg-emerald-500" : "bg-slate-200"}`} />
                            <span className="text-[10px] text-slate-400 font-bold mr-1">مكتمل</span>
                          </div>
                        </td>

                        <td className="px-6 py-5 font-semibold text-[#1E293B] text-sm">
                          {task.dueDate ? formatDate(task.dueDate) : <span className="text-slate-400">معلق</span>}
                        </td>

                        <td className="px-6 py-5 text-left">
                          {task.status !== "DONE" && task.status !== "COMPLETED" ? (
                            canEditTask(task) ? (
                              <button
                                onClick={() => handleUpdateStatus(task.id, "DONE")}
                                disabled={actionLoading === task.id}
                                className="text-xs font-bold text-white bg-[#C5A059] hover:bg-[#b8944d] px-3.5 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                              >
                                {actionLoading === task.id ? "إغلاق..." : "إغلاق المهمة"}
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50">قراءة فقط</span>
                            )
                          ) : (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              مكتملة
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (

        /* ── KANBAN BOARD ── */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADFD3]">
              <span className="text-sm font-bold text-[#1E293B]">جديدة / معلقة</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredTasks.filter(t => t.status === "TODO" || t.status === "CREATED").length}
              </span>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredTasks.filter(t => t.status === "TODO" || t.status === "CREATED").map(t => (
                <BoardCard key={t.id} task={t} onUpdateStatus={handleUpdateStatus} actionLoading={actionLoading} />
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADFD3]">
              <span className="text-sm font-bold text-amber-600">قيد التنفيذ والمراجعة</span>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                {filteredTasks.filter(t => t.status === "IN_PROGRESS" || t.status === "REVIEW").length}
              </span>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredTasks.filter(t => t.status === "IN_PROGRESS" || t.status === "REVIEW").map(t => (
                <BoardCard key={t.id} task={t} onUpdateStatus={handleUpdateStatus} actionLoading={actionLoading} />
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EADFD3]">
              <span className="text-sm font-bold text-emerald-600">مكتملة السداد والإغلاق</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {filteredTasks.filter(t => t.status === "DONE" || t.status === "COMPLETED").length}
              </span>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredTasks.filter(t => t.status === "DONE" || t.status === "COMPLETED").map(t => (
                <BoardCard key={t.id} task={t} onUpdateStatus={handleUpdateStatus} actionLoading={actionLoading} />
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

function BoardCard({ task, onUpdateStatus, actionLoading }: { task: any; onUpdateStatus: any; actionLoading: string | null }) {
  const PRIORITY_LABELS: Record<string, string> = {
    HIGH: "عالية",
    MEDIUM: "متوسطة",
    LOW: "منخفضة",
  };

  return (
    <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EADFD3] hover:border-[#C5A059]/40 hover:shadow-sm transition-all space-y-3">
      <div className="flex justify-between items-start gap-2">
        <Link href={`/dashboard/tasks/${task.id}`} className="text-sm font-bold text-[#1E293B] leading-snug hover:text-[#C5A059] transition-colors">{task.title}</Link>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
          task.priority === "HIGH" ? "bg-red-50 text-red-600 border border-red-200" :
          task.priority === "MEDIUM" ? "bg-amber-50 text-amber-600 border border-amber-200" :
          "bg-emerald-50 text-emerald-600 border border-emerald-200"
        }`}>
          {PRIORITY_LABELS[task.priority] || task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
      )}

      {task.case && (
        <div className="text-[10px] font-semibold text-[#C5A059] bg-[#FDF8F0] px-2 py-0.5 rounded border border-[#EADFD3] w-fit">
          قضية: {task.case.title}
        </div>
      )}

      <div className="pt-2 border-t border-[#EADFD3] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <User className="w-3.5 h-3.5 text-[#C5A059]" />
          <span className="font-bold text-[11px]">{task.assignedTo.name}</span>
        </div>
        {task.dueDate && (
          <div className="text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 pt-1">
        {task.status !== "DONE" && task.status !== "COMPLETED" ? (
          <>
            {task.status === "TODO" && (
              <button
                onClick={() => onUpdateStatus(task.id, "IN_PROGRESS")}
                disabled={actionLoading === task.id}
                className="w-full text-[10px] py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition-all"
              >
                بدء العمل
              </button>
            )}
            {task.status === "IN_PROGRESS" && (
              <button
                onClick={() => onUpdateStatus(task.id, "REVIEW")}
                disabled={actionLoading === task.id}
                className="w-full text-[10px] py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold rounded-lg transition-all"
              >
                طلب مراجعة
              </button>
            )}
            <button
              onClick={() => onUpdateStatus(task.id, "DONE")}
              disabled={actionLoading === task.id}
              className="w-full text-[10px] py-1.5 bg-[#C5A059] hover:bg-[#b8944d] text-white font-black rounded-lg transition-all"
            >
              {actionLoading === task.id ? "إغلاق..." : "إغلاق"}
            </button>
          </>
        ) : (
          <div className="w-full text-[10px] py-1.5 bg-emerald-50 text-emerald-600 font-bold rounded-lg text-center border border-emerald-200">
            مكتملة ومغلقة
          </div>
        )}
      </div>
    </div>
  );
}
