import { Scale, Award, BookOpen, Users, Shield, Heart, Lock, CheckCircle, Eye, Rocket } from "lucide-react";
import Link from "next/link";
import { getCmsData } from "@/lib/cms";

export const dynamic = "force-dynamic";

type TeamMember = { name: string; title: string; specialization: string; photoUrl: string };

export default async function AboutPage() {
  const { settings } = getCmsData();

  const aboutValues: { title: string; desc: string }[] = (() => {
    try { return JSON.parse(settings.aboutValues || "[]"); } catch { return []; }
  })();

  const teamMembers: TeamMember[] = (() => {
    try { return JSON.parse(settings.teamMembers || "[]"); } catch { return []; }
  })();

  const valueIcons = [
    <Shield key="sh" className="w-10 h-10" />,
    <Eye key="e" className="w-10 h-10" />,
    <Award key="a" className="w-10 h-10" />,
    <Lock key="l" className="w-10 h-10" />,
    <CheckCircle key="c" className="w-10 h-10" />,
    <Scale key="s" className="w-10 h-10" />,
    <Rocket key="r" className="w-10 h-10" />,
    <Users key="u" className="w-10 h-10" />,
  ];

  return (
    <>
      {/* Header Banner */}
      <section className="relative bg-[#0B1325] py-32 overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(145deg, #040812 0%, #0B1325 60%, #0F1B30 100%)" }} />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2 font-arabic">من نحن</h1>
          <div className="w-12 h-1 bg-[#C5A059] mx-auto rounded-full" />
        </div>
      </section>

      {/* About Text */}
      <section className="py-20 bg-white rounded-t-[50px] lg:rounded-t-[100px] -mt-12 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6">
                <span className="text-[#C5A059] font-bold text-lg font-arabic">نبذة عنا</span>
                <div className="w-10 h-0.5 bg-[#C5A059] mt-1" />
              </div>
              <p className="text-slate-600 text-base leading-relaxed">
                {settings.aboutText}
              </p>
            </div>
            <div className="relative justify-self-center lg:justify-self-end">
              <div className="w-[300px] h-[350px] md:w-[350px] md:h-[400px] relative">
                <div className="absolute inset-0 border border-slate-300 rounded-[40px] transform translate-x-3 translate-y-3" />
                <div className="absolute inset-0 rounded-[40px] overflow-hidden border-2 border-white shadow-xl">
                  <img
                    src={settings.aboutImage || "/images/hero-slide-3.png"}
                    alt="شركة رقية عبدالرحمن"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      {(settings.vision || settings.mission) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {settings.vision && (
                <div className="bg-[#0B1325] rounded-3xl p-8 text-white min-h-[280px] flex flex-col justify-between border border-[#C5A059]/10 shadow-xl">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-0.5 bg-[#C5A059]/30 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#C5A059] rotate-45" /></div>
                      <h3 className="text-2xl font-bold font-arabic text-[#C5A059]">رؤيتنا</h3>
                    </div>
                    <p className="text-slate-200 text-base leading-relaxed mb-6 font-arabic">{settings.vision}</p>
                    <div className="border-t border-white/10 pt-4 mt-auto">
                      <span className="text-[#C5A059] font-semibold text-xs tracking-wider uppercase block mb-1">Our Vision</span>
                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed" style={{ fontStyle: "italic" }}>
                        Leadership and excellence in providing various legal services and consultations professionally and staying at the forefront of trusted law firms locally, regionally, and internationally.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {settings.mission && (
                <div className="bg-[#0B1325] rounded-3xl p-8 text-white min-h-[280px] flex flex-col justify-between border border-[#C5A059]/10 shadow-xl">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-2xl font-bold font-arabic text-[#C5A059]">رسالتنا</h3>
                      <div className="flex-1 h-0.5 bg-[#C5A059]/30 relative"><div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#C5A059] rotate-45" /></div>
                    </div>
                    <p className="text-slate-200 text-sm md:text-base leading-relaxed font-arabic">{settings.mission}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Goals Section (أهدافنا) */}
      <section className="py-20 bg-[#F8FAFC]" style={{ borderTop: "1px solid rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-[#C5A059] font-bold text-sm uppercase tracking-widest mb-2 block font-arabic">
              رؤية مستقبلية
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1325] mb-4 font-arabic">
              أهدافنا
            </h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "مواكبة تطور الخدمات القانونية بما يتوافق مع رؤية السعودية 2030 م",
              "المحافظة على خصوصية العملاء وسرية بياناتهم",
              "توفير أفضل الحلول القانونية لمجموعة واسعة من المستفيدين داخل المملكة العربية السعودية وخارجها",
              "الالتزام الكامل بأخلاقيات مهنة المحاماة السامية",
              "تطوير شراكات استراتيجية مع عملائنا طويلة الأجل فهم شركاء النجاح"
            ].map((goal, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center flex-shrink-0 font-bold font-mono">
                  {idx + 1}
                </div>
                <p className="text-slate-700 text-sm md:text-base font-semibold leading-relaxed font-arabic text-right">
                  {goal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <span className="text-[#C5A059] font-bold text-sm uppercase tracking-widest mb-2 block font-arabic">
                فريق العمل
              </span>
              <h2 className="text-3xl font-bold text-[#0B1325] mb-4 font-arabic">
                فريقنا
              </h2>
              <div className="w-16 h-1 bg-[#C5A059] mx-auto rounded-full mb-6" />
              <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-medium font-arabic">
                نفتخر بطاقمنا المميز المكون من نخبة منتقاة من أفضل المحامين الممارسين والمستشارين والخبراء القانونيين في كافة المجالات القانونية، ذوي المؤهلات الأكاديمية العالية والمهارات المتنوعة والخبرات العملية التراكمية التي يضعونها في خدمة عملائنا والمشهود لهم بالمصداقية والأمانة والإخلاص والتفاني في العمل.
              </p>
            </div>

            <div className={`grid gap-8 max-w-6xl mx-auto ${
              teamMembers.length === 1
                ? "grid-cols-1 max-w-sm"
                : teamMembers.length === 2
                ? "grid-cols-1 md:grid-cols-2 max-w-2xl"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#C5A059]/40 transition-all flex flex-col items-center text-center group"
                >
                  {/* Photo */}
                  <div className="w-36 h-36 rounded-2xl mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#0B1325] to-[#1A253C] flex items-center justify-center text-[#C5A059] font-bold text-5xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-[#0B1325] mb-2 font-arabic">
                    {member.name}
                  </h3>

                  {/* Title Badge */}
                  <span className="px-5 py-1.5 rounded-full text-sm font-semibold bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 mb-4">
                    {member.title}
                  </span>

                  {/* Specialization */}
                  {member.specialization && (
                    <p className="text-sm text-gray-500 leading-relaxed font-arabic">
                      {member.specialization}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {aboutValues.length > 0 && (
        <section className="py-20 bg-[#0B1325]" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="container mx-auto px-6 max-w-6xl">
            <span className="text-[#C5A059] font-bold text-sm uppercase tracking-widest mb-2 block text-center font-arabic">
              مبادئنا المهنية
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14 font-arabic">قيمنا</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutValues.map((v, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all duration-300">
                  <div className="text-[#C5A059] mx-auto mb-4 flex justify-center">{valueIcons[i % valueIcons.length]}</div>
                  <h3 className="text-lg font-bold text-white mb-3 font-arabic">{v.title}</h3>
                  <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#0B1325] mb-4 font-arabic">هل تريد التواصل معنا؟</h2>
          <p className="text-gray-600 mb-8 text-lg font-arabic">تواصل معنا اليوم للحصول على استشارتك القانونية</p>
          <Link href="/contact">
            <button className="btn-gold px-8 py-3.5 inline-flex items-center gap-2 transform hover:scale-105 transition-all duration-300">
              <Users className="w-5 h-5" />
              <span className="font-bold text-sm">تواصل معنا الآن</span>
            </button>
          </Link>
        </div>
      </section>
    </>
  );
}
