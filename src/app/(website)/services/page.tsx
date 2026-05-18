import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { Noto_Naskh_Arabic } from "next/font/google";
import { getCmsData } from "@/lib/cms";

const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "700"] });

export default async function ServicesPage() {
  const cmsData = getCmsData();
  const services = cmsData.services.filter(s => s.active).sort((a, b) => a.order - b.order);

  return (
    <>
      {/* HERO */}
      <div className="relative bg-[#0B1325] text-white py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1453945619913-79ec89a82c51?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1325] via-transparent to-[#0B1325]/80" />
        <div className="container mx-auto px-6 relative z-10 text-right">
          <div className="text-sm text-slate-300 mb-4">
            <span>الرئيسية</span><span className="mx-2">/</span>
            <span className="text-[#C5A059]">الخدمات والإستشارات القانونية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">الخدمات والإستشارات القانونية</h1>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl ml-auto">
            نقدم خدمات نوعية ومتنوعة لعملائنا مستندة إلى قدراتنا المتخصصة والمهنية العالية.
          </p>
          <div className="flex flex-wrap gap-4 justify-end">
            <Link href="/contact" className="flex items-center gap-2 bg-[#0B1325]/60 hover:bg-[#C5A059] transition-colors border border-white/20 px-6 py-2 rounded-full text-sm font-bold">
              <Phone size={16} /><span>اتصال</span>
            </Link>
            <Link href="/contact" className="flex items-center gap-2 bg-[#0B1325]/60 hover:bg-[#C5A059] transition-colors border border-white/20 px-6 py-2 rounded-full text-sm font-bold">
              <MessageSquare size={16} /><span>واتساب</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SERVICES GRID */}
      <div className="bg-[#f5f5f3] py-20">
        <div className="container mx-auto px-6">
          <div className="text-right mb-12">
            <h2 className="text-3xl font-bold text-[#0B1325] mb-2">خدمات</h2>
            <div className="w-16 h-1 bg-[#C5A059] rounded-full mr-0 ml-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc) => {
              const bullets: string[] = (() => {
                try { return JSON.parse(svc.bullets || "[]"); } catch { return []; }
              })();
              return (
                <Link
                  href="/contact"
                  key={svc.id}
                  className="group block rounded-2xl border border-gray-200 hover:border-[#C5A059]/50 shadow-sm hover:shadow-xl transition-all duration-300 bg-white text-right"
                >
                  <div className="p-8">
                    {/* Icon / Emoji */}
                    <div className="w-16 h-16 rounded-2xl bg-[#0B1325]/5 group-hover:bg-[#C5A059]/10 flex items-center justify-center text-4xl mb-6 transition-colors">
                      {svc.icon || "⚖️"}
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold text-[#0B1325] mb-3 ${naskh.className}`}>
                      {svc.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-slate-500 text-sm leading-loose mb-5 ${naskh.className}`}>
                      {svc.description}
                    </p>

                    {/* Bullets */}
                    {bullets.length > 0 && (
                      <ul className="space-y-2">
                        {bullets.map((b, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-[#0B1325]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="px-8 pb-6 flex items-center justify-end gap-2 text-[#C5A059] font-bold text-sm group-hover:gap-4 transition-all border-t border-gray-100 pt-4">
                    <span>تواصل معنا</span>
                    <span>←</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
