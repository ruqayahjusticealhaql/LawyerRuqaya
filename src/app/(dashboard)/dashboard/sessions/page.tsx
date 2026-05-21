import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CASE_TYPE_LABELS } from "@/lib/utils";
import { CalendarDays, Phone, ExternalLink, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
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

  // Group sessions by date label
  const groupedByDate: Record<string, typeof sessions> = {};
  for (const s of sessions) {
    const label = formatSessionDate(new Date(s.date));
    if (!groupedByDate[label]) groupedByDate[label] = [];
    groupedByDate[label].push(s);
  }

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#C5A059" }}>المحاكم والمرافعات</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#F8FAFC" }}>إدارة الجلسات والمرافعات</h1>
          <p className="text-sm mt-1" style={{ color: "#4A6080" }}>متابعة جلسات المحاكم وتنظيم مواعيد المرافعات القانونية</p>
        </div>

        {/* Scope Tabs */}
        <div className="flex gap-2">
          <Link
            href={`/dashboard/sessions${showPast ? "?view=past" : ""}`}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${!isMine ? "text-white shadow-sm" : "border border-white/10 hover:border-[#C5A059]"}`}
            style={!isMine ? { background: "linear-gradient(135deg,#C5A059,#D4A373)", color: "#0B1325" } : { color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.05)" }}
          >
            جلسات المكتب
          </Link>
          <Link
            href={`/dashboard/sessions?scope=mine${showPast ? "&view=past" : ""}`}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${isMine ? "text-white shadow-sm" : "border border-white/10 hover:border-[#C5A059]"}`}
            style={isMine ? { background: "linear-gradient(135deg,#C5A059,#D4A373)", color: "#0B1325" } : { color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.05)" }}
          >
            جلساتي
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isMine ? "bg-black/20 text-[#0B1325]" : "bg-white/15 text-white"}`}>{mySessionsCount}</span>
          </Link>
        </div>

        {/* Action Buttons & Toggle past/upcoming */}
        <div className="flex flex-wrap items-center gap-3">
          {["MANAGER", "LEGAL_SECRETARY", "LAWYER"].includes(session.role) && (
            <Link
              href="/dashboard/sessions/new"
              className="px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 transform hover:scale-105"
              style={{ background: "linear-gradient(135deg,#C5A059,#D4A373)", color: "#0B1325", boxShadow: "0 4px 16px rgba(197, 160, 89, 0.2)" }}
            >
              <Plus className="w-4 h-4" />
              إضافة جلسة جديدة
            </Link>
          )}

          <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/10">
            <Link
              href="/dashboard/sessions"
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
              style={!showPast
                ? { background: "rgba(255,255,255,0.15)", color: "#F8FAFC" }
                : { color: "#94A3B8", background: "rgba(255,255,255,0.03)" }
              }
            >
              القادمة
            </Link>
            <Link
              href="/dashboard/sessions?view=past"
              className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
              style={showPast
                ? { background: "rgba(255,255,255,0.15)", color: "#F8FAFC" }
                : { color: "#94A3B8", background: "rgba(255,255,255,0.03)" }
              }
            >
              السابقة
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الجلسات القادمة", value: totalUpcoming, icon: <CalendarDays className="w-5 h-5" />, note: "متابعة وإنجاز مستمر", color: "#C5A059", bg: "rgba(197,160,89,0.08)", border: "rgba(197,160,89,0.2)" },
          { label: "جلسات اليوم",             value: todaySessions, icon: <Clock className="w-5 h-5" />,        note: "تحتاج تحضير فوري",  color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
          { label: "جلساتي القادمة",          value: mySessionsCount, icon: <CheckCircle className="w-5 h-5" />,  note: "أداء شخصي للفريق",  color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
          { label: "الجلسات السابقة",         value: totalPast,     icon: <AlertCircle className="w-5 h-5" />,  note: "سجل المرافعات",     color: "#64748B", bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl p-5" style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg, color: stat.color, border: `1px solid ${stat.border}` }}>
                {stat.icon}
              </div>
              <span className="text-3xl font-extrabold" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <p className="text-sm font-bold" style={{ color: "#F8FAFC" }}>{stat.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#4A6080" }}>• {stat.note}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-2xl overflow-hidden shadow-lg" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse" style={{ background: "#111A2E" }}>

            {/* Table Head */}
            <thead>
              <tr style={{ background: "#0B1325", borderBottom: "2px solid #C5A059" }}>
                {["رقم القضية", "اسم العميل", "اليوم", "تاريخ الجلسة", "الوقت", "نوع القضية", "الملاحظات"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-bold tracking-wide"
                    style={{ color: "#C5A059" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <CalendarDays className="w-12 h-12 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                      لا توجد جلسات {showPast ? "سابقة" : "قادمة"}
                    </p>
                  </td>
                </tr>
              ) : (
                sessions.map((s, idx) => {
                  const d = new Date(s.date);
                  const dayName = getArabicDay(d);
                  const dayStyle = DAY_COLORS[dayName] || { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" };
                  const isOdd = idx % 2 !== 0;

                  return (
                    <tr
                      key={s.id}
                      style={{
                        background: isOdd ? "rgba(255,255,255,0.02)" : "transparent",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      {/* Case Number */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/cases/${s.case.id}`}
                          className="font-bold text-sm transition-colors hover:underline"
                          style={{ color: "#C5A059" }}
                        >
                          {s.case.caseNumber}
                        </Link>
                      </td>

                      {/* Client */}
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/clients/${s.case.clientId}`}
                          className="font-semibold text-sm transition-colors hover:underline block"
                          style={{ color: "#F1F5F9" }}
                        >
                          {s.case.client.name}
                        </Link>
                        {s.case.client.phone && (
                          <a
                            href={`tel:${s.case.client.phone}`}
                            className="flex items-center gap-1 text-xs mt-0.5 hover:underline"
                            style={{ color: "#64748B" }}
                          >
                            <Phone className="w-3 h-3" />
                            <span dir="ltr">{s.case.client.phone}</span>
                          </a>
                        )}
                      </td>

                      {/* Day */}
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: dayStyle.bg,
                            color: dayStyle.text,
                            border: `1px solid ${dayStyle.border}`,
                          }}
                        >
                          {dayName}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: "#94A3B8" }} dir="ltr">
                        {formatSessionDate(d)}
                      </td>

                      {/* Time */}
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: "#F1F5F9" }} dir="ltr">
                        {formatSessionTime(d)}
                      </td>

                      {/* Case Type */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold" style={{ color: "#94A3B8" }}>
                          {CASE_TYPE_LABELS[s.case.type] || s.case.type}
                        </span>
                      </td>

                      {/* Notes */}
                      <td className="px-4 py-3 text-xs max-w-[220px]" style={{ color: "#64748B" }}>
                        {s.notes ? (
                          s.notes.startsWith("http") ? (
                            <a
                              href={s.notes}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-400 hover:underline truncate"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{s.notes}</span>
                            </a>
                          ) : (
                            <span>{s.notes}</span>
                          )
                        ) : (
                          <span style={{ color: "rgba(255,255,255,0.1)" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        {sessions.length > 0 && (
          <div
            className="px-6 py-3 flex items-center justify-between text-xs"
            style={{ background: "#0B1325", borderTop: "1px solid rgba(255,255,255,0.05)", color: "#4A6080" }}
          >
            <span>إجمالي الجلسات: {sessions.length}</span>
            <span>
              العملاء المعنيون: {new Set(sessions.map(s => s.case.clientId)).size}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
