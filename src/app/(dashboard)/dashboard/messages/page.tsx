import { getSession, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDateTime } from "@/lib/utils";
import { MessageSquare, Phone, Mail } from "lucide-react";

export default async function MessagesPage() {
  const session = await getSession();
  if (!hasRole(session, "MANAGER", "LEGAL_SECRETARY")) {
    redirect("/dashboard");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gold-600 font-semibold mb-1">صندوق الوارد</p>
          <h1 className="text-2xl font-bold text-navy-900">رسائل الموقع</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? (
              <span className="text-gold-600 font-semibold">{unreadCount} رسالة غير مقروءة</span>
            ) : (
              `${messages.length} رسالة`
            )}
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="card">
          <div className="empty-state py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <MessageSquare className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="font-bold text-gray-600 mb-2">لا توجد رسائل</h3>
            <p className="text-gray-400 text-sm">ستظهر هنا الرسائل الواردة من الموقع</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`card p-5 transition-all ${!msg.read ? "border-l-4 border-l-gold-400" : ""}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-50 rounded-xl flex items-center justify-center text-navy-700 font-bold flex-shrink-0">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-800">{msg.name}</h3>
                    {msg.subject && (
                      <p className="text-sm text-gold-600 font-medium mt-0.5">{msg.subject}</p>
                    )}
                  </div>
                </div>
                <div className="text-left flex-shrink-0 flex flex-col items-end gap-1">
                  <div className="text-xs text-gray-400">{formatDateTime(msg.createdAt)}</div>
                  {!msg.read && <span className="badge badge-gold">جديد</span>}
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 bg-gray-50 rounded-xl p-3">
                {msg.message}
              </p>

              <div className="flex flex-wrap gap-3 text-sm">
                {msg.phone && (
                  <a
                    href={`tel:${msg.phone}`}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-navy-700 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span dir="ltr" className="text-xs font-mono">{msg.phone}</span>
                  </a>
                )}
                {msg.email && (
                  <a
                    href={`mailto:${msg.email}`}
                    className="flex items-center gap-1.5 text-gray-500 hover:text-navy-700 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-xs">{msg.email}</span>
                  </a>
                )}
                {msg.phone && (
                  <a
                    href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors font-semibold"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                    </svg>
                    <span className="text-xs">واتساب</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
