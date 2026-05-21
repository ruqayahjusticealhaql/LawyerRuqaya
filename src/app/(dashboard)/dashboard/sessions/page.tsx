import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CASE_TYPE_LABELS } from "@/lib/utils";
import { CalendarDays, Phone, ExternalLink, Plus, Clock, CheckCircle2, AlertCircle, List } from "lucide-react";
import Link from "next/link";

const DAY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "الأحد":    { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
  "الاثنين":  { bg: "#FEE2E2", text: "#991B1B", border: "#FECACA" },
  "الثلاثاء": { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0" },
  "الأربعاء": { bg: "#DBEAFE", text: "#1E40AF", border: "#BFDBFE" },
  "الخميس":   { bg: "#EDE9FE", text: "#5B21B6", border: "#DDD6FE" },
  "الجمعة":   { bg: "#FCE7F3", text: "#9D174D", border: "#FBCFE8" },
  "السبت":    { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
};

const ARABIC_DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function getArabicDay(date: Date) {
  return ARABIC_DAYS[date.getDay()];
}

function formatSessionDate(date: Date) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = String(date.getFullYear()).slice(-2);
  return `${d}-${m}-${y}`;
}

function formatSessionTime(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; scope?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const params = await searchParams;
  const showPast = params.view === "past";
  const scope    = params.scope || "all";
  const isMine   = scope === "mine";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessions = await prisma.hearingSession.findMany({
    where: {
      date: showPast ? { lt: today } : { gte: today },
      ...(isMine ? { case: { lawyerId: session.id } } : {}),
    },
    include: {
      case: {
        include: { client: true, lawyer: true },
      },
    },
    orderBy: { date: showPast ? "desc" : "asc" },
  });

  const mySessionsCount = await prisma.hearingSession.count({
    where: { date: { gte: today }, case: { lawyerId: session.id } },
  });

  const totalUpcoming = await prisma.hearingSession.count({ where: { date: { gte: today } } });
  const totalPast     = await prisma.hearingSession.count({ where: { date: { lt: today } } });
  const todaySessions = await prisma.hearingSession.count({
    where: { date: { gte: today, lt: new Date(today.getTime() + 86400000) } },
  });

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#C5A059" }}>المحاكم والمرافعات</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1E293B]">إدارة الجلسات والمرافعات</h1>
          <p className="text-sm mt-1 text-slate-500">متابعة جلسات المحاكم وتنظيم مواعيد المرافعات القانونية</p>
        </div>

        {["MANAGER", "LEGAL_SECRETARY", "LAWYER"].includes(session.role) && (
          <Link
            href="/dashboard/sessions/new"
            className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 hover:opacity-90 shadow-sm"
            style={{ background: "#C5A059", color: "#fff" }}
          >
            <Plus className="w-4 h-4" />
            إضافة جلسة جديدة
          </Link>
        )}
      </div>

      {/* Scope Tabs */}
      <div className="flex gap-2 bg-white border border-[#EADFD3] rounded-2xl p-2 w-fit shadow-sm">
        <Link
          href={`/dashboard/sessions${showPast ? "?view=past" : ""}`}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!isMine ? "bg-[#C5A059] text-white shadow-sm" : "text-slate-500 hover:text-[#1E293B]"}`}
        >
          جلسات المكتب
          <span className={`mr-2 text-[10px] font-black px-1.5 py-0.5 rounded-full ${!isMine ? "bg-white/30 text-white" : "bg-[#C5A059] text-white"}`}>
            {totalUpcoming}
          </span>
        </Link>
        <Link
          href={`/dashboard/sessions?scope=mine${showPast ? "&view=past" : ""}`}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isMine ? "bg-[#C5A059] text-white shadow-sm" : "text-slate-500 hover:text-[#1E293B]"}`}
        >
          جلساتي
          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isMine ? "bg-white/30 text-white" : "bg-[#C5A059] text-white"}`}>
            {mySessionsCount}
          </span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">إجمالي الجلسات القادمة</p>
              <p className="text-3xl font-black text-[#1E293B] mt-1">{totalUpcoming}</p>
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
              <p className="text-xs font-bold text-slate-500">جلسات اليوم</p>
              <p className="text-3xl font-black text-amber-500 mt-1">{todaySessions}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-slate-400">تتطلب تحضيراً فورياً</p>
        </div>

        <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">جلساتي القادمة</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{mySessionsCount}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] font-bold text-emerald-600">أداء شخصي للفريق</p>
          </div>
        </div>

        <div className="bg-white border border-[#EADFD3] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500">الجلسات السابقة</p>
              <p className="text-3xl font-black text-slate-400 mt-1">{totalPast}</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-semibold text-slate-400">سجل المرافعات</p>
        </div>

      </div>

      {/* Past/Upcoming Toggle + Table */}
      <div className="bg-white border border-[#EADFD3] rounded-2xl overflow-hidden shadow-sm">

        {/* Toggle bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EADFD3] bg-[#FAF8F5]">
          <div className="flex border border-[#EADFD3] rounded-xl overflow-hidden p-0.5 bg-white">
            <Link
              href={isMine ? "/dashboard/sessions?scope=mine" : "/dashboard/sessions"}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${!showPast ? "bg-[#C5A059] text-white" : "text-slate-500 hover:text-[#1E293B]"}`}
            >
              القادمة
            </Link>
            <Link
              href={isMine ? "/dashboard/sessions?scope=mine&view=past" : "/dashboard/sessions?view=past"}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${showPast ? "bg-[#C5A059] text-white" : "text-slate-500 hover:text-[#1E293B]"}`}
            >
              السابقة
            </Link>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {sessions.length} جلسة {showPast ? "سابقة" : "قادمة"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EADFD3]">
                {["رقم القضية", "اسم العميل", "اليوم", "تاريخ الجلسة", "الوقت", "نوع القضية", "الملاحظات"].map((h) => (
                  <th key={h} className="px-6 py-4 font-bold text-slate-500 text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADFD3]">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-slate-400 font-semibold">
                    لا توجد جلسات {showPast ? "سابقة" : "قادمة"}
                  </td>
                </tr>
              ) : (
                sessions.map((s) => {
                  const d = new Date(s.date);
                  const dayName = getArabicDay(d);
                  const dayStyle = DAY_COLORS[dayName] || { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };

                  return (
                    <tr key={s.id} className="hover:bg-[#FAF8F5] transition-colors">

                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/cases/${s.case.id}`}
                          className="font-bold text-sm text-[#C5A059] hover:underline"
                        >
                          {s.case.caseNumber}
                        </Link>
                      </td>

                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/clients/${s.case.clientId}`}
                          className="font-bold text-sm text-[#1E293B] hover:text-[#C5A059] transition-colors block"
                        >
                          {s.case.client.name}
                        </Link>
                        {s.case.client.phone && (
                          <a
                            href={`tel:${s.case.client.phone}`}
                            className="flex items-center gap-1 text-xs mt-0.5 text-slate-400 hover:underline"
                          >
                            <Phone className="w-3 h-3" />
                            <span dir="ltr">{s.case.client.phone}</span>
                          </a>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: dayStyle.bg, color: dayStyle.text, border: `1px solid ${dayStyle.border}` }}
                        >
                          {dayName}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-500" dir="ltr">
                        {formatSessionDate(d)}
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-[#1E293B]" dir="ltr">
                        {formatSessionTime(d)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-500">
                          {CASE_TYPE_LABELS[s.case.type] || s.case.type}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs max-w-[220px] text-slate-400">
                        {s.notes ? (
                          s.notes.startsWith("http") ? (
                            <a
                              href={s.notes}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-500 hover:underline truncate"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{s.notes}</span>
                            </a>
                          ) : (
                            <span>{s.notes}</span>
                          )
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {sessions.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between text-xs text-slate-400 border-t border-[#EADFD3] bg-[#FAF8F5]">
            <span>إجمالي الجلسات: {sessions.length}</span>
            <span>العملاء المعنيون: {new Set(sessions.map(s => s.case.clientId)).size}</span>
          </div>
        )}
      </div>
    </div>
  );
}
