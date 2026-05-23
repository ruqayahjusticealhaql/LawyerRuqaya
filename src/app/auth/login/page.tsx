"use client";
import LoginForm from "@/components/auth/LoginForm";
import { Scale, Shield, Award, Users } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex" dir="rtl" style={{ background: "#0F172A" }}>

      {/* Left Panel — Decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #070D18 0%, #0F172A 50%, #111827 100%)" }}
      >
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ background: "#D4A373" }} />
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ background: "#4A6080" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ border: "1px solid rgba(212,163,115,0.06)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full" style={{ border: "1px solid rgba(255,255,255,0.03)" }} />
        </div>

        {/* Logo */}
        <div className="relative">
          <Link href="/">
            <img src="/images/logo.png" alt="مكتب المحامية رقية عبدالرحمن للمحاماة" className="h-20 w-auto object-contain" />
          </Link>
        </div>

        {/* Body */}
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#F8FAFC" }}>
            إدارة شركتك
            <br />
            <span style={{
              background: "linear-gradient(135deg, #C9975B, #D4A373, #E6B980)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>بكفاءة عالية</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "#4A6080" }}>
            نظام متكامل لإدارة القضايا والعملاء والحسابات المالية
          </p>

          <div className="space-y-4">
            {[
              { icon: Scale,  text: "إدارة القضايا وسجل الجلسات" },
              { icon: Users,  text: "ملفات العملاء والتواصل" },
              { icon: Shield, text: "الحسابات المالية والفواتير" },
              { icon: Award,  text: "تقارير وإحصائيات شاملة" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(212,163,115,0.08)", border: "1px solid rgba(212,163,115,0.12)" }}
                >
                  <item.icon className="w-4 h-4" style={{ color: "#D4A373" }} />
                </div>
                <span className="text-sm" style={{ color: "#6B82A0" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative text-sm" style={{ color: "#2A3A52" }}>
          © 2025 مكتب المحامية رقية عبدالرحمن
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#0F172A" }}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
              style={{
                background: "linear-gradient(135deg, #C9975B, #D4A373, #E6B980)",
                boxShadow: "0 4px 20px rgba(212,163,115,0.3)",
              }}
            >
              <Scale className="w-7 h-7" style={{ color: "#1a1000" }} />
            </div>
            <h1 className="font-bold text-xl" style={{ color: "#F8FAFC" }}>مكتب المحامية رقية عبدالرحمن</h1>
          </div>

          {/* Card */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: "#1E293B",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1" style={{ color: "#F8FAFC" }}>مرحباً بك 👋</h2>
              <p className="text-sm" style={{ color: "#4A6080" }}>سجّل دخولك للوصول إلى لوحة التحكم</p>
            </div>

            <LoginForm />

            <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Link
                href="/"
                className="text-sm transition-colors"
                style={{ color: "#334865" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A373")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#334865")}
              >
                ← العودة للموقع الرئيسي
              </Link>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
