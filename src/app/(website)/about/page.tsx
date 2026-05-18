import { Scale, Award, BookOpen, Users } from "lucide-react";
import Link from "next/link";
import { getCmsData } from "@/lib/cms";

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
    <Scale key="s" className="w-10 h-10" />,
    <Award key="a" className="w-10 h-10" />,
    <BookOpen key="b" className="w-10 h-10" />,
  ];

  return (
    <>
      {/* Header Banner */}
      <section className="relative bg-[#0B1325] py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={settings.aboutImage || "https://images.unsplash.com/photo-1453945619913-79ec89a82c51?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"}
            alt="من نحن"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1325]/80 to-[#0B1325]" />
        </div>
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
                    src={settings.aboutImage || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"}
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
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {settings.vision && (
                <div className="relative bg-[#0B1325] rounded-3xl overflow-hidden p-8 text-white min-h-[200px] flex flex-col justify-between group">
                  <div className="absolute inset-0 z-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1453945619913-79ec89a82c51?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Vision" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1325] via-transparent to-[#0B1325]/50 z-0" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-1 h-0.5 bg-white/30 relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45" /></div>
                      <h3 className="text-2xl font-bold font-arabic">رؤيتنا</h3>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">{settings.vision}</p>
                  </div>
                </div>
              )}
              {settings.mission && (
                <div className="relative bg-[#0B1325] rounded-3xl overflow-hidden p-8 text-white min-h-[200px] flex flex-col justify-between group">
                  <div className="absolute inset-0 z-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Mission" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1325] via-transparent to-[#0B1325]/50 z-0" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-2xl font-bold font-arabic">رسالتنا</h3>
                      <div className="flex-1 h-0.5 bg-white/30 relative"><div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45" /></div>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">{settings.mission}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-14">
              <span className="text-[#C5A059] font-bold text-sm uppercase tracking-widest mb-2 block">
                فريق العمل
              </span>
              <h2 className="text-3xl font-bold text-[#0B1325] mb-4 font-arabic">
                المحامون والمتخصصون
              </h2>
              <div className="w-16 h-1 bg-[#C5A059] mx-auto rounded-full" />
              <p className="text-gray-500 max-w-lg mx-auto mt-4 text-sm">
                نخبة من الكفاءات القانونية المتميزة الملتزمة بتقديم أعلى معايير العدالة والدقة القانونية.
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
                        className="w-full h-full object-cover"
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
                    <p className="text-sm text-gray-500 leading-relaxed">
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
        <section className="py-20 bg-primary-700">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-white text-center mb-14">قيمنا المهنية</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aboutValues.map((v, i) => (
                <div key={i} className="text-center p-6">
                  <div className="text-gold mx-auto mb-4 flex justify-center">{valueIcons[i % valueIcons.length]}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{v.title}</h3>
                  <p className="text-blue-200">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary-700 mb-4">هل تريد التواصل معنا؟</h2>
          <p className="text-gray-600 mb-8 text-lg">تواصل معنا اليوم للحصول على استشارتك القانونية</p>
          <Link href="/contact" className="btn-primary text-lg">
            <Users className="w-5 h-5 inline-block ml-2" />
            تواصل معنا
          </Link>
        </div>
      </section>
    </>
  );
}
