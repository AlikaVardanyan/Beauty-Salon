import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Scissors,
  Users,
  Calendar as CalendarIcon,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "masters" | "settings">("bookings");

  // Данные
  const [services, setServices] = useState<any[]>(() => 
    JSON.parse(localStorage.getItem("services") || "[]")
  );
  const [masters, setMasters] = useState<any[]>(() => 
    JSON.parse(localStorage.getItem("masters") || "[]")
  );
  const [bookings, setBookings] = useState<any[]>(() => 
    JSON.parse(localStorage.getItem("bookings") || "[]")
  );

  // Настройки
  const [logo, setLogo] = useState<string | null>(() => localStorage.getItem("siteLogo"));
  const [siteName, setSiteName] = useState<string>(() => localStorage.getItem("siteName") || "BEAUTY NOVA");

  // Автосохранение
  useEffect(() => { localStorage.setItem("services", JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem("masters", JSON.stringify(masters)); }, [masters]);
  useEffect(() => { localStorage.setItem("bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => {
    if (logo) localStorage.setItem("siteLogo", logo);
    else localStorage.removeItem("siteLogo");
  }, [logo]);
  useEffect(() => { localStorage.setItem("siteName", siteName); }, [siteName]);

  // Функции
  const addService = () => {
    const name = prompt("Название услуги:");
    if (!name) return;
    const price = Number(prompt("Цена (руб):", "2500"));
    const duration = Number(prompt("Длительность (мин):", "60"));
    setServices([...services, { id: Date.now(), name, price, duration }]);
  };

  const deleteService = (id: number) => {
    if (window.confirm("Удалить услугу?")) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const addMaster = () => {
    const name = prompt("Имя мастера:");
    if (!name) return;
    const specialty = prompt("Специальность:", "Стилист");
    setMasters([...masters, { id: Date.now(), name, specialty }]);
  };

  const deleteMaster = (id: number) => {
    if (window.confirm("Удалить мастера?")) {
      setMasters(masters.filter(m => m.id !== id));
    }
  };

  const deleteBooking = (id: number) => {
    if (window.confirm("Удалить это бронирование?")) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        setLogo(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    if (window.confirm("Удалить логотип?")) {
      setLogo(null);
    }
  };

  // Логин
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-beauty-gradient flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="rounded-[32px] shadow-2xl border-muted overflow-hidden">
            <CardHeader className="bg-primary p-8 text-center text-primary-foreground">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Scissors size={32} />
              </div>
              <CardTitle className="text-3xl font-serif">Админ-панель</CardTitle>
              <p className="text-primary-foreground/80 mt-2">Введите данные для входа</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Логин</label>
                  <Input placeholder="admin" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Пароль</label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl h-12" />
                </div>
              </div>
              <Button
                onClick={() => setIsLoggedIn(true)}
                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              >
                Войти в систему
              </Button>
              <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors">
                Вернуться на сайт
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-muted hidden md:flex flex-col bg-white">
        <div className="p-8 border-b border-muted">
          <Link to="/" className="flex items-center gap-2">
            {logo ? (
              <img src={logo} alt="logo" className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Scissors className="text-primary-foreground w-4 h-4" />
              </div>
            )}
            <span className="text-xl font-serif font-bold tracking-tight">{siteName}</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: "bookings", label: "Бронирования", icon: <CalendarIcon size={18} /> },
            { id: "services", label: "Услуги", icon: <Scissors size={18} /> },
            { id: "masters", label: "Мастера", icon: <Users size={18} /> },
            { id: "settings", label: "Настройки", icon: <Settings size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-muted">
          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col bg-muted/20">
        <header className="bg-white border-b border-muted h-20 px-8 flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold">
            {activeTab === "settings" && "Настройки системы"}
            {activeTab === "services" && "Управление услугами"}
            {activeTab === "masters" && "Управление мастерами"}
            {activeTab === "bookings" && "Бронирования"}
          </h2>
        </header>

        <div className="p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-bold">Добро пожаловать, Админ!</h3>
            <Button 
              onClick={() => {
                if (activeTab === "services") addService();
                else if (activeTab === "masters") addMaster();
              }}
              className="rounded-xl flex items-center gap-2"
            >
              <Plus size={18} />
              Добавить
            </Button>
          </div>

          <Card className="rounded-[32px] border-muted shadow-sm overflow-hidden">
            <div className="p-8">
              {activeTab === "settings" && (
                <div className="max-w-md space-y-8">
                  <h4 className="text-2xl font-bold">Настройки сайта</h4>
                  <div>
                    <label className="block text-sm font-bold mb-2">Название салона</label>
                    <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="rounded-xl h-12" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-3">Логотип</label>
                    {logo && <img src={logo} alt="logo" className="h-28 mb-4 border rounded-2xl p-3 bg-white" />}
                    <div className="flex gap-3">
                      <label className="cursor-pointer bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary/90">
                        <Upload size={20} />
                        Загрузить новый логотип
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                      {logo && <Button variant="destructive" onClick={removeLogo}>Удалить</Button>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div>
                  <h4 className="text-2xl font-bold mb-6">Услуги</h4>
                  <div className="space-y-4">
                    {services.map((s: any) => (
                      <div key={s.id} className="flex justify-between items-center p-5 bg-muted/50 rounded-2xl">
                        <div>
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-sm text-muted-foreground">{s.duration} мин • {s.price} ₽</p>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => deleteService(s.id)}>
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "masters" && (
                <div>
                  <h4 className="text-2xl font-bold mb-6">Мастера</h4>
                  <div className="space-y-4">
                    {masters.map((m: any) => (
                      <div key={m.id} className="flex justify-between items-center p-5 bg-muted/50 rounded-2xl">
                        <div>
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-sm text-muted-foreground">{m.specialty}</p>
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => deleteMaster(m.id)}>
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "bookings" && (
                <div>
                  <h4 className="text-2xl font-bold mb-6">Бронирования ({bookings.length})</h4>
                  {bookings.length === 0 ? (
                    <p className="text-center text-muted-foreground py-12">Пока нет бронирований</p>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking: any) => (
                        <div key={booking.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-muted/50 rounded-2xl gap-4">
                          <div>
                            <p className="font-bold text-lg">{booking.name}</p>
                            <p className="text-sm">{booking.service} • {booking.master}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.date), "d MMMM yyyy", { locale: ru })} в {booking.time}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {booking.phone} | {booking.email}
                            </p>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => deleteBooking(booking.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}