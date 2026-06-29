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
  
  const [salonName, setSalonName] = useState("BEAUTY NOVA");
  const [salonLogo, setSalonLogo] = useState("");

  const updateHeaderData = () => {
    const savedName = localStorage.getItem("salonName");
    const savedLogo = localStorage.getItem("salonLogo");

    if (savedName) setSalonName(savedName);
    
   
    if (!savedLogo || savedLogo === "null" || savedLogo === "" || savedLogo === undefined) {
      setSalonLogo(""); 
    } else {
      setSalonLogo(savedLogo);
    }
  };

  useEffect(() => {
    updateHeaderData();

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
 
    window.addEventListener("storage", updateHeaderData);
    window.addEventListener("settingsUpdated", updateHeaderData);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", updateHeaderData);
      window.removeEventListener("settingsUpdated", updateHeaderData);
    };
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4", 
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:scale-110 overflow-hidden shrink-0 shadow-sm">
            {salonLogo ? (
              <img src={salonLogo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Scissors className="text-white w-5 h-5" />
            )}
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight text-black">
            {salonName}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              {link.name}
            </a>
          ))}
          <Button asChild className="rounded-full px-6 bg-primary">
            <a href="#booking">Забронировать</a>
          </Button>
        </nav>

        <button className="md:hidden p-2 text-black" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-xl p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-lg font-medium py-2 border-b text-black" onClick={() => setIsMobileMenuOpen(false)}>
              {link.name}
            </a>
          ))}
          <Button asChild className="w-full bg-primary h-12 rounded-xl">
             <a href="#booking" onClick={() => setIsMobileMenuOpen(false)}>Забронировать</a>
          </Button>
        </div>
      )}
    </header>
  );
}