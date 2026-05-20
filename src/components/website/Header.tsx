"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/",        label: "الرئيسية" },
  { href: "/about",   label: "من نحن" },
  { href: "/services",label: "الخدمات" },
  { href: "/blog",    label: "المدونة" },
  { href: "/contact", label: "تواصل معنا" },
];

export default function WebsiteHeader({ phone }: { phone?: string }) {
  const [isOpen, setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname              = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayPhone = phone || "0538225224";
  const telLink = `tel:${displayPhone.replace(/\s/g, "")}`;

  return (
    <header
      className="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: "rgba(11, 19, 37, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "10px 0",
      } : {
        background: "#C5A059",
        padding: "18px 0",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-transform group-hover:scale-105">
            <img
              src={scrolled ? "/images/الشعار الرئيسي اسود.png" : "/images/الشعار الرئيسي ابيض.png"}
              alt="شعار المكتب"
              className="h-12 w-auto object-contain transition-all duration-300"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={isActive ? {
                    background: scrolled ? "rgba(212,163,115,0.12)" : "rgba(11, 19, 37, 0.05)",
                    color: scrolled ? "#D4A373" : "#0B1325",
                    border: scrolled ? "1px solid rgba(212,163,115,0.2)" : "1px solid rgba(11, 19, 37, 0.15)",
                  } : {
                    color: scrolled ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.9)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = scrolled ? "#F8FAFC" : "#0B1325";
                      e.currentTarget.style.background = scrolled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = scrolled ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.9)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={telLink}
              className="flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: scrolled ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = scrolled ? "#D4A373" : "#0B1325")}
              onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)")}
            >
              <Phone className="w-4 h-4" />
              <span dir="ltr">{displayPhone}</span>
            </a>
            <Link href="/auth/login" className="btn-gold text-sm px-5 py-2">
              تسجيل الدخول
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-xl transition-all"
            style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.04)" }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div
            className="lg:hidden mt-4 rounded-2xl p-4 animate-scale-in"
            style={{
              background: "#1E293B",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-semibold transition-colors"
                    style={isActive ? { background: "rgba(212,163,115,0.12)", color: "#D4A373" } : { color: "rgba(255,255,255,0.55)" }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a href={telLink} className="px-4 py-3 rounded-xl text-sm font-semibold text-[#C5A059] flex items-center gap-2">
                <Phone className="w-4 h-4" /><span dir="ltr">{displayPhone}</span>
              </a>
              <div className="mt-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <Link href="/auth/login" onClick={() => setIsOpen(false)} className="btn-gold w-full text-sm justify-center">
                  تسجيل الدخول
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
