"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus]   = useState<"idle" | "loading" | "error">("idle");
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    quickSubmit(form.email, form.password);
  };

  const quickSubmit = async (email: string, password: string) => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Email */}
      <div>
        <label className="label">البريد الإلكتروني</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
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

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="label mb-0">كلمة المرور</label>
          <Link
            href="/auth/forgot-password"
            className="text-xs transition-colors hover:underline"
            style={{ color: "#D4A373", fontFamily: "Cairo, sans-serif" }}
          >
            نسيت كلمة المرور؟
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            dir="ltr"
            style={{ ...inputStyle, paddingLeft: "44px" }}
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
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: "#334865" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A373")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#334865")}
          >
            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
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

      {/* Submit */}
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
            جاري الدخول...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            دخول
          </>
        )}
      </button>

    </form>
  );
}

