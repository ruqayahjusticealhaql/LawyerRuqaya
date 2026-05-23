"use client";
import React, { useState } from "react";
import { ArrowRight, Save, Calendar, Tag, Image as ImageIcon, AlignLeft } from "lucide-react";
import Link from "next/link";

export default function NewNewsPage() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    imageUrl: "",
    content: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تم حفظ الخبر ونشره في الموقع (محاكاة - سيتم ربط قاعدة البيانات لاحقاً بناءً على طلبك)");
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>إدارة المحتوى</p>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--navy-200)" }}>إضافة خبر جديد</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>نشر خبر أو مقال جديد في الموقع العام</p>
        </div>
        <Link href="/dashboard/cms">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
            <ArrowRight className="w-4 h-4" />
            <span className="font-bold text-sm">العودة للتحكم</span>
          </button>
        </Link>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "var(--navy-200)" }}>عنوان الخبر *</label>
            <div className="relative">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl p-3 text-sm focus:outline-none border border-slate-200 focus:border-gold-500 transition-colors pr-10"
                placeholder="مثال: المكتب يشارك في مؤتمر القانون الدولي"
              />
              <Tag className="w-5 h-5 absolute right-3 top-3.5 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: "var(--navy-200)" }}>تاريخ النشر *</label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl p-3 text-sm focus:outline-none border border-slate-200 focus:border-gold-500 transition-colors pr-10"
                />
                <Calendar className="w-5 h-5 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Image URL (Simulated Upload) */}
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: "var(--navy-200)" }}>رابط الصورة (سيتم تفعيل الرفع الحقيقي لاحقاً) *</label>
              <div className="relative">
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl p-3 text-sm focus:outline-none border border-slate-200 focus:border-gold-500 transition-colors pr-10"
                  placeholder="مثال: https://images.unsplash.com/..."
                />
                <ImageIcon className="w-5 h-5 absolute right-3 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: "var(--navy-200)" }}>نص الخبر / الوصف *</label>
            <div className="relative">
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-xl p-3 text-sm focus:outline-none border border-slate-200 focus:border-gold-500 transition-colors pr-10"
                placeholder="اكتب تفاصيل الخبر هنا..."
              />
              <AlignLeft className="w-5 h-5 absolute right-3 top-3.5 text-slate-400" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="btn-gold flex items-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-gold px-6 py-3"
            >
              <Save className="w-5 h-5" />
              <span className="font-bold">حفظ ونشر الخبر</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
