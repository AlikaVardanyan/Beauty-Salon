import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-6">
     
      <div className="absolute top-0 left-0 w-full h-full -z-10 bg-beauty-gradient opacity-50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[100px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1.1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-accent rounded-full blur-[120px]"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase">
            <Sparkles size={14} />
            Премиальный сервис
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1]">
            Онлайн-бронирование <br />
            <span className="text-primary italic">бьюти-услуг</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
            Почувствуйте заботу о себе в руках профессионалов. Запишитесь на процедуру
            в пару кликов и наслаждайтесь преображением.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
             size="lg" 
             className="relative z-50 rounded-full ... " 
             asChild
>
              <a href="#booking">Забронировать сейчас</a>
              </Button>
            <Button size="lg" variant="outline" className="rounded-full text-lg px-10 h-14 bg-background/50 backdrop-blur-sm hover:bg-background transition-all" asChild>
              <a href="#services">Наши услуги</a>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-8">
            <div className="flex -space-x-4">
              {[
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100",
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100"
              ].map((url, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-background overflow-hidden">
                  <img src={url} alt="Client" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm">
              <span className="font-bold">2,500+</span> счастливых клиентов <br />
              <span className="text-primary">★★★★★</span> (4.9/5 рейтинг)
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] border-8 border-white/50">
            <img
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=1000"
              alt="Beauty Salon"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -left-10 z-20 bg-white p-6 rounded-2xl shadow-xl hidden md:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">98%</div>
              <div className="text-sm">
                <p className="font-bold">Довольных клиентов</p>
                <p className="text-muted-foreground">Результат гарантирован</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-10 -right-10 z-20 bg-white p-6 rounded-2xl shadow-xl hidden md:block"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <Sparkles size={24} />
              </div>
              <div className="text-sm">
                <p className="font-bold">Топ мастера</p>
                <p className="text-muted-foreground">Эксперты индустрии</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
