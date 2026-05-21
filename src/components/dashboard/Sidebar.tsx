"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Scale, Users, FileText, DollarSign,
  Calendar, UserCog, Settings, LogOut, ChevronRight, MessageSquare,
  Globe, CalendarDays, CheckSquare
} from "lucide-react";

import { SessionUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";

import { useState } from "react";

type NavItem = { href: string; label: string; icon: React.ReactNode; roles: string[] };

const navItems: NavItem[] = [
  { href: "/dashboard",          label: "الرئيسية",      icon: <LayoutDashboard className="w-[18px] h-[18px]" />, roles: ["MANAGER","LAWYER","LEGAL_SECRETARY"] },
  { href: "/dashboard/cases",    label: "القضايا",       icon: <Scale            className="w-[18px] h-[18px]" />, roles: ["MANAGER","LAWYER","LEGAL_SECRETARY"] },
  { href: "/dashboard/sessions", label: "الجلسات",       icon: <CalendarDays     className="w-[18px] h-[18px]" />, roles: ["MANAGER","LAWYER","LEGAL_SECRETARY"] },
  { href: "/dashboard/tasks",      label: "المهام",        icon: <FileText         className="w-[18px] h-[18px]" />, roles: ["MANAGER","LAWYER","LEGAL_SECRETARY"] },
  { href: "/dashboard/cms",      label: "إدارة المحتوى", icon: <Globe            className="w-[18px] h-[18px]" />, roles: ["MANAGER"] },
  { href: "/dashboard/clients",  label: "العملاء",       icon: <Users            className="w-[18px] h-[18px]" />, roles: ["MANAGER","LAWYER","LEGAL_SECRETARY"] },
  { href: "/dashboard/finance",  label: "الحسابات",      icon: <DollarSign       className="w-[18px] h-[18px]" />, roles: ["MANAGER","LEGAL_SECRETARY","LAWYER"] },
  { href: "/dashboard/calendar", label: "التقويم",       icon: <Calendar         className="w-[18px] h-[18px]" />, roles: ["MANAGER","LAWYER","LEGAL_SECRETARY"] },
  { href: "/dashboard/messages", label: "الرسائل",       icon: <MessageSquare    className="w-[18px] h-[18px]" />, roles: ["MANAGER","LEGAL_SECRETARY"] },
  { href: "/dashboard/staff",    label: "الفريق",        icon: <UserCog          className="w-[18px] h-[18px]" />, roles: ["MANAGER", "LEGAL_SECRETARY"] },
  { href: "/dashboard/settings", label: "الإعدادات",     icon: <Settings         className="w-[18px] h-[18px]" />, roles: ["MANAGER"] },
];

export default function DashboardSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside
      className={`flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? "w-[68px]" : "w-60"}`}
      style={{ background: "#0B1325", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* Logo */}
      <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-center">
          {collapsed ? (
            <img
              src="/images/logo-white.png"
              alt="شركة رقية"
              className="h-8 w-8 object-contain"
            />
          ) : (
            <img
              src="/images/logo-white.png"
              alt="شركة رقية عبدالرحمن للمحاماة"
              className="h-9 object-contain"
              style={{ maxWidth: "130px" }}
            />
          )}

        </div>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm"
              style={{
                background: "rgba(212,163,115,0.15)",
                border: "1px solid rgba(212,163,115,0.25)",
                color: "#D4A373",
              }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold truncate" style={{ color: "#F8FAFC" }}>{user.name}</div>
              <div className="text-xs truncate" style={{ color: "#6B82A0" }}>{ROLE_LABELS[user.role]}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              style={isActive ? {
                background: "linear-gradient(135deg, #C5A059 0%, #D4A373 50%, #E6B980 100%)",
                boxShadow: "0 4px 16px rgba(197, 160, 89, 0.25)",
                color: "#0B1325",
              } : { color: "rgba(255,255,255,0.4)" }}

              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                isActive
                  ? "font-bold"
                  : "hover:bg-white/5"
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-sm font-medium hover:bg-white/5"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          <ChevronRight className={`w-[18px] h-[18px] transition-transform flex-shrink-0 ${collapsed ? "rotate-180" : ""}`} />
          {!collapsed && <span>طيّ القائمة</span>}
        </button>

        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.replace("/");
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-sm font-medium hover:bg-red-500/10"
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FCA5A5")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
