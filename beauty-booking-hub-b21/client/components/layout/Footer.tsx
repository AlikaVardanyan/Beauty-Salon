import { Link } from "react-router-dom";
import { Scissors, Instagram, Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary/50 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Scissors className="text-primary-foreground w-4 h-4" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">
              BEAUTY<span className="text-primary">NOVA</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Ваш идеальный образ начинается здесь. Мы предлагаем премиальные бьюти-услуги
            в самом центре города. Позвольте себе быть прекрасной.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
              <Instagram size={18} />
            </a>
            <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
              <Facebook size={18} />
            </a>
            <a href="#" className="p-2 bg-background rounded-full hover:text-primary transition-colors shadow-sm">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif font-bold mb-6">Услуги</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><a href="#services" className="hover:text-primary transition-colors">Маникюр и педикюр</a></li>
            <li><a href="#services" className="hover:text-primary transition-colors">Парикмахерские услуги</a></li>
            <li><a href="#services" className="hover:text-primary transition-colors">Косметология</a></li>
            <li><a href="#services" className="hover:text-primary transition-colors">Массаж и SPA</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold mb-6">Навигация</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><a href="#services" className="hover:text-primary transition-colors">Услуги</a></li>
            <li><a href="#masters" className="hover:text-primary transition-colors">Наши мастера</a></li>
            <li><a href="#reviews" className="hover:text-primary transition-colors">Отзывы</a></li>
            <li><a href="/admin" className="hover:text-primary transition-colors">Панель администратора</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif font-bold mb-6">Контакты</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>ул. Центральная, 123, г. Москва</li>
            <li>+7 (999) 000-00-00</li>
            <li>hello@beautynova.ru</li>
            <li className="pt-2 font-medium text-foreground">Пн-Вс: 09:00 — 21:00</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-8 border-t border-border text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} BeautyNova Salon. Все права защищены.</p>
      </div>
    </footer>
  );
}
