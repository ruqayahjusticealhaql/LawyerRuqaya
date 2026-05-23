import type { Metadata } from "next";
import "./globals.css";
import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic", "latin"], weight: ["400", "500", "700"] });
const ibmPlex = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "700"], variable: "--font-ibm-plex" });

export const metadata: Metadata = {
  title: "مكتب المحامية رقية عبدالرحمن",
  description: "شركة قانونية متخصصة في تقديم الاستشارات والخدمات القانونية والمرافعة أمام كافة الجهات القضائية",
  keywords: "محاماة, شركة محاماة, استشارات قانونية, قضايا عمالية, أحوال شخصية, السعودية",
};

import { getSettings } from "@/lib/cms";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = getSettings();

  return (
    <html lang="ar" dir="rtl" className={ibmPlex.variable}>
      <body className={`${cairo.className} antialiased`}>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --gold-500: ${theme.primaryColor};
            --gold-400: ${theme.primaryColor}cc;
            --gold-600: ${theme.primaryColor}e6;
            --navy-200: ${theme.secondaryColor};
            --navy-950: ${theme.secondaryColor};
          }
        `}} />
        {children}
      </body>
    </html>
  );
}
