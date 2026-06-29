import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function Masters() {
  const [masters, setMasters] = useState<any[]>([]);

  useEffect(() => {
    const loadMasters = () => {
      const saved = localStorage.getItem("masters");
      if (saved) {
        setMasters(JSON.parse(saved));
      }
    };

    loadMasters();

    // Обновление при изменениях из админки
    window.addEventListener("storage", loadMasters);
    const interval = setInterval(loadMasters, 1500);

    return () => {
      window.removeEventListener("storage", loadMasters);
      clearInterval(interval);
    };
  }, []);

  // Если мастеров нет
  if (masters.length === 0) {
    return (
      <section id="masters" className="py-24 px-6 bg-beauty-gradient text-center">
        <h2 className="text-4xl font-serif font-bold">Наши мастера скоро появятся</h2>
      </section>
    );
  }

  return (
    <section id="masters" className="py-24 px-6 bg-beauty-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl space-y-4">
            <p className="text-primary font-bold tracking-widest uppercase text-sm">Команда экспертов</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Встречайте наших мастеров</h2>
            <p className="text-muted-foreground">
              Наши специалисты постоянно повышают квалификацию и следят за мировыми трендами.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {masters.map((master, index) => (
            <motion.div 
              key={master.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-md transition-shadow group-hover:shadow-xl">
                <img 
                  src={master.image || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=800"} 
                  alt={master.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white text-xs mt-1">Отзывы</p>
                </div>
              </div>
              <h3 className="text-xl font-bold">{master.name}</h3>
              <p className="text-primary font-medium text-sm">{master.specialty || master.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}