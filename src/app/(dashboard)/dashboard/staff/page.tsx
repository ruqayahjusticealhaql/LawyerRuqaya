import { getSession, hasRole } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Mail, Phone, CheckCircle, XCircle, Scale, Users } from "lucide-react";
import NewStaffModal from "@/components/dashboard/staff/NewStaffModal";
import EditStaffModal from "@/components/dashboard/staff/EditStaffModal";

const ROLE_AVATAR_COLOR: Record<string, string> = {
  MANAGER:         "from-[#0B1325] to-[#1A253C]",
  LAWYER:          "from-blue-700 to-blue-500",
  LEGAL_SECRETARY: "from-amber-600 to-amber-400",
};

const ROLE_BADGE_STYLE: Record<string, { bg: string; text: string }> = {
  MANAGER:         { bg: "rgba(11,19,37,0.08)",   text: "#0B1325" },
  LAWYER:          { bg: "rgba(59,130,246,0.1)",  text: "#1D4ED8" },
  LEGAL_SECRETARY: { bg: "rgba(245,158,11,0.1)",  text: "#92400E" },
};

export default async function StaffPage() {
  const session = await getSession();
  if (!hasRole(session, "MANAGER")) redirect("/dashboard");

  const staff = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { assignedCases: true } } },
  });

  const grouped: Record<string, typeof staff> = {
    MANAGER: [], LAWYER: [], LEGAL_SECRETARY: [],
  };
  for (const m of staff) {
    const key = grouped[m.role] !== undefined ? m.role : "LEGAL_SECRETARY";
    grouped[key].push(m);
  }

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#C5A059" }}>إدارة الأعضاء</p>
          <h1 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>الفريق</h1>
          <p className="text-sm mt-1" style={{ color: "#4A6080" }}>{staff.length} عضو</p>
        </div>
        <NewStaffModal />
      </div>

      {/* Groups */}
      {[
        { key: "MANAGER",         label: "الإدارة" },
        { key: "LAWYER",          label: "المحامون" },
        { key: "LEGAL_SECRETARY", label: "السكرتارية القانونية" },
      ].map(({ key, label }) => {
        const members = grouped[key] || [];
        if (members.length === 0) return null;
        return (
          <div key={key}>
            {/* Group header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-bold" style={{ color: "#C5A059" }}>{label}</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(197,160,89,0.1)", color: "#C5A059" }}>
                {members.length}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => {
                const avatarGrad = ROLE_AVATAR_COLOR[member.role] || "from-gray-600 to-gray-500";
                const badgeStyle = ROLE_BADGE_STYLE[member.role] || { bg: "#F3F4F6", text: "#374151" };
                return (
                  <div
                    key={member.id}
                    className="rounded-2xl p-5 transition-all hover:scale-[1.01]"
                    style={{ background: "#111A2E", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 bg-gradient-to-br ${avatarGrad}`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-base" style={{ color: "#F1F5F9" }}>{member.name}</h3>
                          <span
                            className="text-xs font-semibold px-2.5 py-0.5 rounded-full mt-0.5 inline-block"
                            style={{ background: badgeStyle.bg, color: badgeStyle.text }}
                          >
                            {ROLE_LABELS[member.role] || member.role}
                          </span>
                        </div>
                      </div>

                      {/* Active indicator */}
                      <div className={`flex items-center gap-1 text-xs font-semibold ${member.isActive ? "text-emerald-400" : "text-red-400"}`}>
                        {member.isActive
                          ? <CheckCircle className="w-4 h-4" />
                          : <XCircle className="w-4 h-4" />
                        }
                        <span>{member.isActive ? "نشط" : "معطّل"}</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 text-xs pb-3 mb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2" style={{ color: "#4A6080" }}>
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#C5A059" }} />
                        <span dir="ltr" className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2" style={{ color: "#4A6080" }}>
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#C5A059" }} />
                          <span dir="ltr" className="font-mono">{member.phone}</span>
                        </div>
                      )}
                      {member.role === "LAWYER" && (
                        <div className="flex items-center gap-2" style={{ color: "#4A6080" }}>
                          <Scale className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#C5A059" }} />
                          <span>{member._count.assignedCases} قضية مسندة</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                        منذ {formatDate(member.createdAt)}
                      </span>
                      <EditStaffModal member={member} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {staff.length === 0 && (
        <div className="text-center py-20">
          <Users className="w-12 h-12 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
          <p style={{ color: "rgba(255,255,255,0.2)" }}>لا يوجد أعضاء بعد</p>
        </div>
      )}
    </div>
  );
}
