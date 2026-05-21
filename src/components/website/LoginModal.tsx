"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, AlertCircle, X } from "lucide-react";

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة");
        setStatus("error");
      }
    } catch {
      setError("حدث خطأ في الاتصال. حاول مرة أخرى.");
      setStatus("error");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#F8FAFC",
    fontSize: "14px",
    outline: "none",
    transition: "all 200ms",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8"
        dir="rtl"
        style={{
          background: "linear-gradient(145deg, #0F172A, #1E293B)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full transition-all"
          style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="شركة رقية" className="h-16 w-auto object-contain mx-auto mb-3" />
          <h2 className="text-xl font-bold" style={{ color: "#F8FAFC" }}>تسجيل الدخول</h2>
          <p className="text-sm mt-1" style={{ color: "#4A6080" }}>سجّل دخولك للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="example@lawoffice.sa"
              dir="ltr"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(212,163,115,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,163,115,0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>كلمة المرور</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                dir="ltr"
                style={{ ...inputStyle, paddingLeft: "44px" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(212,163,115,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,163,115,0.1)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#4A6080" }}
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl p-3 text-sm" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#FCA5A5" }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
            style={{
              background: "linear-gradient(135deg, #C9975B 0%, #D4A373 50%, #E6B980 100%)",
              color: "#1a1000",
              boxShadow: "0 4px 16px rgba(212,163,115,0.3)",
            }}
          >
            {status === "loading" ? "جاري الدخول..." : <><LogIn className="w-4 h-4" />دخول</>}
          </button>
        </form>
      </div>
    </div>
  );
}
