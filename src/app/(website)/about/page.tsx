import { Scale, Award, Users, Shield, Lock, CheckCircle, Eye, Rocket } from "lucide-react";
import PageHero from "@/components/website/PageHero";
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
    <Shield key="sh" className="w-7 h-7" />,
    <Eye key="e" className="w-7 h-7" />,
    <Award key="a" className="w-7 h-7" />,
    <Lock key="l" className="w-7 h-7" />,
    <CheckCircle key="c" className="w-7 h-7" />,
    <Scale key="s" className="w-7 h-7" />,
    <Rocket key="r" className="w-7 h-7" />,
    <Users key="u" className="w-7 h-7" />,
  ];

  return (
    <>
      <PageHero
        title="من نحن"
      />

      {/* ── ABOUT + IMAGE ── */}
      <section className="relative bg-white py-24 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Image side */}
            <div className="relative flex justify-center order-2 lg:order-1">
              {/* Floating gold frame behind */}
              <div className="absolute w-[340px] h-[420px] rounded-[48px] border border-[#C5A059]/30 top-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-0" style={{ background: "linear-gradient(145deg, rgba(197,160,89,0.06) 0%, transparent 100%)" }} />
              {/* Main image */}
              <div className="relative w-[300px] h-[380px] md:w-[340px] md:h-[420px] rounded-[40px] overflow-hidden shadow-2xl border-2 border-white">
                <img
                  src="/images/about-team.jpg"
                  alt="فريق شركة رقية عبدالرحمن"
                  className="w-full h-full object-cover"
                />
                {/* Overlay gradient at bottom */}
                <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0B1325]/60 to-transparent" />
                <div className="absolute bottom-4 right-0 left-0 text-center">
                  <span className="text-white text-sm font-bold font-arabic">فريق متخصص ومتكامل</span>
                </div>
              </div>
              {/* Small badge */}
              <div className="absolute -bottom-4 -right-2 lg:right-4 bg-[#C5A059] text-white rounded-2xl px-4 py-3 shadow-lg text-center">
                <div className="text-2xl font-black">5</div>
                <div className="text-xs font-bold opacity-90 font-arabic">سنوات خبرة</div>
              </div>
            </div>

            {/* Text side */}
            <div className="order-1 lg:order-2 text-right" dir="rtl">
              <span className="inline-block text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] mb-3 font-arabic">نبذة عنا</span>
              <div className="w-10 h-0.5 bg-[#C5A059] mb-6 mr-0" />
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1325] mb-6 leading-snug font-arabic">
                شريكك القانوني <br />
                <span style={{ color: "#C5A059" }}>الموثوق والمتخصص</span>
              </h2>
              <p className="text-slate-600 text-base leading-loose mb-8 font-arabic">{settings.aboutText}</p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                {[
                  { num: "+500", label: "قضية ناجحة" },
                  { num: "5", label: "سنوات خبرة" },
                  { num: "5", label: "محامٍ متخصص" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black text-[#C5A059]">{s.num}</div>
                    <div className="text-xs text-slate-500 font-semibold font-arabic mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── VISION & MISSION ── */}
      {(settings.vision || settings.mission) && (
        <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0B1325 0%, #0F1E3A 100%)" }}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(#C5A059 1px, transparent 1px), linear-gradient(90deg, #C5A059 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <div className="text-center mb-14">
              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] font-arabic">توجهنا الاستراتيجي</span>
              <h2 className="text-3xl font-extrabold text-white mt-2 font-arabic">رؤيتنا ورسالتنا</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
              {settings.vision && (
                <div className="rounded-2xl p-7" style={{ background: "#111A2E" }}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-2 h-2 rotate-45 bg-[#C5A059] flex-shrink-0" />
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <div className="h-px bg-[#C5A059]/30 flex-1" />
                      <h3 className="text-lg font-bold text-[#C5A059] font-arabic whitespace-nowrap">رؤيتنا</h3>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-loose text-sm font-arabic text-right">{settings.vision}</p>
                </div>
              )}
              {settings.mission && (
                <div className="rounded-2xl p-7" style={{ background: "#111A2E" }}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-2 h-2 rotate-45 bg-[#C5A059] flex-shrink-0" />
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <div className="h-px bg-[#C5A059]/30 flex-1" />
                      <h3 className="text-lg font-bold text-[#C5A059] font-arabic whitespace-nowrap">رسالتنا</h3>
                    </div>
                  </div>
                  <p className="text-slate-300 leading-loose text-sm font-arabic text-right">{settings.mission}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── GOALS ── */}
      <section className="py-24 relative overflow-hidden bg-[#F8FAFC]">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" />
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-14">
            <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] font-arabic">رؤية مستقبلية</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1325] mt-2 mb-4 font-arabic">أهدافنا</h2>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-px bg-[#C5A059]/40" />
              <div className="w-2 h-2 rotate-45 bg-[#C5A059]" />
              <div className="w-12 h-px bg-[#C5A059]/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto" dir="rtl">
            {[
              "مواكبة تطور الخدمات القانونية بما يتوافق مع رؤية السعودية 2030 م",
              "المحافظة على خصوصية العملاء وسرية بياناتهم",
              "توفير أفضل الحلول القانونية لمجموعة واسعة من المستفيدين داخل المملكة العربية السعودية وخارجها",
              "الالتزام الكامل بأخلاقيات مهنة المحاماة السامية",
              "تطوير شراكات استراتيجية مع عملائنا طويلة الأجل فهم شركاء النجاح",
            ].map((goal, idx) => (
              <div key={idx} className="group flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-[#C5A059]/40 hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-sm transition-all duration-300 group-hover:scale-110"
                  style={{ background: "linear-gradient(135deg, #C5A059, #E6B980)", color: "#0B1325" }}>
                  {idx + 1}
                </div>
                <p className="text-slate-700 text-sm md:text-base font-semibold leading-relaxed font-arabic pt-1">{goal}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      {teamMembers.length > 0 && (
        <section className="py-24 relative overflow-hidden bg-white">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent" />
          {/* Subtle dot pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#0B1325 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] font-arabic">الكادر المتخصص</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1325] mt-2 mb-4 font-arabic">فريقنا القانوني</h2>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-px bg-[#C5A059]/40" />
                <div className="w-2 h-2 rotate-45 bg-[#C5A059]" />
                <div className="w-12 h-px bg-[#C5A059]/40" />
              </div>
              <p className="text-slate-500 max-w-xl mx-auto text-sm leading-loose font-arabic">
                نخبة من أفضل المحامين والمستشارين القانونيين ذوي الكفاءة والخبرة العالية
              </p>
            </div>

            {/* Director — first member, displayed prominently alone */}
            {teamMembers[0] && (
              <div className="flex justify-center mb-12">
                <div className="group flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    {/* Gold ring */}
                    <div className="absolute -inset-1.5 rounded-3xl opacity-60 group-hover:opacity-100 transition-all duration-300"
                      style={{ background: "linear-gradient(135deg, #C5A059, #E6B980, #C5A059)" }} />
                    <div className="relative w-44 h-52 rounded-3xl overflow-hidden shadow-2xl">
                      {teamMembers[0].photoUrl ? (
                        <img src={teamMembers[0].photoUrl} alt={teamMembers[0].name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C5A059] font-bold text-5xl"
                          style={{ background: "linear-gradient(135deg, #0B1325, #1A253C)" }}>
                          {teamMembers[0].name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0B1325]/80 to-transparent" />
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap shadow-lg"
                      style={{ background: "linear-gradient(135deg, #C5A059, #E6B980)" }}>
                      المؤسسة والرئيسة التنفيذية
                    </div>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#0B1325] font-arabic mt-3">{teamMembers[0].name}</h3>
                </div>
              </div>
            )}

            {/* Divider */}
            {teamMembers.length > 1 && (
              <div className="flex items-center gap-4 max-w-md mx-auto mb-10">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-arabic font-semibold whitespace-nowrap">فريق المحامين</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            )}

            {/* Rest of team */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[...teamMembers.slice(1)].sort((a, b) =>
                a.name.includes("حصة") || a.name.includes("حصه") ? 1 : b.name.includes("حصة") || b.name.includes("حصه") ? -1 : 0
              ).map((member, idx) => (
                <div key={idx} className="group flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-2xl scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ background: "linear-gradient(135deg, #C5A059, #E6B980)", borderRadius: "18px" }} />
                    <div className="relative w-32 h-36 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C5A059] font-bold text-4xl"
                          style={{ background: "linear-gradient(135deg, #0B1325, #1A253C)" }}>
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-[#0B1325]/80 to-transparent" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1325] font-arabic">{member.name}</h3>
                  <p className="text-xs text-[#C5A059] font-semibold font-arabic mt-0.5">{member.title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── VALUES ── */}
      {aboutValues.length > 0 && (
        <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #040812 0%, #0B1325 60%, #0F1E3A 100%)" }}>
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#C5A059 1px, transparent 1px), linear-gradient(90deg, #C5A059 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }} />

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <span className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.25em] font-arabic">مبادئنا المهنية</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 font-arabic">قيمنا</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {aboutValues.map((v, i) => (
                <div key={i} className="group relative rounded-2xl p-6 text-center border border-white/8 hover:border-[#C5A059]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "radial-gradient(circle at 50% 0%, rgba(197,160,89,0.08) 0%, transparent 70%)" }} />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-[#C5A059]/20 group-hover:border-[#C5A059]/50 transition-all duration-300"
                      style={{ background: "rgba(197,160,89,0.08)" }}>
                      <span className="text-[#C5A059]">{valueIcons[i % valueIcons.length]}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 font-arabic">{v.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-arabic">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(#C5A059 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #C5A059, #E6B980)" }}>
              <Scale className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0B1325] mb-3 font-arabic">هل تريد التواصل معنا؟</h2>
            <p className="text-slate-500 mb-8 font-arabic leading-relaxed">تواصل معنا اليوم للحصول على استشارتك القانونية المتخصصة</p>
            <Link href="/contact">
              <button className="btn-gold px-10 py-4 inline-flex items-center gap-3 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-[#C5A059]/20 rounded-2xl">
                <Users className="w-5 h-5" />
                <span className="font-bold font-arabic">تواصل معنا الآن</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
