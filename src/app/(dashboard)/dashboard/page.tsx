import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  Scale, Users, DollarSign, Calendar, TrendingUp,
  ChevronLeft, FileText, MessageSquare, UserCog,
} from "lucide-react";
import Link from "next/link";
import PendingApprovalsWidget from "@/components/dashboard/PendingApprovalsWidget";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const isManager         = session.role === "MANAGER";
  const isLawyer          = session.role === "LAWYER";
  const isLegalSecretary  = session.role === "LEGAL_SECRETARY";

  // ── Fetch data ───────────────────────────────────────────────────
  const [totalCases, activeCases, totalClients, upcomingAppointments, pendingMessages, upcomingSessions] =
    await Promise.all([
      // القضايا
      isLawyer
        ? prisma.case.count({ where: { lawyerId: session.id } })
        : prisma.case.count(),
      // القضايا النشطة
      isLawyer
        ? prisma.case.count({ where: { status: "ACTIVE", lawyerId: session.id } })
        : prisma.case.count({ where: { status: "ACTIVE" } }),
      // العملاء
      (isManager || isLegalSecretary) ? prisma.client.count() : Promise.resolve(0),
      // المواعيد
      prisma.appointment.count({
        where: {
          date: { gte: new Date() },
          status: "SCHEDULED",
          ...(isLawyer ? { userId: session.id } : {}),
        },
      }),
      // الرسائل غير المقروءة
      (isManager || isLegalSecretary)
        ? prisma.contactMessage.count({ where: { read: false } })
        : Promise.resolve(0),
      // الجلسات القادمة
      prisma.hearingSession.count({
        where: { date: { gte: new Date() } },
      }),
    ]);

  // ── Stats cards ──────────────────────────────────────────────────
  const stats = isManager ? [
    { href: "/dashboard/cases",    value: totalCases,          label: "إجمالي القضايا",   icon: <Scale      className="w-5 h-5" />, color: "#0B1325", bg: "rgba(11,19,37,0.06)" },
    { href: "/dashboard/clients",  value: totalClients,        label: "إجمالي العملاء",   icon: <Users      className="w-5 h-5" />, color: "#0B1325", bg: "rgba(11,19,37,0.06)" },
    { href: "/dashboard/sessions", value: upcomingSessions,    label: "الجلسات القادمة",  icon: <Calendar   className="w-5 h-5" />, color: "#C5A059", bg: "rgba(197,160,89,0.08)" },
    { href: "/dashboard/messages", value: pendingMessages,     label: "رسائل جديدة",      icon: <MessageSquare className="w-5 h-5" />, color: "#0B1325", bg: "rgba(11,19,37,0.06)" },
  ] : isLegalSecretary ? [
    { href: "/dashboard/cases",    value: totalCases,          label: "القضايا",           icon: <Scale      className="w-5 h-5" />, color: "#0B1325", bg: "rgba(11,19,37,0.06)" },
    { href: "/dashboard/clients",  value: totalClients,        label: "العملاء",           icon: <Users      className="w-5 h-5" />, color: "#0B1325", bg: "rgba(11,19,37,0.06)" },
    { href: "/dashboard/sessions", value: upcomingSessions,    label: "الجلسات القادمة",  icon: <Calendar   className="w-5 h-5" />, color: "#C5A059", bg: "rgba(197,160,89,0.08)" },
    { href: "/dashboard/finance",  value: upcomingAppointments + " مواعيد", label: "التقويم",  icon: <DollarSign className="w-5 h-5" />, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
  ] : [
    { href: "/dashboard/cases",    value: totalCases,          label: "قضاياي",            icon: <Scale      className="w-5 h-5" />, color: "#0B1325", bg: "rgba(11,19,37,0.06)" },
    { href: "/dashboard/cases",    value: activeCases,         label: "القضايا النشطة",   icon: <TrendingUp className="w-5 h-5" />, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
    { href: "/dashboard/sessions", value: upcomingSessions,    label: "جلساتي القادمة",   icon: <Calendar   className="w-5 h-5" />, color: "#C5A059", bg: "rgba(197,160,89,0.08)" },
    { href: "/dashboard/calendar", value: upcomingAppointments, label: "مواعيدي",         icon: <Calendar   className="w-5 h-5" />, color: "#0B1325", bg: "rgba(11,19,37,0.06)" },
  ];

  // ── Recent data ──────────────────────────────────────────────────
  const recentCases = (isManager || isLegalSecretary || isLawyer)
    ? await prisma.case.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { client: true, lawyer: true },
        ...(isLawyer ? { where: { lawyerId: session.id } } : {}),
      })
    : [];

  const recentClients = (isManager || isLegalSecretary)
    ? await prisma.client.findMany({ take: 5, orderBy: { createdAt: "desc" } })
    : [];

  // Pending approvals for admins
  const [pendingCases, pendingTasks, allLawyers, allUsers] = (isManager || isLegalSecretary)
    ? await Promise.all([
        prisma.case.findMany({
          where: { status: "PENDING_APPROVAL" },
          include: { createdBy: true, lawyer: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.task.findMany({
          where: { approvalStatus: "PENDING_APPROVAL" },
          include: { createdBy: true, assignedTo: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.findMany({ where: { role: "LAWYER", isActive: true }, select: { id: true, name: true } }),
        prisma.user.findMany({ where: { isActive: true }, select: { id: true, name: true, role: true } }),
      ])
    : [[], [], [], []];

  const gridCols = stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#C5A059" }}>لوحة التحكم</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "#1E293B" }}>
            مرحباً، {session.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {new Intl.DateTimeFormat("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date())}
          </p>
        </div>
        {(isManager || isLegalSecretary) && (
          <div className="flex gap-2">
            <Link href="/dashboard/cases/new" className="btn-primary">
              <Scale className="w-4 h-4" /> قضية جديدة
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
        {stats.map((s, idx) => (
          <Link key={idx} href={s.href}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#C5A059" }} />
            </div>
            <div className="text-2xl font-black mb-1 text-slate-800">{s.value}</div>
            <div className="text-xs font-bold text-slate-400">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Links for Legal Secretary */}
      {isLegalSecretary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href: "/dashboard/cases",    label: "القضايا",    icon: <Scale         className="w-5 h-5" /> },
            { href: "/dashboard/clients",  label: "العملاء",    icon: <Users         className="w-5 h-5" /> },
            { href: "/dashboard/sessions", label: "الجلسات",    icon: <Calendar      className="w-5 h-5" /> },
            { href: "/dashboard/tasks",    label: "المهام",     icon: <FileText      className="w-5 h-5" /> },
            { href: "/dashboard/finance",  label: "الحسابات",   icon: <DollarSign    className="w-5 h-5" /> },
            { href: "/dashboard/messages", label: "الرسائل",    icon: <MessageSquare className="w-5 h-5" /> },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all group text-center"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-amber-50 transition-colors"
                style={{ background: "rgba(197,160,89,0.06)", color: "#C5A059" }}>
                {item.icon}
              </div>
              <span className="text-xs font-bold text-slate-600">{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Pending Approvals (admin only) */}
      {(isManager || isLegalSecretary) && (
        <PendingApprovalsWidget
          pendingCases={pendingCases as any}
          pendingTasks={pendingTasks as any}
          lawyers={allLawyers}
          users={allUsers}
        />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Cases */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800">آخر القضايا</h2>
            <Link href="/dashboard/cases" className="text-sm font-bold" style={{ color: "#C5A059" }}>عرض الكل</Link>
          </div>
          {recentCases.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">لا توجد قضايا بعد</p>
          ) : (
            <div className="space-y-3">
              {recentCases.map(c => (
                <Link key={c.id} href={`/dashboard/cases/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{c.title}</p>
                    <p className="text-xs text-slate-400">{c.client.name} {c.lawyer ? `· ${c.lawyer.name}` : ""}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    c.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    c.status === "WON"    ? "bg-blue-100 text-blue-700" :
                    c.status === "LOST"   ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                  }`}>
                    {c.status === "ACTIVE" ? "نشطة" : c.status === "WON" ? "مكسوبة" : c.status === "LOST" ? "مخسورة" : "مغلقة"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Clients */}
          {(isManager || isLegalSecretary) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">آخر العملاء</h2>
                <Link href="/dashboard/clients" className="text-sm font-bold" style={{ color: "#C5A059" }}>عرض الكل</Link>
              </div>
              {recentClients.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">لا يوجد عملاء بعد</p>
              ) : (
                <div className="space-y-2">
                  {recentClients.map(cl => (
                    <Link key={cl.id} href={`/dashboard/clients/${cl.id}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: "rgba(197,160,89,0.1)", color: "#C5A059" }}>
                        {cl.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{cl.name}</p>
                        <p className="text-xs text-slate-400">{cl.phone}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tasks shortcut for legal secretary */}
          {isLegalSecretary && (
            <Link href="/dashboard/tasks"
              className="block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(197,160,89,0.08)", color: "#C5A059" }}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">إسناد مهمة لمحامي</p>
                  <p className="text-xs text-slate-400">إنشاء وإرسال مهام للفريق</p>
                </div>
                <ChevronLeft className="w-4 h-4 mr-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#C5A059" }} />
              </div>
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
