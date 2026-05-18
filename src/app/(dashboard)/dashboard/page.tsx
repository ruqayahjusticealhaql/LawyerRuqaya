import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Scale, Users, DollarSign, Calendar, TrendingUp, AlertCircle, ArrowLeft, Clock, ChevronLeft, CreditCard, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const isAdmin           = session.role === "MANAGER";
  const isLegalSecretary  = session.role === "LEGAL_SECRETARY";
  const isLawyer          = session.role === "LAWYER";

  // Fetch counts based on role
  const [totalCases, activeCases, totalClients, upcomingAppointments] = await Promise.all([
    (isAdmin || isLawyer) ? prisma.case.count(isLawyer ? { where: { lawyerId: session.id } } : {}) : Promise.resolve(0),
    (isAdmin || isLawyer) ? prisma.case.count({ where: { status: "ACTIVE", ...(isLawyer ? { lawyerId: session.id } : {}) } }) : Promise.resolve(0),
    (isAdmin) ? prisma.client.count() : Promise.resolve(0),
    (isAdmin || isLawyer) ? prisma.appointment.count({ where: { date: { gte: new Date() }, status: "SCHEDULED", ...(isLawyer ? { userId: session.id } : {}) } }) : Promise.resolve(0),
  ]);

  // Mock Financial Data (since we can't touch DB yet)
  const totalRevenue = 95000;
  const pendingPayments = 25000;
  const totalSalaries = 25000;
  const totalPurchases = 19200;

  // Define Stats based on role
  let stats = [];

  if (isAdmin) {
    stats = [
      { href: "/dashboard/cases", value: totalCases, label: "إجمالي القضايا", icon: <Scale className="w-5 h-5" />, bg: "rgba(11, 19, 37, 0.05)", color: "#0B1325" },
      { href: "/dashboard/clients", value: totalClients, label: "إجمالي العملاء", icon: <Users className="w-5 h-5" />, bg: "rgba(11, 19, 37, 0.05)", color: "#0B1325" },
      { href: "/dashboard/finance", value: formatCurrency(totalRevenue), label: "الإيرادات", icon: <DollarSign className="w-5 h-5" />, bg: "rgba(197, 160, 89, 0.1)", color: "var(--gold-500)" },
      { href: "/dashboard/calendar", value: upcomingAppointments, label: "المواعيد", icon: <Calendar className="w-5 h-5" />, bg: "rgba(11, 19, 37, 0.05)", color: "#0B1325" },
    ];
  } else if (isLawyer) {
    stats = [
      { href: "/dashboard/cases", value: totalCases, label: "قضاياي", icon: <Scale className="w-5 h-5" />, bg: "rgba(11, 19, 37, 0.05)", color: "#0B1325" },
      { href: "/dashboard/cases?status=ACTIVE", value: activeCases, label: "القضايا النشطة", icon: <TrendingUp className="w-5 h-5" />, bg: "rgba(52, 211, 153, 0.1)", color: "#10B981" },
      { href: "/dashboard/calendar", value: upcomingAppointments, label: "مواعيدي القادمة", icon: <Calendar className="w-5 h-5" />, bg: "rgba(11, 19, 37, 0.05)", color: "#0B1325" },
    ];
  } else if (isLegalSecretary) {
    stats = [
      { href: "/dashboard/finance", value: formatCurrency(totalRevenue), label: "إجمالي الإيرادات", icon: <DollarSign className="w-5 h-5" />, bg: "rgba(197, 160, 89, 0.1)", color: "var(--gold-500)" },
      { href: "/dashboard/finance", value: formatCurrency(totalSalaries), label: "مسير الرواتب", icon: <CreditCard className="w-5 h-5" />, bg: "rgba(11, 19, 37, 0.05)", color: "#0B1325" },
      { href: "/dashboard/finance", value: formatCurrency(totalPurchases), label: "المشتريات والمصروفات", icon: <ShoppingBag className="w-5 h-5" />, bg: "rgba(11, 19, 37, 0.05)", color: "#0B1325" },
    ];
  } else {
    // Fallback for other roles (Secretary, Trainee)
    stats = [
      { href: "/dashboard/calendar", value: upcomingAppointments, label: "المواعيد", icon: <Calendar className="w-5 h-5" />, bg: "rgba(11, 19, 37, 0.05)", color: "#0B1325" },
    ];
  }

  // Determine grid columns safely
  const gridCols = stats.length === 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : stats.length === 1 ? "lg:grid-cols-1" : "lg:grid-cols-2";

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>لوحة التحكم</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>
            مرحباً، {session.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            {new Intl.DateTimeFormat("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date())}
          </p>
        </div>
        
        {isAdmin && (
          <Link href="/dashboard/cases/new" className="btn-gold hidden sm:inline-flex">
            <Scale className="w-4 h-4" />
            قضية جديدة
          </Link>
        )}
      </div>

      {/* Dynamic Stats Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
        {stats.map((s, idx) => (
          <Link key={idx} href={s.href} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
              <ChevronLeft className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--gold-500)" }} />
            </div>
            <div className="text-2xl font-black mb-1" style={{ color: "var(--navy-200)" }}>{s.value}</div>
            <div className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Main Content Sections (Role Based) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Columns: Cases or Finance */}
        <div className="lg:col-span-2 space-y-6">
          {(isAdmin || isLawyer) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--navy-200)" }}>آخر القضايا المضافة</h2>
                <Link href="/dashboard/cases" className="text-sm font-bold" style={{ color: "var(--gold-600)" }}>عرض الكل</Link>
              </div>
              <p className="text-sm text-slate-400 text-center py-8">لا توجد قضايا حديثة للعرض.</p>
            </div>
          )}

          {(isLegalSecretary) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: "var(--navy-200)" }}>آخر العمليات المالية</h2>
                <Link href="/dashboard/finance" className="text-sm font-bold" style={{ color: "var(--gold-600)" }}>عرض الكل</Link>
              </div>
              <p className="text-sm text-slate-400 text-center py-8">لا توجد عمليات مالية حديثة للعرض.</p>
            </div>
          )}
        </div>

        {/* Right Column: Appointments or Alerts */}
        <div className="space-y-6">
          {(isAdmin || isLawyer) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6" style={{ color: "var(--navy-200)" }}>جلسات اليوم</h2>
              <p className="text-sm text-slate-400 text-center py-8">لا توجد جلسات مجدولة اليوم.</p>
            </div>
          )}

          {(isLegalSecretary) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6" style={{ color: "var(--navy-200)" }}>تنبيهات الاستحقاق</h2>
              <p className="text-sm text-slate-400 text-center py-8">لا توجد تنبيهات دفع معلقة.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
