"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export default function NewStaffModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", role: "LAWYER",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setOpen(false);
        setForm({ name: "", email: "", password: "", phone: "", role: "LAWYER" });
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "حدث خطأ");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500";

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" /> عضو جديد
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-primary-700 text-xl">إضافة عضو للفريق</h2>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم الكامل *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">البريد الإلكتروني *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">كلمة المرور *</label>
                <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} dir="ltr" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الجوال</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">الدور *</label>
                  <select required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={`${inputClass} bg-white`}>
                    <option value="LAWYER">محامي</option>
                    <option value="LEGAL_SECRETARY">سكرتير قانوني</option>
                    <option value="MANAGER">مدير</option>
                  </select>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
              <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-70">
                  {loading ? "جاري الإضافة..." : "إضافة"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="px-4 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
