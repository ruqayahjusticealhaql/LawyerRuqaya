"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Settings, Briefcase, Megaphone, Newspaper, Globe, Plus, Trash2, Edit3,
  Save, X, ChevronUp, ChevronDown, Eye, EyeOff, Palette, Phone, Mail,
  Instagram, Twitter, MapPin, Image as ImageIcon, LayoutTemplate, CheckCircle,
  Linkedin,
} from "lucide-react";

// ─────────────────────── types ───────────────────────
type Setting = {
  siteName: string; logoUrl?: string; slogan?: string;
  primaryColor: string; secondaryColor: string;
  phone?: string; whatsapp?: string; email?: string; address?: string;
  instagramUrl?: string; twitterUrl?: string; linkedinUrl?: string;
  aboutText?: string; aboutImage?: string;
  vision?: string; mission?: string; journeyText?: string;
  qualifications?: string; experiences?: string; aboutValues?: string;
  workHours?: string; mapLat?: string; mapLng?: string;
  footerAboutText?: string; companyReg?: string;
};
type Service = { id: string; title: string; description?: string; icon?: string; imageUrl?: string; bullets?: string; order: number; active: boolean; };
type Section = { id: string; type: string; page: string; title?: string; content: string; order: number; active: boolean; };
type BlogPost = { id: string; title: string; slug: string; excerpt?: string; content: string; published: boolean; createdAt: string; };
type Announcement = { id: string; title: string; content: string; active: boolean; };

const TABS = [
  { key: "settings", label: "إعدادات الموقع", icon: Settings },
  { key: "services", label: "الخدمات", icon: Briefcase },
  { key: "sections", label: "أقسام الصفحات", icon: LayoutTemplate },
  { key: "blog", label: "الأخبار والمدونة", icon: Newspaper },
  { key: "announcements", label: "الإعلانات", icon: Megaphone },
];

const SECTION_TYPES: Record<string, string> = {
  HERO_BANNER: "بانر رئيسي",
  TEXT_IMAGE: "نص + صورة",
  STATS: "إحصائيات",
  FEATURES: "مميزات / خدمات",
  CTA: "دعوة للتصرف",
};

const PAGES: Record<string, string> = {
  home: "الصفحة الرئيسية",
  services: "الخدمات",
  about: "من نحن",
};

