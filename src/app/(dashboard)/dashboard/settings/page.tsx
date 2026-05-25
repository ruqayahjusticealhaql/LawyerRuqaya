import { getSession, hasRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Database, Lock, Globe, CheckCircle, ExternalLink, AlertTriangle } from "lucide-react";
import { getSettings } from "@/lib/cms";

export default async function SettingsPage() {
  const session = await getSession();
  if (!hasRole(session, "MANAGER")) redirect("/dashboard");

  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div>
        <p className="text-sm font-semibold mb-1" style={{ color: "#D4A373" }}>النظام</p>
        <h1 className="text-2xl font-bold" style={{ color: "#F8FAFC" }}>الإعدادات</h1>
        <p className="text-sm mt-1" style={{ color: "#4A6080" }}>إعدادات النظام والشركة</p>
      </div>

      {[
        {
          icon: Globe,
          iconBg: "rgba(74,96,128,0.15)",
          iconColor: "#8FA3BF",
          title: "معلومات الشركة",
          content: (
            <div className="space-y-3">
              {[
                { label: "اسم الشركة",        value: settings.siteName },
                { label: "رقم الهاتف",         value: settings.phone },
                { label: "البريد الإلكتروني",  value: settings.email },
                { label: "العنوان",            value: settings.address },
                { label: "رقم واتساب",         value: settings.whatsapp },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-sm" style={{ color: "#4A6080" }}>{item.label}</span>
                  <span className="text-sm font-semibold" style={{ color: "#CBD5E1" }}>{item.value}</span>
                </div>
              ))}
              <p className="text-xs p-3 rounded-xl mt-2" style={{ background: "rgba(255,255,255,0.03)", color: "#334865" }}>
                لتعديل هذه المعلومات، يرجى تعديل ملفات المشروع مباشرة
              </p>
            </div>
          ),
        },
        {
          icon: Database,
          iconBg: "rgba(52,211,153,0.1)",
          iconColor: "#34D399",
          title: "قاعدة البيانات",
          content: (
            <div>
              <div className="space-y-2 mb-5">
                {[
                  { label: "النوع",    value: "SQLite (محلية)" },
                  { label: "الموقع",   value: "./prisma/dev.db", mono: true },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-sm" style={{ color: "#4A6080" }}>{r.label}</span>
                    {r.mono
                      ? <code className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: "rgba(255,255,255,0.06)", color: "#D4A373" }}>{r.value}</code>
                      : <span className="text-sm font-semibold" style={{ color: "#CBD5E1" }}>{r.value}</span>
                    }
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 rounded-xl p-3 mb-4" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#FCD34D" }} />
                <p className="text-xs" style={{ color: "#FCD34D" }}>للنسخ الاحتياطي: انسخ ملف dev.db بانتظام</p>
              </div>
              <a href="http://localhost:5555" target="_blank" className="btn-outline text-sm inline-flex">
                <ExternalLink className="w-4 h-4" />
                فتح Prisma Studio
              </a>
            </div>
          ),
        },
        {
          icon: Lock,
          iconBg: "rgba(96,165,250,0.1)",
          iconColor: "#60A5FA",
          title: "الأمان",
          content: (
            <div className="space-y-3">
              {[
                "تسجيل الدخول بالبريد وكلمة المرور",
                "تشفير كلمات المرور (bcrypt)",
                "جلسات آمنة (HTTP-only cookies)",
                "صلاحيات مبنية على الأدوار (RBAC)",
                "انتهاء صلاحية الجلسة بعد 7 أيام",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#34D399" }} />
                  <span className="text-sm" style={{ color: "#94A3B8" }}>{item}</span>
                </div>
              ))}
            </div>
          ),
        },
      ].map((section) => (
        <div key={section.title} className="card p-6">
          <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: section.iconBg }}>
              <section.icon className="w-4 h-4" style={{ color: section.iconColor }} />
            </div>
            <h2 className="font-bold" style={{ color: "#F8FAFC" }}>{section.title}</h2>
          </div>
          {section.content}
        </div>
      ))}
    </div>
  );
}
