import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, HelpCircle, Sparkles, Scissors, Wand2, Heart } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  Scissors: <Scissors className="w-6 h-6" />,
  Wand2: <Wand2 className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
};


const initialServices = [
  {
    id: "1",
    title: "Маникюр и педикюр",
    price: "1 500",
    duration: "60-90 мин",
    iconName: "Sparkles",
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800"
  },
  {
    id: "2",
    title: "Парикмахерские услуги",
    price: "2 000",
    duration: "45-180 мин",
    iconName: "Scissors",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"
  },
  {
    id: "3",
    title: "Косметология",
    description: "Чистки, пилинги, уходовые процедуры и массаж лица для сияющей кожи.",
    price: "от 3 500 ₽",
    duration: "60-120 мин",
    iconName: "Wand2",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "4",
    title: "SPA и Массаж",
    description: "Полное расслабление и восстановление сил в уютной атмосфере нашего салона.",
    price: "от 2 500 ₽",
    duration: "60-120 мин",
    iconName: "Heart",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=800"
  }
];

export default function Services() {
  const [services, setServices] = useState([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshServices = () => {
    const saved = localStorage.getItem("services");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Если в админке есть услуги, показываем их
        if (Array.isArray(parsed) && parsed.length > 0) {
          setServices(parsed);
        } else {
          setServices(initialServices);
        }
      } catch (e) {
        setServices(initialServices);
      }
    } else {
      setServices(initialServices);
    }
  };

  useEffect(() => {
    refreshServices();
    window.addEventListener("servicesUpdated", refreshServices);
    window.addEventListener("storage", refreshServices);
    return () => {
      window.removeEventListener("servicesUpdated", refreshServices);
      window.removeEventListener("storage", refreshServices);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 400 : scrollLeft + 400;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-serif font-bold italic">Наши Услуги</h2>
            <div className="h-1 w-20 bg-primary rounded-full" />
          </div>

          {/* Стрелочки */}
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="p-3 rounded-full border hover:bg-black hover:text-white transition-all shadow-md">
              <ChevronLeft size={24} />
            </button>
            <button onClick={() => scroll("right")} className="p-3 rounded-full border hover:bg-black hover:text-white transition-all shadow-md">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Слайдер в ряд */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service: any) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="min-w-[320px] md:min-w-[380px] snap-start"
            >
              <div className="group relative rounded-[35px] overflow-hidden bg-slate-100 aspect-[3/4] shadow-xl border border-slate-200">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                
                {/* Градиент и контент снизу */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                  <div className="mb-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                     {iconMap[service.iconName] || <Sparkles size={20}/>}
                  </div>
                  <h3 className="text-2xl font-bold font-serif italic mb-1">{service.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold text-primary">{service.price} ₽</span>
                    <Button className="rounded-full bg-white text-black hover:bg-primary hover:text-white px-6">
                      Записаться
                    </Button>
                  </div>
                </div>
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