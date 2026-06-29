import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const initialMasters = [
  {
    id: "1",
    name: "Анна Соколова",
    role: "Топ-стилист",
    rating: 5.0,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "2",
    name: "Мария Иванова",
    role: "Мастер маникюра",
    rating: 4.9,
    reviews: 95,
    image: "https://c.pxhere.com/images/a0/ba/a7c5ab9316d820783e4284b3dbf4-1674976.jpg!d"
  },
  {
    id: "3",
    name: "Елена Петрова",
    role: "Косметолог",
    rating: 5.0,
    reviews: 210,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "4",
    name: "Дарья Волкова",
    role: "SPA-терапевт",
    rating: 4.8,
    reviews: 84,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Masters() {
  const [masters, setMasters] = useState([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshMasters = () => {
    const saved = localStorage.getItem("masters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMasters(Array.isArray(parsed) && parsed.length > 0 ? parsed : initialMasters);
      } catch { setMasters(initialMasters); }
    } else { setMasters(initialMasters); }
  };

  useEffect(() => {
    refreshMasters();
    window.addEventListener("storage", refreshMasters);
    window.addEventListener("mastersUpdated", refreshMasters);
    return () => {
      window.removeEventListener("storage", refreshMasters);
      window.removeEventListener("mastersUpdated", refreshMasters);
    };
  }, []);

  // Функция для работы стрелочек
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 350 : scrollLeft + 350;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="masters" className="py-24 px-6 bg-beauty-gradient overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Заголовок со стрелочками */}
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-xl space-y-4">
            <p className="text-primary font-bold tracking-widest uppercase text-sm">Команда экспертов</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Наши мастера</h2>
          </div>

          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="p-3 rounded-full border border-slate-200 bg-white/50 hover:bg-black hover:text-white transition-all shadow-md active:scale-90">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll("right")} className="p-3 rounded-full border border-slate-200 bg-white/50 hover:bg-black hover:text-white transition-all shadow-md active:scale-90">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Контейнер в ряд (Flex) */}
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {masters.map((master, index) => (
            <motion.div 
              key={master.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[280px] md:min-w-[320px] snap-start group"
            >
              {/* Твой оригинальный размер aspect-[3/4] */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-md transition-shadow group-hover:shadow-xl bg-slate-100">
                <img 
                  src={master.image || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800"} 
                  alt={master.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white text-xs mt-1">{master.reviews || 0} отзывов</p>
                </div>
              </div>

              <h3 className="text-xl font-bold">{master.name}</h3>
              <p className="text-primary font-medium text-sm">{master.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Star size={14} className="fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-bold">{master.rating || "5.0"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}