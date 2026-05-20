"use client";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowLeft, Instagram, Twitter, MessageSquare, Shield, Linkedin } from "lucide-react";
import type { CmsSettings } from "@/lib/cms";

export default function WebsiteFooter({ settings }: { settings: CmsSettings }) {
  const {
    phone, email, address, instagramUrl, twitterUrl, linkedinUrl,
    footerAboutText, companyReg, siteName, whatsapp,
  } = settings;

  return (
    <footer
      style={{ background: "#0B1325", borderTop: "1px solid rgba(255,255,255,0.05)", fontFamily: "var(--font-ibm-plex), sans-serif" }}
      className="text-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-right">

          {/* Brand */}
          <div className="md:col-span-2 flex flex-col items-start space-y-4">
            <div className="flex justify-start w-full">
              <img src="/images/logo.png" alt="الشعار" className="h-20 object-contain -mr-10" />
            </div>
            <p className="text-sm leading-relaxed max-w-md text-slate-300">
              {footerAboutText || "نحن نقف إلى جانب عملائنا بالثقة والنزاهة - ونقدم إرشادات قانونية واضحة وعملية مدعومة بسنوات من الخبرة القضائية."}
            </p>
            <div className="flex gap-3 justify-start w-full">
              <a
                href={instagramUrl || "#"}
                target={instagramUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="bg-[#0B1325] border border-white/10 p-2 rounded-lg hover:bg-[#C5A059] transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href={linkedinUrl || "#"}
                target={linkedinUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="bg-[#0B1325] border border-white/10 p-2 rounded-lg hover:bg-[#C5A059] transition-colors"
              >
                <Linkedin size={16} />
              </a>
              <a
                href={twitterUrl || "#"}
                target={twitterUrl ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="bg-[#0B1325] border border-white/10 p-2 rounded-lg hover:bg-[#C5A059] transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0B1325] border border-white/10 p-2 rounded-lg hover:bg-[#C5A059] transition-colors"
              >
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-start space-y-4">
            <div className="w-full">
              <h3 className="font-bold text-lg text-[#C5A059] mb-1">روابط مفيدة</h3>
              <div className="w-12 h-[1px] bg-[#C5A059] mr-0 ml-auto" />
            </div>
            <ul className="space-y-3 w-full">
              {[
                { href: "/about",    label: "من نحن" },
                { href: "/services", label: "الخدمات" },
                { href: "/contact",  label: "اتصل بنا" },
                { href: "/contact",  label: "حجز موعد" },
              ].map((link) => (
                <li key={link.label} className="text-right w-full">
                  <Link href={link.href} className="text-sm flex items-center justify-start gap-2 transition-colors group text-slate-300 hover:text-[#C5A059]">
                    <span>{link.label}</span>
                    <ArrowLeft className="w-3 h-3 rotate-180 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-start space-y-4">
            <div className="w-full">
              <h3 className="font-bold text-lg text-[#C5A059] mb-1">اتصل بنا</h3>
              <div className="w-12 h-[1px] bg-[#C5A059] mr-0 ml-auto" />
            </div>
            <div className="space-y-4 text-sm text-slate-300 w-full">
              {address && (
                <div className="flex items-center justify-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span>{address}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center justify-start gap-3">
                  <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <a href={`mailto:${email}`} dir="ltr" className="hover:text-[#C5A059] transition-colors">{email}</a>
                </div>
              )}
              {companyReg && (
                <div className="flex items-center justify-start gap-3">
                  <Shield className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                  <span>س.ت: {companyReg}</span>
                </div>
              )}
              {phone && (
                <div className="flex items-start justify-start gap-3">
                  <Phone className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr" className="hover:text-[#C5A059] transition-colors">{phone}</a>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p>© {new Date().getFullYear()} {siteName} - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
