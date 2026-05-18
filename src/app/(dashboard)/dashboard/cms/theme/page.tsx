import { getSession } from "@/lib/auth";
import { getThemeConfig } from "@/app/actions/cms";
import ThemeForm from "./ThemeForm";
import { Palette, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ThemePage() {
  const session = await getSession();
  if (!session || session.role !== "MANAGER") {
    redirect("/dashboard/cms");
  }

  const theme = await getThemeConfig();

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cms" className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>المظهر العام</p>
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>ألوان الموقع</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6" style={{ color: "var(--gold-600)" }} />
          <h2 className="text-xl font-bold" style={{ color: "var(--navy-200)" }}>تخصيص الهوية البصرية</h2>
        </div>
        
        <ThemeForm initialTheme={theme} />
      </div>

    </div>
  );
}
