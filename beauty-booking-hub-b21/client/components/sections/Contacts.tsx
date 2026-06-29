import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Contacts() {
  return (
    <section id="contacts" className="py-24 px-6 bg-beauty-gradient">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-primary font-bold tracking-widest uppercase text-sm">Контакты</p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold">Будем рады <br /> видеть вас</h2>
              <p className="text-muted-foreground text-lg">
                Мы находимся в самом центре города. Запишитесь заранее или просто заходите на чашку кофе и консультацию.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Адрес</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ул. Центральная, 123 <br />
                    Москва, 101000
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Телефон</h4>
                  <p className="text-sm text-muted-foreground">
                    +7 (999) 000-00-00 <br />
                    +7 (495) 000-00-00
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Режим работы</h4>
                  <p className="text-sm text-muted-foreground">
                    Пн-Вс: 09:00 — 21:00 <br />
                    Без выходных
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p className="text-sm text-muted-foreground">
                    hello@beautynova.ru <br />
                    pr@beautynova.ru
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 p-8 bg-white/50 backdrop-blur-sm rounded-[32px] border border-white/50">
              <p className="font-bold">Мы в соцсетях:</p>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-primary text-white rounded-full hover:scale-110 transition-transform">
                  <Instagram size={20} />
                </a>
                <a href="#" className="p-3 bg-primary text-white rounded-full hover:scale-110 transition-transform">
                  <Facebook size={20} />
                </a>
                <a href="#" className="p-3 bg-primary text-white rounded-full hover:scale-110 transition-transform">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[500px] rounded-[40px] overflow-hidden shadow-2xl border-8 border-white/50 relative"
          >
            {/* Real map integration would go here, using a placeholder image for now */}
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000"
              alt="Location Map"
              className="w-full h-full object-cover grayscale opacity-80"
            />
            <div className="absolute inset-0 bg-primary/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <MapPin className="text-white" size={32} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