// ─────────────────────── helper ───────────────────────
function toast(msg: string, ok = true) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = `position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:700;font-family:'Cairo',sans-serif;background:${ok ? "#059669" : "#dc2626"};color:#fff;box-shadow:0 4px 24px rgba(0,0,0,.25);`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─────────────────────── main component ───────────────────────
export default function CMSManager() {
  const [tab, setTab] = useState("settings");

  return (
    <div className="space-y-6" dir="rtl" style={{ fontFamily: "'Cairo',sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gold-600)" }}>إدارة المحتوى</p>
          <h1 className="text-3xl font-extrabold" style={{ color: "var(--navy-200)" }}>مدير المحتوى الشامل</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>تحكم بكل شيء يظهر في الموقع بدون أكواد</p>
        </div>
        <a href="/" target="_blank" className="btn-gold flex items-center gap-2 self-start md:self-auto shadow-gold">
          <Globe className="w-4 h-4" />
          <span className="font-bold text-sm">عرض الموقع</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-0">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-bold transition-all border-b-2 -mb-[2px] ${
              tab === key
                ? "border-[#C5A059] text-[#C5A059] bg-white shadow-sm"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tab === "settings" && <SettingsTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "sections" && <SectionsTab />}
        {tab === "blog" && <BlogTab />}
        {tab === "announcements" && <AnnouncementsTab />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB: SETTINGS
// ══════════════════════════════════════════════
function SettingsTab() {
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState<Setting>({
    siteName: "مكتب المحامية رقية",
    primaryColor: "#C5A059",
    secondaryColor: "#0B1325",
  });

  useEffect(() => {
    fetch("/api/cms/settings").then(r => r.json()).then(data => setS(prev => ({ ...prev, ...data })));
  }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/cms/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
    setSaving(false);
    toast(res.ok ? "تم حفظ الإعدادات بنجاح ✓" : "حدث خطأ!", res.ok);
  };

  const f = (k: keyof Setting) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setS(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="space-y-6">
      {/* Colors */}
      <Card title="الألوان والهوية البصرية" icon={<Palette className="w-5 h-5" style={{ color: "var(--gold-600)" }} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="اللون الذهبي (اللون الرئيسي)">
            <div className="flex gap-3">
              <input type="color" value={s.primaryColor} onChange={f("primaryColor")} className="w-14 h-10 rounded-lg border border-slate-200 cursor-pointer" />
              <input type="text" value={s.primaryColor} onChange={f("primaryColor")} className="flex-1 input" placeholder="#C5A059" />
            </div>
          </Field>
          <Field label="اللون الكحلي (الخلفية)">
            <div className="flex gap-3">
              <input type="color" value={s.secondaryColor} onChange={f("secondaryColor")} className="w-14 h-10 rounded-lg border border-slate-200 cursor-pointer" />
              <input type="text" value={s.secondaryColor} onChange={f("secondaryColor")} className="flex-1 input" placeholder="#0B1325" />
            </div>
          </Field>
        </div>
        <div className="mt-4 p-4 rounded-xl border border-slate-100 bg-slate-50">
          <p className="text-xs font-bold text-slate-500 mb-3">معاينة الألوان:</p>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ background: s.secondaryColor }}>لون الخلفية</div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-bold" style={{ background: s.primaryColor }}>اللون الذهبي</div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border-2" style={{ borderColor: s.primaryColor, color: s.primaryColor }}>حدود ذهبية</div>
          </div>
        </div>
      </Card>

      {/* Identity */}
      <Card title="هوية المكتب" icon={<Globe className="w-5 h-5" style={{ color: "var(--gold-600)" }} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="اسم الموقع / المكتب">
            <input value={s.siteName} onChange={f("siteName")} className="input" placeholder="مكتب المحامية رقية" />
          </Field>
          <Field label="الشعار اللفظي (Slogan)">
            <input value={s.slogan ?? ""} onChange={f("slogan")} className="input" placeholder="ندافع عن حقك، لأنك تستحقه" />
          </Field>
          <Field label="رابط الشعار (Logo URL)">
            <input value={s.logoUrl ?? ""} onChange={f("logoUrl")} className="input" placeholder="/images/logo.png" />
          </Field>
        </div>
        <Field label="نص من نحن (يظهر في صفحة عن المكتب)">
          <textarea value={s.aboutText ?? ""} onChange={f("aboutText")} className="input" rows={4} placeholder="نبذة عن المكتب..." />
        </Field>
        <Field label="صورة من نحن (رابط الصورة)">
          <input value={s.aboutImage ?? ""} onChange={f("aboutImage")} className="input" placeholder="https://..." />
        </Field>
      </Card>

      {/* Contact */}
      <Card title="معلومات التواصل" icon={<Phone className="w-5 h-5" style={{ color: "var(--gold-600)" }} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="رقم الهاتف">
            <div className="relative"><input value={s.phone ?? ""} onChange={f("phone")} className="input pr-10" placeholder="+966 5X XXX XXXX" /><Phone className="w-4 h-4 absolute right-3 top-3 text-slate-400" /></div>
          </Field>
          <Field label="رقم واتساب">
            <div className="relative"><input value={s.whatsapp ?? ""} onChange={f("whatsapp")} className="input pr-10" placeholder="+966 5X XXX XXXX" /><Phone className="w-4 h-4 absolute right-3 top-3 text-slate-400" /></div>
          </Field>
          <Field label="البريد الإلكتروني">
            <div className="relative"><input value={s.email ?? ""} onChange={f("email")} className="input pr-10" placeholder="info@lawoffice.sa" /><Mail className="w-4 h-4 absolute right-3 top-3 text-slate-400" /></div>
          </Field>
          <Field label="العنوان">
            <div className="relative"><input value={s.address ?? ""} onChange={f("address")} className="input pr-10" placeholder="الدمام، المملكة العربية السعودية" /><MapPin className="w-4 h-4 absolute right-3 top-3 text-slate-400" /></div>
          </Field>
          <Field label="رابط انستقرام">
            <div className="relative"><input value={s.instagramUrl ?? ""} onChange={f("instagramUrl")} className="input pr-10" placeholder="https://instagram.com/..." /><Instagram className="w-4 h-4 absolute right-3 top-3 text-slate-400" /></div>
          </Field>
          <Field label="رابط لينكدان">
            <div className="relative"><input value={s.linkedinUrl ?? ""} onChange={f("linkedinUrl")} className="input pr-10" placeholder="https://linkedin.com/..." /><Linkedin className="w-4 h-4 absolute right-3 top-3 text-slate-400" /></div>
          </Field>
          <Field label="رابط تويتر / X">
            <div className="relative"><input value={s.twitterUrl ?? ""} onChange={f("twitterUrl")} className="input pr-10" placeholder="https://twitter.com/..." /><Twitter className="w-4 h-4 absolute right-3 top-3 text-slate-400" /></div>
          </Field>
          <Field label="خط العرض للخريطة (Latitude)">
            <input value={s.mapLat ?? ""} onChange={f("mapLat")} className="input" placeholder="26.4333999" />
          </Field>
          <Field label="خط الطول للخريطة (Longitude)">
            <input value={s.mapLng ?? ""} onChange={f("mapLng")} className="input" placeholder="50.117746" />
          </Field>
        </div>
        <Field label="ساعات العمل (كل سطر: اليوم|الساعات)">
          <textarea
            value={(() => { try { return (JSON.parse(s.workHours || "[]") as {day:string;hours:string}[]).map(w => `${w.day}|${w.hours}`).join("\n"); } catch { return s.workHours ?? ""; } })()}
            onChange={e => {
              const arr = e.target.value.split("\n").filter(Boolean).map(l => { const [day, ...rest] = l.split("|"); return { day, hours: rest.join("|") }; });
              setS(prev => ({ ...prev, workHours: JSON.stringify(arr) }));
            }}
            className="input" rows={4} placeholder={"الأحد - الخميس|8:00 ص - 5:00 م\nالسبت|9:00 ص - 2:00 م\nالجمعة|مغلق"}
          />
        </Field>
        <Field label="رقم السجل التجاري">
          <input value={s.companyReg ?? ""} onChange={f("companyReg")} className="input" placeholder="2050215426" />
        </Field>
      </Card>

      {/* Footer */}
      <Card title="محتوى الفوتر" icon={<Globe className="w-5 h-5" style={{ color: "var(--gold-600)" }} />}>
        <Field label="النص التعريفي في الفوتر">
          <textarea value={s.footerAboutText ?? ""} onChange={f("footerAboutText")} className="input" rows={3} placeholder="نحن نقف إلى جانب عملائنا بالثقة والنزاهة..." />
        </Field>
      </Card>

      {/* About Page */}
      <Card title="صفحة من نحن" icon={<Globe className="w-5 h-5" style={{ color: "var(--gold-600)" }} />}>
        <Field label="رؤيتنا">
          <textarea value={s.vision ?? ""} onChange={f("vision")} className="input" rows={3} placeholder="رؤية المكتب..." />
        </Field>
        <Field label="رسالتنا">
          <textarea value={s.mission ?? ""} onChange={f("mission")} className="input" rows={3} placeholder="رسالة المكتب..." />
        </Field>
        <Field label="نص رحلتنا (افصل بين الفقرات بسطر فارغ)">
          <textarea value={s.journeyText ?? ""} onChange={f("journeyText")} className="input" rows={8} placeholder="الفقرة الأولى...\n\nالفقرة الثانية..." />
        </Field>
        <Field label="المؤهلات العلمية (كل سطر = مؤهل)">
          <textarea
            value={(() => { try { return (JSON.parse(s.qualifications || "[]") as string[]).join("\n"); } catch { return s.qualifications ?? ""; } })()}
            onChange={e => setS(prev => ({ ...prev, qualifications: JSON.stringify(e.target.value.split("\n").filter(Boolean)) }))}
            className="input" rows={6} placeholder={"بكالوريوس القانون - جامعة ...\nماجستير القانون - جامعة ..."}
          />
        </Field>
        <Field label="المسيرة المهنية (كل سطر: السنة|المسمى|المكان)">
          <textarea
            value={(() => { try { return (JSON.parse(s.experiences || "[]") as {year:string;title:string;place:string}[]).map(e => `${e.year}|${e.title}|${e.place}`).join("\n"); } catch { return s.experiences ?? ""; } })()}
            onChange={e => {
              const arr = e.target.value.split("\n").filter(Boolean).map(l => { const [year, title, ...rest] = l.split("|"); return { year, title, place: rest.join("|") }; });
              setS(prev => ({ ...prev, experiences: JSON.stringify(arr) }));
            }}
            className="input" rows={4} placeholder={"2009 - 2013|محامية مساعدة|مكتب ...\n2018 - حتى الآن|مؤسسة|مكتب المحامية رقية"}
          />
        </Field>
        <Field label="قيمنا المهنية (كل سطر: العنوان|الوصف)">
          <textarea
            value={(() => { try { return (JSON.parse(s.aboutValues || "[]") as {title:string;desc:string}[]).map(v => `${v.title}|${v.desc}`).join("\n"); } catch { return s.aboutValues ?? ""; } })()}
            onChange={e => {
              const arr = e.target.value.split("\n").filter(Boolean).map(l => { const [title, ...rest] = l.split("|"); return { title, desc: rest.join("|") }; });
              setS(prev => ({ ...prev, aboutValues: JSON.stringify(arr) }));
            }}
            className="input" rows={4} placeholder={"العدالة|نؤمن بأن العدالة حق للجميع\nالأمانة|نتعامل مع موكلينا بشفافية"}
          />
        </Field>
      </Card>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving} className="btn-gold flex items-center gap-2 px-8 py-3 shadow-gold">
          <Save className="w-5 h-5" />
          {saving ? "جاري الحفظ..." : "حفظ كل الإعدادات"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB: SERVICES
// ══════════════════════════════════════════════
function ServicesTab() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    fetch("/api/cms/services").then(r => r.json()).then(data => { setServices(data); setLoading(false); });
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const url = isNew ? "/api/cms/services" : `/api/cms/services/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (res.ok) { toast("تم الحفظ بنجاح ✓"); setEditing(null); reload(); }
    else toast("حدث خطأ!", false);
  };

  const del = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    const res = await fetch(`/api/cms/services/${id}`, { method: "DELETE" });
    if (res.ok) { toast("تم الحذف"); reload(); }
  };

  const toggle = async (svc: Service) => {
    await fetch(`/api/cms/services/${svc.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !svc.active }) });
    reload();
  };

  const parseBullets = (b?: string): string[] => { try { return b ? JSON.parse(b) : []; } catch { return []; } };
  const bulletsToStr = (arr: string[]) => JSON.stringify(arr);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">الخدمات تظهر في صفحة /services وفي الصفحة الرئيسية</p>
        <button onClick={() => setEditing({ title: "", active: true, order: services.length })} className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة خدمة جديدة
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(svc => (
            <div key={svc.id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${svc.active ? "border-slate-100" : "border-dashed border-slate-300 opacity-60"}`}>
              {svc.imageUrl && <img src={svc.imageUrl} alt={svc.title} className="w-full h-32 object-cover rounded-xl mb-3" />}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#0B1325]">{svc.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${svc.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{svc.active ? "نشط" : "مخفي"}</span>
              </div>
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">{svc.description}</p>
              {parseBullets(svc.bullets).length > 0 && (
                <ul className="text-xs text-slate-400 space-y-0.5 mb-3">
                  {parseBullets(svc.bullets).map((b, i) => <li key={i} className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-[#C5A059]" />{b}</li>)}
                </ul>
              )}
              <div className="flex gap-2 pt-2 border-t border-slate-50">
                <button onClick={() => setEditing(svc)} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#C5A059] transition-colors px-2 py-1"><Edit3 className="w-3.5 h-3.5" />تعديل</button>
                <button onClick={() => toggle(svc)} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-500 transition-colors px-2 py-1">{svc.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}{svc.active ? "إخفاء" : "إظهار"}</button>
                <button onClick={() => del(svc.id)} className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors px-2 py-1 mr-auto"><Trash2 className="w-3.5 h-3.5" />حذف</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {services.length === 0 && !loading && (
        <EmptyState msg="لا توجد خدمات بعد. أضف خدمتك الأولى!" />
      )}

      {/* Modal */}
      {editing !== null && (
        <Modal title={editing.id ? "تعديل الخدمة" : "إضافة خدمة جديدة"} onClose={() => setEditing(null)} onSave={save}>
          <Field label="عنوان الخدمة *"><input value={editing.title ?? ""} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} className="input" placeholder="مثال: الاستشارات القانونية" /></Field>
          <Field label="وصف الخدمة"><textarea value={editing.description ?? ""} onChange={e => setEditing(p => ({ ...p!, description: e.target.value }))} className="input" rows={3} placeholder="وصف مختصر للخدمة..." /></Field>
          <Field label="رابط صورة الخدمة (اختياري)"><input value={editing.imageUrl ?? ""} onChange={e => setEditing(p => ({ ...p!, imageUrl: e.target.value }))} className="input" placeholder="https://images.unsplash.com/..." /></Field>
          <Field label="النقاط التفصيلية (كل نقطة في سطر)">
            <textarea
              value={parseBullets(editing.bullets).join("\n")}
              onChange={e => setEditing(p => ({ ...p!, bullets: bulletsToStr(e.target.value.split("\n").filter(Boolean)) }))}
              className="input" rows={4}
              placeholder={"توثيق العقود والاتفاقيات\nإصدار الوكالات الشرعية\nإفراغ العقارات"}
            />
          </Field>
          <Field label="الترتيب"><input type="number" value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p!, order: +e.target.value }))} className="input w-24" /></Field>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB: SECTIONS
// ══════════════════════════════════════════════
function SectionsTab() {
  const [sections, setSections] = useState<Section[]>([]);
  const [editing, setEditing] = useState<Partial<Section> | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    fetch("/api/cms/sections").then(r => r.json()).then(data => { setSections(data); setLoading(false); });
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const payload = { ...editing, content: editing.content || "{}" };
    const url = isNew ? "/api/cms/sections" : `/api/cms/sections/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { toast("تم الحفظ ✓"); setEditing(null); reload(); }
    else toast("حدث خطأ!", false);
  };

  const del = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await fetch(`/api/cms/sections/${id}`, { method: "DELETE" });
    toast("تم الحذف"); reload();
  };

  const toggle = async (sec: Section) => {
    await fetch(`/api/cms/sections/${sec.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !sec.active }) });
    reload();
  };

  const parseContent = (c: string) => { try { return JSON.parse(c); } catch { return {}; } };

  const ContentFields = ({ editing, setEditing }: { editing: Partial<Section>; setEditing: React.Dispatch<React.SetStateAction<Partial<Section> | null>> }) => {
    const content = parseContent(editing.content ?? "{}");
    const update = (key: string, val: string) => setEditing(p => ({ ...p!, content: JSON.stringify({ ...parseContent(p!.content ?? "{}"), [key]: val }) }));

    if (editing.type === "HERO_BANNER") return (
      <>
        <Field label="العنوان الرئيسي"><input value={content.title ?? ""} onChange={e => update("title", e.target.value)} className="input" placeholder="العدالة... برؤية نظامية راسخة" /></Field>
        <Field label="العنوان الفرعي"><input value={content.subtitle ?? ""} onChange={e => update("subtitle", e.target.value)} className="input" placeholder="نص إضافي صغير" /></Field>
        <Field label="النص التوضيحي"><textarea value={content.desc ?? ""} onChange={e => update("desc", e.target.value)} className="input" rows={3} /></Field>
        <Field label="رابط الصورة الخلفية"><input value={content.img ?? ""} onChange={e => update("img", e.target.value)} className="input" placeholder="https://..." /></Field>
        <Field label="نص الزر"><input value={content.btnText ?? ""} onChange={e => update("btnText", e.target.value)} className="input" placeholder="تواصل معنا" /></Field>
        <Field label="رابط الزر"><input value={content.btnLink ?? ""} onChange={e => update("btnLink", e.target.value)} className="input" placeholder="/contact" /></Field>
      </>
    );

    if (editing.type === "TEXT_IMAGE") return (
      <>
        <Field label="العنوان"><input value={content.title ?? ""} onChange={e => update("title", e.target.value)} className="input" /></Field>
        <Field label="النص"><textarea value={content.text ?? ""} onChange={e => update("text", e.target.value)} className="input" rows={4} /></Field>
        <Field label="رابط الصورة"><input value={content.img ?? ""} onChange={e => update("img", e.target.value)} className="input" placeholder="https://..." /></Field>
        <Field label="موضع الصورة">
          <select value={content.imgSide ?? "right"} onChange={e => update("imgSide", e.target.value)} className="input">
            <option value="right">يمين</option>
            <option value="left">يسار</option>
          </select>
        </Field>
      </>
    );

    if (editing.type === "STATS") return (
      <Field label="الإحصائيات (كل سطر: رقم|وصف)">
        <textarea
          value={(content.items ?? []).map((i: { value: string; label: string }) => `${i.value}|${i.label}`).join("\n")}
          onChange={e => update("items", JSON.stringify(e.target.value.split("\n").filter(Boolean).map(l => { const [v, ...rest] = l.split("|"); return { value: v, label: rest.join("|") }; })) as unknown as string)}
          className="input" rows={4} placeholder={"٢٠+|سنة خبرة\n٥٠٠+|قضية ناجحة\n١٠٠٪|رضا العملاء"}
        />
      </Field>
    );

    if (editing.type === "FEATURES") return (
      <Field label="العناصر (كل سطر: عنوان|وصف)">
        <textarea
          value={(content.items ?? []).map((i: { title: string; desc: string }) => `${i.title}|${i.desc}`).join("\n")}
          onChange={e => update("items", JSON.stringify(e.target.value.split("\n").filter(Boolean).map(l => { const [t, ...rest] = l.split("|"); return { title: t, desc: rest.join("|") }; })) as unknown as string)}
          className="input" rows={6} placeholder={"خبرة قانونية|نخبة من المحامين المتخصصين\nسرية تامة|نضمن سرية جميع معلوماتك"}
        />
      </Field>
    );

    if (editing.type === "CTA") return (
      <>
        <Field label="العنوان"><input value={content.title ?? ""} onChange={e => update("title", e.target.value)} className="input" /></Field>
        <Field label="النص الفرعي"><input value={content.subtitle ?? ""} onChange={e => update("subtitle", e.target.value)} className="input" /></Field>
        <Field label="نص الزر"><input value={content.btnText ?? ""} onChange={e => update("btnText", e.target.value)} className="input" /></Field>
        <Field label="رابط الزر"><input value={content.btnLink ?? ""} onChange={e => update("btnLink", e.target.value)} className="input" /></Field>
        <Field label="رابط صورة الخلفية (اختياري)"><input value={content.img ?? ""} onChange={e => update("img", e.target.value)} className="input" /></Field>
      </>
    );

    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">أضف أقساماً جديدة لأي صفحة في الموقع دون الحاجة للكود</p>
        <button onClick={() => setEditing({ type: "HERO_BANNER", page: "home", active: true, order: sections.length, content: "{}" })} className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة قسم جديد
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {sections.map(sec => (
            <div key={sec.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${sec.active ? "border-slate-100" : "border-dashed border-slate-200 opacity-60"}`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C5A059] flex-shrink-0" style={{ background: "#0B1325" }}>
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#0B1325]">{sec.title || SECTION_TYPES[sec.type] || sec.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">{SECTION_TYPES[sec.type] || sec.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">{PAGES[sec.page] || sec.page}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sec.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{sec.active ? "ظاهر" : "مخفي"}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">ترتيب: {sec.order}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing(sec)} className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-[#C5A059] transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => toggle(sec)} className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-500 transition-colors">{sec.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                <button onClick={() => del(sec.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sections.length === 0 && !loading && <EmptyState msg="لا توجد أقسام مخصصة بعد. أضف أول قسم!" />}

      {editing !== null && (
        <Modal title={editing.id ? "تعديل القسم" : "إضافة قسم جديد"} onClose={() => setEditing(null)} onSave={save}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="نوع القسم">
              <select value={editing.type ?? "HERO_BANNER"} onChange={e => setEditing(p => ({ ...p!, type: e.target.value, content: "{}" }))} className="input">
                {Object.entries(SECTION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="الصفحة">
              <select value={editing.page ?? "home"} onChange={e => setEditing(p => ({ ...p!, page: e.target.value }))} className="input">
                {Object.entries(PAGES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
          </div>
          <Field label="عنوان القسم (اختياري)"><input value={editing.title ?? ""} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} className="input" /></Field>
          <Field label="الترتيب"><input type="number" value={editing.order ?? 0} onChange={e => setEditing(p => ({ ...p!, order: +e.target.value }))} className="input w-24" /></Field>
          <div className="border-t border-slate-100 pt-4 mt-2">
            <p className="text-sm font-bold text-slate-600 mb-3">محتوى القسم:</p>
            <ContentFields editing={editing} setEditing={setEditing} />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB: BLOG
// ══════════════════════════════════════════════
function BlogTab() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    fetch("/api/cms/blog").then(r => r.json()).then(data => { setPosts(data); setLoading(false); });
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const url = isNew ? "/api/cms/blog" : `/api/cms/blog/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (res.ok) { toast("تم الحفظ ✓"); setEditing(null); reload(); }
    else toast("حدث خطأ!", false);
  };

  const del = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    await fetch(`/api/cms/blog/${id}`, { method: "DELETE" });
    toast("تم الحذف"); reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">المقالات والأخبار تظهر في صفحة المدونة /blog</p>
        <button onClick={() => setEditing({ title: "", content: "", published: false, category: "أنظمة ولوائح", imageUrl: "/images/blog-1.png" })} className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة خبر / مقال
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[#0B1325] truncate">{post.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${post.published ? "bg-emerald-50 text-emerald-600" : "bg-yellow-50 text-yellow-600"}`}>{post.published ? "منشور" : "مسودة"}</span>
                </div>
                {post.excerpt && <p className="text-sm text-slate-500 mt-1 truncate">{post.excerpt}</p>}
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString("ar-SA")}</p>
                  {post.category && <span className="text-xs text-[#137A63] font-bold bg-[#137A63]/5 px-2 py-0.5 rounded-md">{post.category}</span>}
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing(post)} className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-[#C5A059] transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => del(post.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {posts.length === 0 && !loading && <EmptyState msg="لا توجد مقالات بعد. أضف أول مقال!" />}

      {editing !== null && (
        <Modal title={editing.id ? "تعديل المقال" : "إضافة مقال / خبر"} onClose={() => setEditing(null)} onSave={save}>
          <Field label="العنوان *"><input value={editing.title ?? ""} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} className="input" placeholder="عنوان الخبر أو المقال" /></Field>
          <Field label="الفئة (مثال: أنظمة ولوائح، تعاميم)"><input value={editing.category ?? ""} onChange={e => setEditing(p => ({ ...p!, category: e.target.value }))} className="input" placeholder="مثال: تعاميم، أنظمة ولوائح" /></Field>
          <Field label="رابط الصورة (Image URL)"><input value={editing.imageUrl ?? ""} onChange={e => setEditing(p => ({ ...p!, imageUrl: e.target.value }))} className="input" placeholder="رابط صورة المقال (مثال: /images/blog-1.png)" /></Field>
          <Field label="مقتطف (وصف مختصر)"><input value={editing.excerpt ?? ""} onChange={e => setEditing(p => ({ ...p!, excerpt: e.target.value }))} className="input" placeholder="وصف مختصر يظهر في قائمة المقالات" /></Field>
          <Field label="المحتوى الكامل *"><textarea value={editing.content ?? ""} onChange={e => setEditing(p => ({ ...p!, content: e.target.value }))} className="input" rows={8} placeholder="اكتب تفاصيل المقال هنا..." /></Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={editing.published ?? false} onChange={e => setEditing(p => ({ ...p!, published: e.target.checked }))} className="w-4 h-4 accent-[#C5A059]" />
            <span className="text-sm font-bold text-slate-700">نشر مباشرةً (سيظهر في الموقع)</span>
          </label>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB: ANNOUNCEMENTS
// ══════════════════════════════════════════════
function AnnouncementsTab() {
  const [list, setList] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Partial<Announcement> | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    fetch("/api/cms/announcements").then(r => r.json()).then(data => { setList(data); setLoading(false); });
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const url = isNew ? "/api/cms/announcements" : `/api/cms/announcements/${editing.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (res.ok) { toast("تم الحفظ ✓"); setEditing(null); reload(); }
    else toast("حدث خطأ!", false);
  };

  const del = async (id: string) => {
    if (!confirm("هل أنت متأكد؟")) return;
    await fetch(`/api/cms/announcements/${id}`, { method: "DELETE" });
    toast("تم الحذف"); reload();
  };

  const toggle = async (ann: Announcement) => {
    await fetch(`/api/cms/announcements/${ann.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !ann.active }) });
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">الإعلانات تظهر في الصفحة الرئيسية وأعلى الموقع</p>
        <button onClick={() => setEditing({ title: "", content: "", active: true })} className="btn-gold flex items-center gap-2">
          <Plus className="w-4 h-4" /> إضافة إعلان
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-3">
          {list.map(ann => (
            <div key={ann.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${ann.active ? "border-slate-100" : "border-dashed border-slate-200 opacity-60"}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-[#0B1325]">{ann.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${ann.active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>{ann.active ? "نشط" : "متوقف"}</span>
                </div>
                <p className="text-sm text-slate-500 mt-1 truncate">{ann.content}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing(ann)} className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-[#C5A059] transition-colors"><Edit3 className="w-4 h-4" /></button>
                <button onClick={() => toggle(ann)} className="p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-500 transition-colors">{ann.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                <button onClick={() => del(ann.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {list.length === 0 && !loading && <EmptyState msg="لا توجد إعلانات بعد." />}

      {editing !== null && (
        <Modal title={editing.id ? "تعديل الإعلان" : "إضافة إعلان جديد"} onClose={() => setEditing(null)} onSave={save}>
          <Field label="عنوان الإعلان *"><input value={editing.title ?? ""} onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))} className="input" placeholder="مثال: افتتاح فرع الرياض" /></Field>
          <Field label="نص الإعلان *"><textarea value={editing.content ?? ""} onChange={e => setEditing(p => ({ ...p!, content: e.target.value }))} className="input" rows={4} placeholder="تفاصيل الإعلان..." /></Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(p => ({ ...p!, active: e.target.checked }))} className="w-4 h-4 accent-[#C5A059]" />
            <span className="text-sm font-bold text-slate-700">نشط (يظهر في الموقع)</span>
          </label>
        </Modal>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// SHARED UI COMPONENTS
// ══════════════════════════════════════════════
function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        {icon}
        <h2 className="text-lg font-bold" style={{ color: "var(--navy-200)" }}>{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" dir="rtl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-[#0B1325]">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-4">{children}</div>
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">إلغاء</button>
          <button onClick={onSave} className="btn-gold flex items-center gap-2 px-6 py-2.5"><Save className="w-4 h-4" />حفظ</button>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin" /></div>;
}

function EmptyState({ msg }: { msg: string }) {
  return <div className="text-center py-16 text-slate-400 font-bold">{msg}</div>;
}
