import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Quote, PlusCircle, CheckCircle2 } from "lucide-react";


const INITIAL_REVIEWS = [
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
  const [reviews, setReviews] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("my_salon_reviews");
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    }
    return INITIAL_REVIEWS;
  });


  useEffect(() => {
    localStorage.setItem("my_salon_reviews", JSON.stringify(reviews));
  }, [reviews]);


  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
  
  
  const [formData, setFormData] = useState({ name: "", service: "", text: "", rating: 5 });
  const [hover, setHover] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.text.trim()) return;

    const newReview = { ...formData };
    setReviews([newReview, ...reviews]); // Новый отзыв идет первым в списке
    
    setIsSubmitted(true);
    setFormData({ name: "", service: "", text: "", rating: 5 });
    setHover(0);

    setTimeout(() => setIsSubmitted(false), 3000);

    
    if (emblaApi) emblaApi.scrollTo(0);
  };

  return (
    <section id="reviews" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-bold tracking-widest uppercase text-sm">Отзывы</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Что говорят клиенты</h2>
        </div>

        
        <div className="overflow-hidden mb-20 cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-8">
            <AnimatePresence mode="popLayout">
              {reviews.map((review, index) => (
                <div key={index} className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_31%] min-w-0">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 border border-gray-100 p-10 rounded-[40px] h-full relative flex flex-col justify-between shadow-sm"
                  >
                    <Quote className="absolute top-8 right-8 text-black/5" size={60} />
                    
                    <div>
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"} 
                          />
                        ))}
                      </div>
                      <p className="text-lg leading-relaxed mb-8 italic text-gray-700">"{review.text}"</p>
                    </div>

                    <div>
                      <p className="font-bold text-lg text-gray-900">{review.name}</p>
                      <p className="text-primary text-sm font-medium">{review.service}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Форма */}
        <div className="max-w-2xl mx-auto bg-gray-50 p-8 md:p-12 rounded-[40px] border border-gray-200 shadow-sm relative overflow-hidden">
          
          <AnimatePresence>
            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gray-50/95 z-10 flex flex-col items-center justify-center text-center p-6"
              >
                <CheckCircle2 size={60} className="text-green-500 mb-4" />
                <h4 className="text-2xl font-bold">Опубликовано!</h4>
                <p className="text-gray-600">Ваш отзыв успешно добавлен в список.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <PlusCircle className="text-primary" /> Оставить отзыв
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-3">
              <span className="text-sm font-semibold text-gray-400 uppercase">Оценка</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star} type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={`transition-colors ${
                        star <= (hover || formData.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Имя"
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input 
                type="text" placeholder="Услуга"
                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white"
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
              />
            </div>

            <textarea 
              placeholder="Ваш отзыв..." rows={4}
              className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white resize-none"
              value={formData.text}
              onChange={(e) => setFormData({...formData, text: e.target.value})}
              required
            />

            <button 
              type="submit"
              className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/5"
            >
              Отправить отзыв
            </button>
          </form>
        </div>

      </div>    
    </section>
  );
}