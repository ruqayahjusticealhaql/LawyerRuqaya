import { Star } from "lucide-react";

const placeholders = [
  { clientName: "أ. محمد العمري", rating: 5, content: "خدمة ممتازة واحترافية عالية. المحامية رقية أنهت قضيتي العمالية بنجاح كبير وفي وقت قياسي." },
  { clientName: "أم سارة", rating: 5, content: "أنصح بالتعامل مع مكتب المحامية رقية عبدالرحمن. تعاملت معي بكل احترام وشرحت لي كل خطوة بوضوح." },
  { clientName: "شركة الفجر التجارية", rating: 5, content: "وكّلنا الشركة في نزاع تجاري معقد وانتهى بأحسن نتيجة. شكراً على المجهود الكبير." },
];

export default async function ReviewsSection() {
  let reviews: { clientName: string; rating: number; content: string }[] = [];

  try {
    const { prisma } = await import("@/lib/prisma");
    const dbReviews = await prisma.review.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    if (dbReviews.length > 0) {
      reviews = dbReviews;
    } else {
      reviews = placeholders;
    }
  } catch {
    reviews = placeholders;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-primary-700 text-center mb-14">آراء عملائنا</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">"{r.content}"</p>
              <p className="font-bold text-primary-700">{r.clientName}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
