import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, CASE_TYPE_LABELS } from "@/lib/utils";
import { Plus, Scale, Search, Filter, ChevronLeft } from "lucide-react";
import Link from "next/link";

const STATUS_OPTIONS = [
  { label: "الكل", value: "" },
  { label: "نشطة",  value: "ACTIVE" },
  { label: "بانتظار الموافقة", value: "PENDING_APPROVAL" },
  { label: "مغلقة", value: "CLOSED" },
  { label: "مكسوبة",value: "WON" },
  { label: "خاسرة", value: "LOST" },
  { label: "معلقة", value: "SUSPENDED" },
];

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "نشطة", CLOSED: "مغلقة", SUSPENDED: "معلقة", WON: "مكسوبة", LOST: "خاسرة",
  PENDING_APPROVAL: "بانتظار الموافقة",
};

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const params       = await searchParams;
  const statusFilter = params.status || "";
  const search       = params.search || "";

  const cases = await prisma.case.findMany({
    where: {
      ...(session.role === "LAWYER" ? { lawyerId: session.id } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(search ? {
        OR: [
          { title: { contains: search } },
          { caseNumber: { contains: search } },
          { client: { name: { contains: search } } },
        ],
      } : {}),
    },
    include: { client: true, lawyer: true },
    orderBy: { createdAt: "desc" },
  });

  const canCreate = session.role === "MANAGER" || session.role === "LEGAL_SECRETARY" || session.role === "LAWYER";

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>القضايا والملفات</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>إدارة القضايا</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>عرض ومتابعة كافة القضايا في المكتب ({cases.length})</p>
        </div>
        {canCreate && (
          <Link href="/dashboard/cases/new">
            <button className="btn-gold flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-gold">
              <Plus className="w-4 h-4" />
              <span className="font-bold text-sm">إضافة قضية جديدة</span>
            </button>
          </Link>
        )}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
        {/* Search */}
        <form method="GET" className="flex items-center gap-3 flex-1 w-full rounded-xl px-4 py-3 border border-slate-200 focus-within:border-gold-500 transition-colors">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            name="search"
            defaultValue={search}
            placeholder="بحث بالاسم أو رقم القضية..."
            className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder-slate-400"
          />
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
        </form>

        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap justify-center md:justify-end w-full md:w-auto">
          {STATUS_OPTIONS.map((s) => {
            const isActive = statusFilter === s.value;
            return (
              <Link
                key={s.value}
                href={s.value
                  ? `/dashboard/cases?status=${s.value}${search ? `&search=${search}` : ""}`
                  : `/dashboard/cases${search ? `?search=${search}` : ""}`
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gold-500 text-white shadow-gold"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {cases.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto mb-5 border border-slate-100">
              <Scale className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--navy-200)" }}>لا توجد قضايا</h3>
            <p className="text-sm text-slate-400 mb-6">
              {search || statusFilter ? "لا توجد نتائج مطابقة لخيارات البحث" : "ابدأ بإضافة أول قضية للمكتب"}
            </p>
            {canCreate && !search && !statusFilter && (
              <Link href="/dashboard/cases/new" className="btn-gold px-6 py-2.5 inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>إضافة قضية</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50" style={{ borderBottom: "1px solid var(--navy-900)" }}>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">رقم القضية</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">العنوان</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">العميل</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">الحالة</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">الجلسة القادمة</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold" style={{ color: "var(--navy-200)" }}>{c.caseNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-sm" style={{ color: "var(--navy-200)" }}>{c.title}</div>
                      {c.court && <div className="text-xs text-slate-400 mt-0.5">{c.court}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-semibold">{c.client.name}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        c.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600" :
                        c.status === "PENDING_APPROVAL" ? "bg-amber-50 text-amber-700" :
                        c.status === "SUSPENDED" ? "bg-amber-50 text-amber-600" :
                        c.status === "WON" ? "bg-blue-50 text-blue-600" :
                        c.status === "LOST" ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600"
                      }`}>
                        {STATUS_LABEL[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {c.nextSession ? (
                        <span className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--gold-600)" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                          {formatDate(c.nextSession)}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-4 text-left">
                      <Link
                        href={`/dashboard/cases/${c.id}`}
                        className="text-xs font-bold text-slate-400 hover:text-navy-900 flex items-center justify-end gap-1 group"
                      >
                        <span>عرض التفاصيل</span>
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
