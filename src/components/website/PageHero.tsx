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
      className="relative text-white overflow-hidden rounded-b-[60px]"
      style={{ background: "#0B1325", height: "380px" }}
    >
      {/* Gold top line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-14">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-arabic leading-tight">
          {title}
        </h1>

        <img src="/images/header-banner.png" alt="" className="w-80 md:w-96 object-contain mb-10" />

        {subtitle && (
          <p className="text-slate-300 text-base max-w-xl mx-auto font-arabic leading-relaxed mt-2">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>

    </section>
  );
}
