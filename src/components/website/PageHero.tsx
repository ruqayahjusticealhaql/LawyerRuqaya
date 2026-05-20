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
      className="relative text-white overflow-hidden"
      style={{ background: "#0B1325" }}
    >
      {/* Gold top line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-14">
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

    </section>
  );
}
