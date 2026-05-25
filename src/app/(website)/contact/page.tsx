import { Phone, Mail, MapPin, Clock } from "lucide-react";
import PageHero from "@/components/website/PageHero";
import ContactForm from "@/components/website/ContactForm";
import { getCmsData } from "@/lib/cms";

export default async function ContactPage() {
  const { settings } = await getCmsData();

  const workHours: { day: string; hours: string }[] = (() => {
    try { return JSON.parse(settings.workHours || "[]"); } catch { return []; }
  })();

  const mapLat = settings.mapLat || "26.4333999";
  const mapLng = settings.mapLng || "50.117746";

  return (
    <>
      <PageHero
        title="تواصل معنا"
        subtitle="نحن هنا لمساعدتك، لا تتردد في التواصل معنا في أي وقت"
      />

      <section className="py-20 bg-gray-50 rounded-t-[60px]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {settings.phone && (
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="text-gold mt-1"><Phone className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-primary-700 mb-1">رقم الهاتف</h3>
                    <p className="text-gray-600" dir="ltr">{settings.phone}</p>
                  </div>
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="text-gold mt-1"><Mail className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-primary-700 mb-1">البريد الإلكتروني</h3>
                    <p className="text-gray-600" dir="ltr">{settings.email}</p>
                  </div>
                </a>
              )}
              {settings.address && (
                <a href={`https://maps.google.com/maps?q=${mapLat},${mapLng}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="text-gold mt-1"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <h3 className="font-bold text-primary-700 mb-1">العنوان</h3>
                    <p className="text-gray-600">{settings.address}</p>
                  </div>
                </a>
              )}

              {/* Work Hours */}
              {workHours.length > 0 && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-gold" />
                    <h3 className="font-bold text-primary-700">ساعات العمل</h3>
                  </div>
                  <div className="space-y-2">
                    {workHours.map((wh) => (
                      <div key={wh.day} className="flex justify-between text-sm">
                        <span className="text-gray-600">{wh.day}</span>
                        <span className={`font-semibold ${wh.hours === "مغلق" ? "text-red-500" : "text-primary-700"}`}>
                          {wh.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-primary-700 mb-6">أرسل رسالة</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200 h-[400px] relative">
            <iframe
              src={`https://maps.google.com/maps?q=${mapLat},${mapLng}&z=16&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع مكتب المحامية رقية عبدالرحمن"
            />
          </div>
        </div>
      </section>
    </>
  );
}
