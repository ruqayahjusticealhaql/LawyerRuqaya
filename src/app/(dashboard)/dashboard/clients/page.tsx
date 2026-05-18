import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Users, Plus, Phone, Scale, Mail, Calendar } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY", "LAWYER")) redirect("/dashboard");

  const clients = await prisma.client.findMany({
    include: { _count: { select: { cases: true } } },
    orderBy: { createdAt: "desc" },
  });

  const canCreate = hasRole(session, "MANAGER", "SECRETARY");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#D4A373" }}>إدارة العملاء</p>
          <h1 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>العملاء</h1>
          <p className="text-sm mt-1" style={{ color: "#4A6080" }}>{clients.length} عميل مسجّل</p>
        </div>
        {canCreate && (
          <Link href="/dashboard/clients/new" className="btn-gold">
            <Plus className="w-4 h-4" />
            عميل جديد
          </Link>
        )}
      </div>

      {clients.length === 0 ? (
        <div className="card">
          <div className="empty-state py-24">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <Users className="w-10 h-10" style={{ color: "#2A3A52" }} />
            </div>
            <h3 className="font-bold mb-2" style={{ color: "#6B82A0" }}>لا يوجد عملاء بعد</h3>
            <p className="text-sm mb-6" style={{ color: "#334865" }}>ابدأ بإضافة أول عميل للمكتب</p>
            {canCreate && (
              <Link href="/dashboard/clients/new" className="btn-gold">
                <Plus className="w-4 h-4" />
                إضافة عميل
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
              <div className="card p-5 cursor-pointer group hover:-translate-y-1 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #C9975B, #D4A373)",
                        color: "#1a1000",
                        boxShadow: "0 4px 12px rgba(212,163,115,0.2)",
                      }}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold transition-colors" style={{ color: "#F8FAFC" }}>{client.name}</h3>
                      <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "#334865" }}>
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(client.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`badge ${client._count.cases > 0 ? "badge-navy" : "badge-gray"}`}>
                    {client._count.cases} قضية
                  </span>
                </div>

                <div className="space-y-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#D4A373" }} />
                    <span dir="ltr" className="font-mono text-xs" style={{ color: "#6B82A0" }}>{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#D4A373" }} />
                      <span className="truncate text-xs" style={{ color: "#6B82A0" }}>{client.email}</span>
                    </div>
                  )}
                  {client.nationalId && (
                    <div className="flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#2A3A52" }} />
                      <span dir="ltr" className="font-mono text-xs" style={{ color: "#334865" }}>{client.nationalId}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
