import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import { useState, useEffect } from "react";

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const loadServices = () => {
      const saved = localStorage.getItem("services");
      if (saved) {
        setServices(JSON.parse(saved));
      }
    };

    loadServices();

    window.addEventListener("storage", loadServices);
    const interval = setInterval(loadServices, 1000);

    return () => {
      window.removeEventListener("storage", loadServices);
      clearInterval(interval);
    };
  }, []);

  if (services.length === 0) {
    return (
      <section id="services" className="py-24 px-6 bg-white text-center">
        <h2 className="text-4xl font-serif">Услуги скоро появятся</h2>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="services" className="py-24 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-1/2 -right-24 w-96 h-96 bg-accent/30 rounded-full blur-[100px] -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary font-bold tracking-widest uppercase text-sm"
          >
            Наши услуги
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold"
          >
            Искусство преображения
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Мы объединили лучшие технологии и мастерство экспертов, чтобы вы получили безупречный результат.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div 
              key={service.id || index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-background rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-muted"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={service.image || "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=800"} 
                  alt={service.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                  {service.description || "Профессиональная услуга высшего уровня"}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-muted">
                  <div className="text-xs text-muted-foreground font-medium">
                    <p className="text-foreground font-bold text-base">
                      {service.price ? `${service.price} ₽` : "от 2 000 ₽"}
                    </p>
                    <p>{service.duration ? `${service.duration} мин` : "60 мин"}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary hover:text-white" asChild>
                    <a href="#booking">Выбрать</a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}