"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, X, Eye, EyeOff, Save } from "lucide-react";

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
};

export default function EditStaffModal({ member }: { member: StaffMember }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name:     member.name,
    phone:    member.phone || "",
    password: "",
    isActive: member.isActive,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload: Record<string, unknown> = {
      name:     form.name,
      phone:    form.phone,
      isActive: form.isActive,
    };
    if (form.password) payload.password = form.password;

    try {
      const res = await fetch(`/api/staff/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setOpen(false);
        setForm({ ...form, password: "" });
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "حدث خطأ");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:bg-amber-50 text-amber-600 border border-amber-100"
      >
        <Pencil className="w-3.5 h-3.5" />
        تعديل
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">تعديل الحساب</h2>
                <p className="text-xs text-gray-400 mt-0.5" dir="ltr">{member.email}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">رقم الجوال</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                  dir="ltr"
                  placeholder="05xxxxxxxx"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  كلمة مرور جديدة
                  <span className="text-xs font-normal text-gray-400 mr-1">(اتركها فارغة إن لم ترد التغيير)</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`${inputClass} pl-10`}
                    dir="ltr"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-sm font-semibold text-gray-700">حالة الحساب</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    form.isActive ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.isActive ? "translate-x-1" : "translate-x-7"
                    }`}
                  />
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl transition-colors disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                >
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
