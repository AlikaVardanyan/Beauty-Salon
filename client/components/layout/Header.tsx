import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Scissors } from "lucide-react";

const navLinks = [
  { name: "Услуги", href: "#services" },
  { name: "Мастера", href: "#masters" },
  { name: "Отзывы", href: "#reviews" },
  { name: "Контакты", href: "#contacts" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Получаем данные из localStorage (из админки)
  const [logo, setLogo] = useState(() => localStorage.getItem("siteLogo"));
  const [siteName, setSiteName] = useState(() => localStorage.getItem("siteName") || "BEAUTY NOVA");

  // Следим за изменениями в localStorage (чтобы обновлялось сразу после изменений в админке)
  useEffect(() => {
    const handleStorageChange = () => {
      setLogo(localStorage.getItem("siteLogo"));
      setSiteName(localStorage.getItem("siteName") || "BEAUTY NOVA");
    };

    window.addEventListener("storage", handleStorageChange);
    // Для обновления в той же вкладке
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          {logo ? (
            <img 
              src={logo} 
              alt="logo" 
              className="w-10 h-10 object-contain transition-transform group-hover:scale-110" 
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
              <Scissors className="text-primary-foreground w-5 h-5" />
            </div>
          )}

          <span className="text-2xl font-serif font-bold tracking-tight">
            {siteName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          <Button asChild variant="default" className="rounded-full px-6">
            <a href="#booking">Забронировать</a>
          </Button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium py-2 border-b border-muted last:border-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button asChild className="w-full rounded-full mt-4">
              <a href="#booking" onClick={() => setIsMobileMenuOpen(false)}>
                Забронировать сейчас
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}