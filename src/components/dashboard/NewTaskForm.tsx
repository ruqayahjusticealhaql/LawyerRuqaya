"use client";

import React, { useState, useRef } from "react";
import {
  ArrowRight, Save, Calendar, Flag, Tag, User, Briefcase,
  Sparkles, Loader2, CheckCircle2, Paperclip, X, FileText, Image
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTask } from "@/app/(dashboard)/dashboard/tasks/actions";
import { ROLE_LABELS } from "@/lib/roles";

interface NewTaskFormProps {
  users: Array<{ id: string; name: string; role: string }>;
  cases: Array<{ id: string; title: string; caseNumber: string }>;
  onSuccess?: () => void;
  currentUserId?: string;
  currentUserRole?: string;
}

export default function NewTaskForm({ users, cases, onSuccess, currentUserId, currentUserRole }: NewTaskFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLawyer = currentUserRole === "LAWYER";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
    assignedToId: isLawyer && currentUserId ? currentUserId : "",
    caseId: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const valid = files.filter(f => f.size <= maxSize);
    if (valid.length < files.length) {
      setError("بعض الملفات تجاوزت الحد الأقصى (10 ميغابايت)");
    }
    setSelectedFiles(prev => [...prev, ...valid]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4 text-[#C5A059]" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title.trim()) throw new Error("عنوان المهمة مطلوب");
      if (!formData.assignedToId) throw new Error("يجب اختيار العضو الكادر المسند إليه المهمة");

      // رفع الملفات أولاً إن وجدت
      let attachmentUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const uploadForm = new FormData();
        selectedFiles.forEach(f => uploadForm.append("files", f));
        const res = await fetch("/api/upload", { method: "POST", body: uploadForm });
        if (!res.ok) throw new Error("فشل رفع الملفات، حاول مرة أخرى");
        const data = await res.json();
        attachmentUrls = data.urls || [];
      }

      const result = await createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate || undefined,
        assignedToId: formData.assignedToId,
        caseId: formData.caseId || undefined,
        attachments: attachmentUrls,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
            router.refresh();
          } else {
            router.push("/dashboard/tasks");
            router.refresh();
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "حدث خطأ غير متوقع أثناء حفظ المهمة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl bg-white border border-[#EADFD3] rounded-3xl p-8 shadow-sm relative overflow-hidden">

      {success ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">تم إنشاء المهمة وإسنادها بنجاح</h2>
          <p className="text-sm text-slate-400 max-w-sm">تم إرسال إشعار فوري للشخص المسند إليه لمباشرة العمل. جارٍ تحويلك...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Approval notice for lawyers */}
          {isLawyer && (() => {
            const isSelf = formData.assignedToId === currentUserId;
            const hasPick = !!formData.assignedToId;
            if (!hasPick) return null;
            return (
              <div className={`flex items-start gap-3 p-4 rounded-2xl text-sm border ${
                isSelf ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"
              }`}>
                <span className="font-bold">{isSelf ? "✓ تفعيل فوري" : "⏳ بانتظار موافقة الإدارة"}</span>
                <span className="opacity-80">
                  {isSelf
                    ? "المهمة لنفسك — ستُفعَّل مباشرة."
                    : "المهمة لشخص آخر — ستنتظر موافقة المدير أو السكرتيرة."}
                </span>
              </div>
            );
          })()}

          {/* Task Name */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1E293B]">اسم المهمة أو النشاط الموكل *</label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-2xl p-4 text-sm bg-[#FAF8F5] border border-[#EADFD3] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all pr-12 text-[#1E293B] placeholder-slate-400 outline-none"
                placeholder="مثال: صياغة اللائحة الاعتراضية، إيداع المستندات، مراجعة المحاسب"
              />
              <Tag className="w-5 h-5 absolute right-4 top-4 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assigned To */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1E293B]">المسند إليه المهمة *</label>
              <div className="relative">
                <select
                  name="assignedToId"
                  value={formData.assignedToId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl p-4 text-sm bg-[#FAF8F5] border border-[#EADFD3] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all pr-12 appearance-none text-[#1E293B] outline-none"
                >
                  <option value="">اختر العضو الكادر...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({ROLE_LABELS[u.role] || u.role})
                    </option>
                  ))}
                </select>
                <User className="w-5 h-5 absolute right-4 top-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Case */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1E293B]">ربط بالقضية (اختياري)</label>
              <div className="relative">
                <select
                  name="caseId"
                  value={formData.caseId}
                  onChange={handleChange}
                  className="w-full rounded-2xl p-4 text-sm bg-[#FAF8F5] border border-[#EADFD3] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all pr-12 appearance-none text-[#1E293B] outline-none"
                >
                  <option value="">لا يوجد ارتباط بقضية معينة</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.caseNumber})
                    </option>
                  ))}
                </select>
                <Briefcase className="w-5 h-5 absolute right-4 top-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Priority */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1E293B]">مستوى الأولوية</label>
              <div className="relative">
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-2xl p-4 text-sm bg-[#FAF8F5] border border-[#EADFD3] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all pr-12 appearance-none text-[#1E293B] outline-none"
                >
                  <option value="LOW">منخفضة</option>
                  <option value="MEDIUM">متوسطة</option>
                  <option value="HIGH">عاجلة / عالية</option>
                </select>
                <Flag className="w-5 h-5 absolute right-4 top-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1E293B]">الحالة المبدئية</label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl p-4 text-sm bg-[#FAF8F5] border border-[#EADFD3] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all pr-12 appearance-none text-[#1E293B] outline-none"
                >
                  <option value="TODO">جديدة (تم الإنشاء)</option>
                  <option value="IN_PROGRESS">قيد التنفيذ</option>
                  <option value="REVIEW">قيد المراجعة</option>
                </select>
                <Sparkles className="w-5 h-5 absolute right-4 top-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1E293B]">تاريخ تسليم المهمة</label>
              <div className="relative">
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl p-4 text-sm bg-[#FAF8F5] border border-[#EADFD3] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all pr-12 text-[#1E293B] outline-none"
                />
                <Calendar className="w-5 h-5 absolute right-4 top-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#1E293B]">شرح وتفاصيل التوجيه الإداري</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-2xl p-4 text-sm bg-[#FAF8F5] border border-[#EADFD3] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all text-[#1E293B] placeholder-slate-400 outline-none"
              placeholder="اكتب التوجيهات، الملاحظات، أو أية تعليمات يرجى الاعتماد عليها لإتمام المهمة بنجاح..."
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-[#1E293B]">إرفاق ملفات أو صور (اختياري)</label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#EADFD3] hover:border-[#C5A059] rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#FAF8F5] hover:bg-[#FDF8F0] group"
            >
              <Paperclip className="w-8 h-8 text-slate-300 group-hover:text-[#C5A059] mx-auto mb-2 transition-colors" />
              <p className="text-sm font-bold text-slate-500 group-hover:text-[#C5A059] transition-colors">اضغط لرفع ملفات أو صور</p>
              <p className="text-xs text-slate-400 mt-1">PDF، Word، صور — الحد الأقصى 10 MB لكل ملف</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white border border-[#EADFD3] rounded-xl px-4 py-3">
                    {getFileIcon(file)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1E293B] truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition-all flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-[#EADFD3]">
            <Link href="/dashboard/tasks">
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#EADFD3] text-slate-500 hover:text-[#1E293B] hover:bg-[#FAF8F5] transition-all text-sm font-bold"
              >
                <ArrowRight className="w-4 h-4 ml-1" />
                تراجع وإلغاء
              </button>
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#b8944d] text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{selectedFiles.length > 0 ? "جارٍ رفع الملفات والحفظ..." : "جارٍ الحفظ..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ وإسناد المهمة فوراً</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}
    </div>
  );
}
