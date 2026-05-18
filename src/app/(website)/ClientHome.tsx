"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Aref_Ruqaa } from "next/font/google";
import {
  Scale,
  Shield,
  Users,
  FileText,
  Phone,
  ArrowRight,
  CheckCircle,
  Award,
  Briefcase,
  Heart,
  Lightbulb,
  Building,
  Handshake,
  Mail,
  Instagram,
  Twitter,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Lock,
  Star,
  Quote,
} from "lucide-react";

const arefFont = Aref_Ruqaa({ subsets: ["arabic"], weight: ["400", "700"] });

import type { CmsData } from "@/lib/cms";

export default function HomePage({ cmsData }: { cmsData: CmsData }) {
  const [activeHero, setActiveHero] = useState(0);

  // Use CMS sections for hero banners if available
  const cmsHeroSections = cmsData.sections.filter(s => s.type === "HERO_BANNER" && s.page === "home" && s.active);
  
  const default_hero_slides = [
    {
      layout: "centered",
      showLogo: true,
      title: "شركة رقية عبدالرحمن",
      subtitle: cmsData.settings.slogan || "ندافع عن حقك، لأنك تستحقه",
      desc: "خبرة واسعة في تقديم الاستشارات القانونية والشرعية وصياغة العقود وتمثيل موكلينا أمام جميع المحاكم والجهات القضائية.",
      img: "https://images.unsplash.com/photo-1453945619913-79ec89a82c51?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      buttons: [
        { text: "استكشف المزيد", link: "/services", style: "filled" },
      ],
    },
    {
      layout: "motto",
      topText: "رؤية نظامية راسخة",
      title: "العدالة والنزاهة والكفاءة",
      subtitle: "قيم نؤمن بها ونحميها",
      desc: "نسعى لتقديم حلول قانونية وقائية متكاملة للأفراد والشركات لحمايتها ودعم نموها المستقر وفق الأنظمة واللوائح المعمول بها في المملكة.",
      img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      buttons: [
        { text: "تواصل معنا", link: "/contact", style: "filled" },
      ],
    },
    {
      layout: "centered",
      showLogo: false,
      topText: "مستشاركم القانوني المعتمد",
      title: "صياغة العقود والاتفاقيات والتحكيم",
      desc: "نحمي التزاماتكم التجارية والشخصية بصياغة عقود قانونية محكمة وحل النزاعات وتسوية الخلافات القضائية بأعلى مستويات المهنية والسرية.",
      img: "/images/hero-slide-3.png",
      buttons: [
        { text: "احجز استشارتك الآن", link: "/contact", style: "filled" },
      ],
    }
  ];

  const hero_slides = cmsHeroSections.length > 0 
    ? cmsHeroSections.map(s => ({
        layout: "centered",
        showLogo: true,
        title: s.content.title || "",
        desc: s.content.desc || "",
        img: s.content.img || default_hero_slides[0].img,
        buttons: [{ text: s.content.btnText || "المزيد", link: s.content.btnLink || "/", style: "filled" }]
      }))
    : default_hero_slides;
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % hero_slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [hero_slides.length]);

  return (
    <div className="overflow-x-hidden bg-[#0B1325]">

      {/* ══════════ HERO SECTION (SLIDER) ══════════ */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {hero_slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeHero ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image (With slow zoom effect) */}
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[15000ms] ease-linear ${
                idx === activeHero ? "scale-110" : "scale-100"
              }`}
              style={{ backgroundImage: `url('${slide.img}')` }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className={`absolute inset-0 z-20 text-white px-4 max-w-5xl mx-auto flex flex-col items-center text-center justify-center transition-all duration-1000 ${
              idx === activeHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              
              {slide.layout === "motto" ? (
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                  <span className="text-white text-lg font-bold mb-4">
                    {slide.topText}
                  </span>
                  <div className="flex items-center gap-4 mb-6 w-full max-w-lg mx-auto">
                    <div className="flex-1 h-[2px] bg-white" />
                    <Scale size={32} className="text-[#C5A059] flex-shrink-0" />
                    <div className="flex-1 h-[2px] bg-white" />
                  </div>
                  <div className="mb-6 inline-block">
                    <h1 className="text-5xl md:text-6xl font-bold text-white">
                      {slide.title}
                    </h1>
                  </div>
                  <h2 className="text-xl md:text-2xl text-white font-bold mb-6">
                    {slide.subtitle}
                  </h2>
                  <p className="text-sm md:text-lg text-slate-200 mb-8 leading-relaxed font-medium">
                    {slide.desc}
                  </p>
                  <div>
                    <Link href={slide.buttons[0].link}>
                      <button className="px-10 py-3 font-bold text-base border-2 border-white text-white hover:bg-white hover:text-navy-900 rounded-md transition-all">
                        {slide.buttons[0].text}
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {slide.showLogo && (
                    <div className="mb-8 text-center mx-auto flex flex-col items-center">
                      <img 
                        src="/images/logo.png" 
                        alt="شعار شركة رقية عبدالرحمن"
                        className="w-64 md:w-80 h-auto object-contain mb-4"
                      />
                    </div>
                  )}
                  {slide.topText && (
                    <p className="text-[#C5A059] font-bold text-lg mb-4 tracking-wider">
                      {slide.topText}
                    </p>
                  )}
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl">
                    {slide.title}
                  </h1>
                  <p className="text-sm md:text-lg text-slate-200 max-w-3xl mb-10 leading-relaxed font-medium">
                    {slide.desc}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {slide.buttons.map((btn, bIdx) => (
                      <Link href={btn.link} key={bIdx}>
                        <button
                          className={`px-8 py-3 font-bold text-base rounded-md transition-all ${
                            btn.style === "filled"
                              ? "bg-[#C5A059] text-white hover:bg-[#B48F48]"
                              : "border-2 border-white text-white hover:bg-white hover:text-navy-900"
                          }`}
                        >
                          {btn.text}
                        </button>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Slider Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {hero_slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveHero(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === activeHero ? "w-8" : "bg-white/30 hover:bg-white/50"
              }`}
              style={idx === activeHero ? { background: "#C5A059" } : {}}
            />
          ))}
        </div>

        {/* Slider Arrows */}
        <button
          onClick={() => setActiveHero((prev) => (prev - 1 + hero_slides.length) % hero_slides.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-gray-500/50 hover:bg-gray-500/70 rounded-full flex items-center justify-center transition-all cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>

        <button
          onClick={() => setActiveHero((prev) => (prev + 1) % hero_slides.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-gray-500/50 hover:bg-gray-500/70 rounded-full flex items-center justify-center transition-all cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>

      {/* ══════════ SERVICES SECTION (MARQUEE) ══════════ */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 mb-12">
          {/* Header */}
          <div className="text-right">
            <h2 className="text-3xl font-bold text-[#0B1325] mb-2">أبرز الخدمات</h2>
            <div className="w-16 h-1 bg-[#C5A059] mr-0 ml-auto rounded-full" />
          </div>
        </div>

        {/* Marquee Animation Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .animate-scroll {
            display: flex;
            width: max-content;
            animation: scroll-left 40s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}} />

        {/* Scrolling Track */}
        <div className="w-full overflow-hidden" dir="ltr">
          <div className="animate-scroll gap-6 px-3">
            {(() => {
              const activeServices = cmsData.services.filter(s => s.active).sort((a, b) => a.order - b.order);
              const baseServices = activeServices.length > 0
                ? activeServices
                : [
                    { icon: null, title: "الاستشارات القانونية" },
                    { icon: null, title: "صياغة ومراجعة العقود" },
                    { icon: null, title: "التقاضي والمرافعة" },
                    { icon: null, title: "تأسيس الشركات" },
                    { icon: null, title: "قضايا الأحوال الشخصية" },
                    { icon: null, title: "العقود التجارية" },
                  ];
              const displayServices = [...baseServices, ...baseServices, ...baseServices];

              return displayServices.map((srv, idx) => (
              <Link 
                href="/services" 
                key={idx} 
                className="flex items-center gap-4 px-8 py-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#C5A059] transition-all cursor-pointer group min-w-max"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0B1325]/5 flex items-center justify-center text-[#C5A059] group-hover:scale-110 group-hover:bg-[#C5A059] group-hover:text-white transition-all">
                  {srv.icon && typeof srv.icon === 'string' ? <img src={srv.icon} className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
                </div>
                <span className="font-bold text-[#0B1325] text-lg font-arabic">{srv.title}</span>
              </Link>
            ));
            })()}
          </div>
        </div>
      </div>


      {/* ══════════ WHY CHOOSE US SECTION ══════════ */}
      <div className="relative py-24 bg-white overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
        />
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]" />

        <div className="container mx-auto px-4 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0B1325] mb-4">لماذا نحن؟</h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto rounded-full" />
          </div>

          {/* Grid of 4 Points */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center max-w-6xl mx-auto">

            {[
              {
                img: "/images/خبرة قانونية واسعة.png",
                title: "خبرة قانونية واسعة",
                desc: "معرفة عميقة وشاملة بالأنظمة القضائية في المملكة، لتقديم استشارات تحمي مصالحكم وتدعم استقرار أعمالكم.",
              },
              {
                img: "/images/تعامل احترافي وسري.png",
                title: "تعامل احترافي وسري",
                desc: "التزام مطلق بأعلى معايير الخصوصية والأمان لبياناتكم، والتعامل مع كل قضية بمسؤولية تامة واحترافية عالية.",
              },
              {
                img: "/images/خدمات متكاملة.png",
                title: "خدمات متكاملة",
                desc: "حلول قانونية شاملة تغطي الترافع القضائي، صياغة العقود، تقديم الاستشارات، وتأسيس الشركات لنكون مرجعكم الأول.",
              },
              {
                img: "/images/متابعة مستمرة لقضاياك.png",
                title: "متابعة مستمرة لقضاياك",
                desc: "نقف معكم خطوة بخطوة، ونوفر قنوات تواصل مباشرة لإطلاعكم على مستجدات الجلسات والمعاملات أولاً بأول.",
              },
            ].map((point, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-24 h-24 flex items-center justify-center mb-2 transition-transform group-hover:-translate-y-2 duration-300">
                  <img src={point.img} alt={point.title} className="w-20 h-20 object-contain" />
                </div>
                <h3 className="text-lg font-bold text-[#0B1325] mb-2">{point.title}</h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed">{point.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* ══════════ VISION & VALUES SECTION ══════════ */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-center">
            
            {/* Right Side: Text & Grid */}
            <div className="w-full lg:w-1/2 text-right">
              {/* Header */}
              <div className="flex items-center justify-end gap-4 mb-6">
                <div className="flex-1 h-[1px] bg-slate-800 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#0B1325] rotate-45" />
                </div>
                <h2 className="text-3xl font-bold text-[#C5A059] font-arabic">قيمنا</h2>
              </div>
              <p className="text-[#0B1325] text-xl font-bold leading-relaxed mb-10">
                قيم مهنية تشكّل أساس تعاملنا القانوني وتوجّه ممارستنا في جميع القضايا.
              </p>

              {/* Values Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "الأمانة", icon: <Shield size={20} /> },
                  { name: "الاحترافية", icon: <Award size={20} /> },
                  { name: "السرية", icon: <Lock size={20} /> },
                  { name: "العناية", icon: <Heart size={20} /> },
                  { name: "الإنجاز", icon: <CheckCircle size={20} /> },
                  { name: "النزاهة", icon: <Scale size={20} /> },
                ].map((val, idx) => (
                  <div key={idx} className="bg-[#EBEBE8] rounded-xl p-3 flex items-center justify-end gap-4 transition-all hover:bg-[#E0E0DB]">
                    <span className="font-bold text-[#0B1325] text-lg">{val.name}</span>
                    <div className="w-12 h-12 bg-[#1A1F2C] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      {val.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left Side: Image */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-xl h-[450px]">
                <img
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="قيمنا"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ══════════ TESTIMONIALS SECTION (MARQUEE) ══════════ */}
      <div className="py-24 bg-[#0B1325] relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10 mb-12">
          {/* Header */}
          <div className="text-center">
            <span className="text-[#C5A059] font-bold text-sm uppercase tracking-widest mb-2 block">
              آراء وتجارب
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-arabic">
              ماذا قال عملاؤنا عنا
            </h2>
            <div className="w-16 h-1 bg-[#C5A059] mx-auto rounded-full mb-4" />
            <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
              نعتز بثقة عملائنا وشركائنا، ونسعى دائماً لتقديم أعلى مستويات الدقة والتميز القانوني.
            </p>
          </div>
        </div>

        {/* Marquee Animation Styles for Testimonials */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll-left-testimonials {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .animate-scroll-testimonials {
            display: flex;
            width: max-content;
            animation: scroll-left-testimonials 60s linear infinite;
          }
          .animate-scroll-testimonials:hover {
            animation-play-state: paused;
          }
        `}} />

        {/* Scrolling Track */}
        <div className="w-full overflow-hidden" dir="ltr">
          <div className="animate-scroll-testimonials gap-6 px-3">
            {(() => {
              const testimonials = [
                {
                  name: "المهندس خالد السديري",
                  role: "الرئيس التنفيذي - شركة الحلول الذكية",
                  text: "دقة متناهية واحترافية عالية في صياغة العقود التجارية المعقدة. مكتب الأستاذة رقية كان شريكاً حقيقياً في حماية استثماراتنا وتوفير الأمان القانوني لأعمالنا.",
                  rating: 5,
                },
                {
                  name: "الأستاذة سارة الهاشمي",
                  role: "سيدة أعمال ومستثمرة",
                  text: "تلقيت استشارة قانونية متميزة وسريعة بخصوص تأسيس شركتنا الجديدة. الالتزام بالوقت والسرية المطلقة هما أكثر ما يميز هذا المكتب الراقي.",
                  rating: 5,
                },
                {
                  name: "أبو عبد الرحمن",
                  role: "عميل قضايا الأحوال الشخصية",
                  text: "ممتن جداً للجهود الكبيرة والتعامل الإنساني الراقي من كامل الفريق القضائي. المتابعة المستمرة وإطلاعي على مستجدات القضية أولاً بأول أراحني كثيراً.",
                  rating: 5,
                },
                {
                  name: "الدكتور فيصل العتيبي",
                  role: "مستشار تطوير أعمال",
                  text: "مكتب محاماة استثنائي بكل المقاييس. تعاملنا معهم في قضايا عمالية معقدة وكان التحضير للمذكرات القانونية والمرافعة أمام المحكمة مبنياً على أسس نظامية قوية أدت لكسب القضية.",
                  rating: 5,
                },
                {
                  name: "أ. مريم الدوسري",
                  role: "مديرة الموارد البشرية - مجموعة النخبة",
                  text: "الدقة والالتزام والخبرة القضائية العميقة هي عنوان هذا المكتب. التجاوب سريع جداً والاستشارات الوقائية المكتوبة حمت منشأتنا من نزاعات قضائية مكلفة.",
                  rating: 5,
                },
                {
                  name: "المهندس أحمد المطيري",
                  role: "مطور عقاري",
                  text: "أنصح بشدة بالتعامل مع شركة رقية عبدالرحمن للمحاماة في القضايا العقارية والنزاعات التعاقدية. خبرتهم باللوائح والأنظمة الجديدة ممتازة وحرصهم على مصلحة الموكل يفوق التوقعات.",
                  rating: 5,
                },
              ];
              const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];

              return displayTestimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#111A2E]/60 border border-slate-800/80 rounded-2xl p-8 relative flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-[#C5A059]/40 hover:bg-[#111A2E]/80 group w-[350px] md:w-[420px] shrink-0"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-6 left-6 text-[#C5A059]/10 group-hover:text-[#C5A059]/20 transition-colors duration-300">
                    <Quote size={40} className="transform -scale-x-100" />
                  </div>

                  <div>
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-6 justify-end" dir="rtl">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={16} className="text-[#C5A059] fill-[#C5A059]" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-slate-300 text-right text-base leading-relaxed mb-6 font-medium relative z-10 font-arabic" dir="rtl">
                      "{item.text}"
                    </p>
                  </div>

                  {/* Client Info */}
                  <div className="border-t border-slate-800/80 pt-6 mt-auto flex items-center justify-end gap-4" dir="rtl">
                    <div className="w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center text-[#C5A059] font-bold text-lg border border-[#C5A059]/20">
                      {item.name[0]}
                    </div>
                    <div className="text-right">
                      <h4 className="font-bold text-white text-base font-arabic">
                        {item.name}
                      </h4>
                      <span className="text-xs text-slate-400 block mt-0.5">
                        {item.role}
                      </span>
                    </div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

    </div>
  );
}
