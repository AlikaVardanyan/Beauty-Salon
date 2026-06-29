import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Татьяна О.",
    service: "Окрашивание волос",
    text: "Самый лучший салон в городе! Анна — настоящий профессионал, цвет получился именно такой, как я хотела. Атмосфера очень уютная.",
    rating: 5
  },
  {
    name: "Елена К.",
    service: "Маникюр",
    text: "Делала маникюр с покрытием, держится уже 3 недели идеально. Спасибо мастеру Марии за аккуратность и выбор цвета.",
    rating: 5
  },
  {
    name: "Анастасия М.",
    service: "Чистка лица",
    text: "После процедуры кожа сияет! Косметолог Елена очень подробно рассказала про домашний уход. Обязательно вернусь снова.",
    rating: 5
  },
  {
    name: "Ольга С.",
    service: "SPA-процедуры",
    text: "Настоящий релакс! Массаж был потрясающим, музыка и ароматы помогают полностью отключиться от городской суеты.",
    rating: 4
  }
];

export default function Reviews() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section id="reviews" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-bold tracking-widest uppercase text-sm">Отзывы</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold">Что говорят клиенты</h2>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background border border-muted p-10 rounded-[40px] h-full relative group"
                >
                  <Quote className="absolute top-8 right-8 text-primary/10 group-hover:text-primary/20 transition-colors" size={60} />
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed mb-8 italic">"{review.text}"</p>
                  <div>
                    <p className="font-bold text-lg">{review.name}</p>
                    <p className="text-primary text-sm font-medium">{review.service}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
