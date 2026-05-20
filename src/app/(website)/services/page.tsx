import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import PageHero from "@/components/website/PageHero";
import { Noto_Naskh_Arabic } from "next/font/google";
import { getCmsData } from "@/lib/cms";

export const dynamic = "force-dynamic";

const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "700"] });

const getServiceIconPath = (id: string) => {
  switch (id) {
    case "svc-1": return "/images/التقاضي والترافع.png";
    case "svc-2": return "/images/قطاع الأعمال والشركات.png";
    case "svc-3": return "/images/تحصيل الديون.png";
    case "svc-4": return "/images/الاستثمار الأجنبي.png";
    case "svc-5": return "/images/الملكية الفكرية.png";
    case "svc-6": return "/images/العقود والاتفاقيات.png";
    default: return "/images/التقاضي والترافع.png";
  }
};

export default async function ServicesPage() {
  const cmsData = getCmsData();
  const services = cmsData.services.filter(s => s.active).sort((a, b) => a.order - b.order);

  return (
    <>
      <PageHero
        title="الخدمات والإستشارات القانونية"
        subtitle="نقدم خدمات نوعية ومتنوعة لعملائنا مستندة إلى قدراتنا المتخصصة والمهنية العالية."
      >
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/contact" className="flex items-center gap-2 border border-[#C5A059]/50 hover:bg-[#C5A059] hover:border-[#C5A059] transition-all px-6 py-2.5 rounded-full text-sm font-bold font-arabic">
            <Phone size={15} /><span>اتصال</span>
          </Link>
          <Link href="/contact" className="flex items-center gap-2 border border-white/20 hover:bg-white/10 transition-all px-6 py-2.5 rounded-full text-sm font-bold font-arabic">
            <MessageSquare size={15} /><span>واتساب</span>
          </Link>
        </div>
      </PageHero>

      {/* SERVICES GRID */}
      <div className="bg-[#f5f5f3] py-20 rounded-t-[60px]">
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
                    <div className="w-12 h-12 flex items-center justify-center mb-6">
                      <img
                        src={getServiceIconPath(svc.id)}
                        alt={svc.title}
                        className="w-full h-full object-contain group-hover:brightness-110"
                      />
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
