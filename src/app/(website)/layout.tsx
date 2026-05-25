import WebsiteHeader from "@/components/website/Header";
import WebsiteFooter from "@/components/website/Footer";
import FloatingContactButtons from "@/components/website/WhatsAppButton";
import LoadingScreen from "@/components/website/LoadingScreen";
import { getCmsData } from "@/lib/cms";

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getCmsData();
  return (
    <>
      <LoadingScreen />
      <WebsiteHeader phone={settings.phone} />
      <main className="min-h-screen" style={{ background: "#0B1325" }}>{children}</main>
      <WebsiteFooter settings={settings} />
      <FloatingContactButtons settings={settings} />
    </>
  );
}
