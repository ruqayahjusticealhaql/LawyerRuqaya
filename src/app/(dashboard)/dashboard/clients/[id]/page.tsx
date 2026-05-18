import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate, CASE_STATUS_LABELS } from "@/lib/utils";
import { Users, Phone, Mail, MapPin, Scale, FileText, Download, CalendarDays, CreditCard } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getSession();

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      cases: {
        include: {
          lawyer: true,
          sessions: { orderBy: { date: "asc" }, take: 3 },
          documents: { orderBy: { uploadedAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
      },
      contracts: true,
    },
  });

  if (!client) notFound();

  const allDocuments = client.cases.flatMap((c) =>
    c.documents.map((doc) => ({ ...doc, caseName: c.title, caseNumber: c.caseNumber, caseId: c.id }))
  );

  const upcomingSessions = client.cases
    .flatMap((c) =>
      c.sessions
        .filter((s) => new Date(s.date) >= new Date())
        .map((s) => ({ ...s, caseTitle: c.title, caseNumber: c.caseNumber, caseId: c.id }))
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const totalContractValue = client.contracts.reduce((s, c) => s + c.totalAmount, 0);
  const totalPaid = client.contracts.reduce((s, c) => s + c.paidAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm" style={{ color: "#4A6080" }}>
        <Link href="/dashboard/clients" className="hover:text-[#C5A059] transition-colors">العملاء</Link>
        <span>/</span>
        <span style={{ color: "#F1F5F9" }}>{client.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Client Info Card ── */}
        <div className="space-y-4">

          {/* Info Card */}
          <div className="rounded-2xl p-6" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center font-bold text-3xl"
                style={{ background: "linear-gradient(135deg,#C5A059,#D4A373)", color: "#0B1325" }}>
                {client.name.charAt(0)}
              </div>
              <h1 className="text-xl font-bold" style={{ color: "#F1F5F9" }}>{client.name}</h1>
              <p className="text-xs mt-1" style={{ color: "#4A6080" }}>عميل منذ {formatDate(client.createdAt)}</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#C5A059" }} />
                <a href={`tel:${client.phone}`} className="font-semibold hover:underline" style={{ color: "#F1F5F9" }} dir="ltr">
                  {client.phone}
                </a>
              </div>
              {client.email && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "#C5A059" }} />
                  <span style={{ color: "#94A3B8" }}>{client.email}</span>
                </div>
              )}
              {client.address && (
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#C5A059" }} />
                  <span style={{ color: "#94A3B8" }}>{client.address}</span>
                </div>
              )}
              {client.nationalId && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <Scale className="w-4 h-4 flex-shrink-0" style={{ color: "#C5A059" }} />
                  <span style={{ color: "#94A3B8" }} dir="ltr">{client.nationalId}</span>
                </div>
              )}
            </div>

            {client.notes && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-xs mb-1" style={{ color: "#4A6080" }}>ملاحظات</p>
                <p className="text-sm" style={{ color: "#94A3B8" }}>{client.notes}</p>
              </div>
            )}

            {/* Stats */}
            <div className="mt-5 pt-4 grid grid-cols-2 gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="rounded-xl p-3 text-center" style={{ background: "rgba(197,160,89,0.08)", border: "1px solid rgba(197,160,89,0.15)" }}>
                <div className="text-2xl font-bold" style={{ color: "#C5A059" }}>{client.cases.length}</div>
                <div className="text-xs mt-0.5" style={{ color: "#4A6080" }}>قضية</div>
              </div>
              <div className="rounded-xl p-3 text-center" style={{ background: "rgba(74,96,128,0.15)", border: "1px solid rgba(74,96,128,0.2)" }}>
                <div className="text-2xl font-bold" style={{ color: "#F1F5F9" }}>{client.contracts.length}</div>
                <div className="text-xs mt-0.5" style={{ color: "#4A6080" }}>عقد</div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          {client.contracts.length > 0 && (
            <div className="rounded-2xl p-5" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4" style={{ color: "#C5A059" }} />
                <h3 className="font-bold text-sm" style={{ color: "#F1F5F9" }}>الملخص المالي</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "#4A6080" }}>إجمالي العقود</span>
                  <span className="font-bold" style={{ color: "#F1F5F9" }}>{totalContractValue.toLocaleString("ar-SA")} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#4A6080" }}>المدفوع</span>
                  <span className="font-bold" style={{ color: "#34D399" }}>{totalPaid.toLocaleString("ar-SA")} ريال</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "#4A6080" }}>المتبقي</span>
                  <span className="font-bold" style={{ color: "#FCA5A5" }}>{(totalContractValue - totalPaid).toLocaleString("ar-SA")} ريال</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Cases, Sessions, Documents ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Cases */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4" style={{ color: "#C5A059" }} />
                <h2 className="font-bold text-sm" style={{ color: "#F1F5F9" }}>القضايا ({client.cases.length})</h2>
              </div>
              <Link href={`/dashboard/cases/new?clientId=${client.id}`} className="text-xs font-bold hover:underline" style={{ color: "#C5A059" }}>
                + قضية جديدة
              </Link>
            </div>
            {client.cases.length === 0 ? (
              <p className="py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.15)" }}>لا توجد قضايا</p>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {client.cases.map((c) => (
                  <Link key={c.id} href={`/dashboard/cases/${c.id}`}>
                    <div className="px-5 py-3.5 hover:bg-white/5 transition-colors flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm" style={{ color: "#F1F5F9" }}>{c.title}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#4A6080" }}>
                          {c.caseNumber}
                          {c.lawyer && ` · ${c.lawyer.name}`}
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        c.status === "ACTIVE"  ? "bg-emerald-500/10 text-emerald-400" :
                        c.status === "WON"     ? "bg-blue-500/10 text-blue-400" :
                        c.status === "LOST"    ? "bg-red-500/10 text-red-400" :
                        "bg-slate-500/10 text-slate-400"
                      }`}>
                        {CASE_STATUS_LABELS[c.status] || c.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Sessions */}
          {upcomingSessions.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <CalendarDays className="w-4 h-4" style={{ color: "#C5A059" }} />
                <h2 className="font-bold text-sm" style={{ color: "#F1F5F9" }}>الجلسات القادمة</h2>
              </div>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {upcomingSessions.map((s) => {
                  const d = new Date(s.date);
                  return (
                    <Link key={s.id} href={`/dashboard/cases/${s.caseId}`}>
                      <div className="px-5 py-3.5 hover:bg-white/5 transition-colors flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{s.caseTitle}</div>
                          <div className="text-xs mt-0.5" style={{ color: "#4A6080" }}>{s.caseNumber}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold" style={{ color: "#C5A059" }} dir="ltr">
                            {d.getDate()}-{d.getMonth() + 1}-{String(d.getFullYear()).slice(-2)}
                          </div>
                          <div className="text-xs" style={{ color: "#4A6080" }} dir="ltr">
                            {new Intl.DateTimeFormat("ar-SA", { hour: "2-digit", minute: "2-digit", hour12: false }).format(d)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <FileText className="w-4 h-4" style={{ color: "#C5A059" }} />
              <h2 className="font-bold text-sm" style={{ color: "#F1F5F9" }}>
                ملفات العميل ({allDocuments.length})
              </h2>
            </div>
            {allDocuments.length === 0 ? (
              <div className="py-10 text-center">
                <FileText className="w-10 h-10 mx-auto mb-2" style={{ color: "rgba(255,255,255,0.06)" }} />
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.15)" }}>
                  لا توجد ملفات — أضف ملفات من صفحة القضية
                </p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                {allDocuments.map((doc) => (
                  <div key={doc.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(197,160,89,0.1)", border: "1px solid rgba(197,160,89,0.2)" }}>
                        <FileText className="w-4 h-4" style={{ color: "#C5A059" }} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: "#F1F5F9" }}>{doc.name}</div>
                        <div className="text-xs truncate" style={{ color: "#4A6080" }}>
                          {doc.caseName} · {formatDate(doc.uploadedAt)}
                        </div>
                      </div>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 mr-3 hover:bg-white/10 transition-colors"
                      style={{ color: "#C5A059", border: "1px solid rgba(197,160,89,0.2)" }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تحميل</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
