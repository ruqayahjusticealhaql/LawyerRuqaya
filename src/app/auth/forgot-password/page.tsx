"use client";
import { useState } from "react";
import { Scale, Shield, Award, Users, Mail, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح");
      } else {
        setStatus("error");
        setError(data.error || "حدث خطأ ما. يرجى المحاولة مرة أخرى.");
      }
    } catch {
      setStatus("error");
      setError("حدث خطأ في الاتصال بالسيرفر. حاول مرة أخرى.");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#F8FAFC",
    fontSize: "14px",
    fontFamily: "Cairo, sans-serif",
    outline: "none",
    transition: "all 200ms",
  };

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ background: "#0F172A" }}>

      {/* Left Panel — Decorative (Matches Login) */}
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
          <Link href="/" className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #C9975B, #D4A373, #E6B980)",
                boxShadow: "0 4px 20px rgba(212,163,115,0.3)",
              }}
            >
              <Scale className="w-6 h-6" style={{ color: "#1a1000" }} />
            </div>
            <div>
              <div className="font-bold" style={{ color: "#F8FAFC" }}>شركة رقية</div>
              <div className="text-sm font-semibold" style={{ color: "#D4A373" }}>عبدالرحمن للمحاماة</div>
            </div>
          </Link>
        </div>

        {/* Body */}
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight mb-4" style={{ color: "#F8FAFC" }}>
            استعادة الوصول
            <br />
            <span style={{
              background: "linear-gradient(135deg, #C9975B, #D4A373, #E6B980)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>لحسابك الخاص</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: "#4A6080" }}>
            لا داعي للقلق، أدخل بريدك الإلكتروني وسنقوم بإرسال رابط آمن ومباشر لإعادة تعيين كلمة المرور فوراً
          </p>

          <div className="space-y-4">
            {[
              { icon: Scale,  text: "حماية وخصوصية تامة لبياناتك" },
              { icon: Users,  text: "تحديث فوري لجميع الأجهزة النشطة" },
              { icon: Shield, text: "تشفير متطور لحماية كلمات المرور" },
              { icon: Award,  text: "إشعار فوري وتأكيد بعد التغيير" },
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
          © 2026 مكتب المحامية رقية عبدالرحمن
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
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1.5" style={{ color: "#F8FAFC" }}>نسيت كلمة المرور؟</h2>
              <p className="text-sm" style={{ color: "#4A6080" }}>أدخل بريدك الإلكتروني المسجل لإرسال رابط الاستعادة</p>
            </div>

            {status === "success" ? (
              <div className="space-y-6">
                <div
                  className="flex items-start gap-3 rounded-2xl p-4 text-sm"
                  style={{
                    background: "rgba(16,185,129,0.06)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "#A7F3D0",
                  }}
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span className="font-bold block mb-1">تمت العملية بنجاح!</span>
                    <p style={{ color: "#D1FAE5", lineHeight: "1.6" }}>{message}</p>
                  </div>
                </div>

                <Link
                  href="/auth/login"
                  className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #C9975B 0%, #D4A373 50%, #E6B980 100%)",
                    color: "#1a1000",
                    boxShadow: "0 4px 16px rgba(212,163,115,0.3)",
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="label block mb-2" style={{ color: "#94A3B8", fontSize: "14px", fontFamily: "Cairo, sans-serif" }}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@lawoffice.sa"
                    dir="ltr"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(212,163,115,0.5)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(212,163,115,0.1)";
                      e.target.style.background = "rgba(255,255,255,0.06)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.08)";
                      e.target.style.boxShadow = "none";
                      e.target.style.background = "rgba(255,255,255,0.04)";
                    }}
                  />
                </div>

                {/* Error message */}
                {status === "error" && (
                  <div
                    className="flex items-start gap-2.5 rounded-xl p-3.5 text-sm"
                    style={{
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.2)",
                      color: "#FCA5A5",
                    }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: status === "loading"
                      ? "rgba(212,163,115,0.5)"
                      : "linear-gradient(135deg, #C9975B 0%, #D4A373 50%, #E6B980 100%)",
                    color: "#1a1000",
                    boxShadow: status === "loading" ? "none" : "0 4px 16px rgba(212,163,115,0.3)",
                  }}
                >
                  {status === "loading" ? (
                    <>
                      <span className="spinner spinner-sm" style={{ borderColor: "#1a1000", borderTopColor: "transparent" }} />
                      جاري معالجة الطلب...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      إرسال رابط الاستعادة
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <Link
                href="/auth/login"
                className="text-sm transition-colors flex items-center justify-center gap-1.5"
                style={{ color: "#334865" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A373")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#334865")}
              >
                العودة لصفحة تسجيل الدخول
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
