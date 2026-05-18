import { getSession } from "@/lib/auth";
import { getHomeConfig } from "@/app/actions/cms";
import HomeForm from "./HomeForm";
import { LayoutTemplate, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePageCMS() {
  const session = await getSession();
  if (!session || session.role !== "MANAGER") {
    redirect("/dashboard/cms");
  }

  const config = await getHomeConfig();

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cms" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>المحتوى العام</p>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>نصوص الصفحة الرئيسية</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <LayoutTemplate className="w-6 h-6" style={{ color: "var(--gold-600)" }} />
          <h2 className="text-xl font-bold" style={{ color: "var(--navy-200)" }}>تعديل الأقسام</h2>
        </div>
        
        <HomeForm initialConfig={config} />
      </div>

    </div>
  );
}
