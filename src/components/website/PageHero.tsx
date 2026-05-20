import React from "react";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
}

export default function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section
      className="relative text-white overflow-visible"
      style={{
        background: "linear-gradient(135deg, #040812 0%, #0B1325 55%, #112040 100%)",
        paddingBottom: "80px",
      }}
    >
      {/* Gold grid */}
      <div
        className="absolute inset-0 opacity-[0.04] overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(#C5A059 1px, transparent 1px), linear-gradient(90deg, #C5A059 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow top-right */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }}
      />
      {/* Glow bottom-left */}
      <div
        className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C5A059 0%, transparent 70%)" }}
      />
      {/* Gold top line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-arabic leading-tight">
          {title}
        </h1>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-px bg-[#C5A059]/40" />
          <div className="w-2 h-2 rotate-45 bg-[#C5A059]" />
          <div className="w-10 h-px bg-[#C5A059]/40" />
        </div>

        {subtitle && (
          <p className="text-slate-300 text-base max-w-xl mx-auto font-arabic leading-relaxed">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>

      {/* Diagonal bottom edge */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "80px" }}
      >
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full">
          <polygon points="0,80 1440,0 1440,80" fill="white" />
        </svg>
      </div>
    </section>
  );
}
