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
  Upload,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "masters" | "settings">("bookings");

  const [services, setServices] = useState<any[]>(() => JSON.parse(localStorage.getItem("services") || "[]"));
  const [masters, setMasters] = useState<any[]>(() => JSON.parse(localStorage.getItem("masters") || "[]"));
  const [bookings, setBookings] = useState<any[]>(() => JSON.parse(localStorage.getItem("bookings") || "[]"));

  const [logo, setLogo] = useState<string | null>(() => localStorage.getItem("siteLogo"));
  const [siteName, setSiteName] = useState<string>(() => localStorage.getItem("siteName") || "BEAUTY NOVA");

  // Модальное окно
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"service" | "master" | "booking" | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);


  useEffect(() => { localStorage.setItem("services", JSON.stringify(services)); }, [services]);
  useEffect(() => { localStorage.setItem("masters", JSON.stringify(masters)); }, [masters]);
  useEffect(() => { localStorage.setItem("bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => {
    if (logo) localStorage.setItem("siteLogo", logo);
    else localStorage.removeItem("siteLogo");
  }, [logo]);
  useEffect(() => { localStorage.setItem("siteName", siteName); }, [siteName]);

  const openAddModal = (type: "service" | "master" | "booking") => {
    setModalType(type);
    setIsEditMode(false);
    if (type === "service") {
      setCurrentItem({ id: Date.now(), name: "", price: 2500, duration: 60, image: null });
    } else if (type === "master") {
      setCurrentItem({ id: Date.now(), name: "", specialty: "Стилист", photo: null });
    } else if (type === "booking") {
      setCurrentItem({
        id: Date.now(),
        name: "",
        phone: "",
        email: "",
        service: "",
        master: "",
        date: "",
        time: ""
      });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: any, type: "service" | "master" | "booking") => {
    setModalType(type);
    setIsEditMode(true);
    setCurrentItem({ ...item });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setCurrentItem((prev: any) => prev ? { ...prev, [field]: event.target.result } : null);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveItem = () => {
    if (!currentItem || !modalType) return;

    if (modalType === "service") {
      if (isEditMode) {
        setServices(prev => prev.map(s => s.id === currentItem.id ? currentItem : s));
      } else {
        setServices(prev => [...prev, currentItem]);
      }
    } else if (modalType === "master") {
      if (isEditMode) {
        setMasters(prev => prev.map(m => m.id === currentItem.id ? currentItem : m));
      } else {
        setMasters(prev => [...prev, currentItem]);
      }
    } else if (modalType === "booking") {
      if (isEditMode) {
        setBookings(prev => prev.map(b => b.id === currentItem.id ? currentItem : b));
      } else {
        setBookings(prev => [...prev, currentItem]);
      }
    }

  
    setTimeout(() => {
      setIsModalOpen(false);
      setCurrentItem(null);
      setModalType(null);
    }, 100);
  };

  const deleteService = (id: number) => {
    if (window.confirm("Удалить услугу?")) setServices(prev => prev.filter(s => s.id !== id));
  };

  const deleteMaster = (id: number) => {
    if (window.confirm("Удалить мастера?")) setMasters(prev => prev.filter(m => m.id !== id));
  };

  const deleteBooking = (id: number) => {
    if (window.confirm("Удалить это бронирование?")) setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") setLogo(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    if (window.confirm("Удалить логотип?")) setLogo(null);
  };


  const isModalReady = Boolean(currentItem && modalType);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-beauty-gradient flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
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
              <Button onClick={() => setIsLoggedIn(true)} className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
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
      {/* Sidebar и Main — без изменений */}
      <aside className="w-64 border-r border-muted hidden md:flex flex-col bg-white">
        <div className="p-8 border-b border-muted">
          <Link to="/" className="flex items-center gap-2">
            {logo ? <img src={logo} alt="logo" className="w-8 h-8 object-contain" /> : (
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
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={18} />
            Выйти
          </button>
        </div>
      </aside>

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
                if (activeTab === "services") openAddModal("service");
                else if (activeTab === "masters") openAddModal("master");
                else if (activeTab === "bookings") openAddModal("booking");
              }} 
              className="rounded-xl flex items-center gap-2"
            >
              <Plus size={18} />
              Добавить
            </Button>
          </div>

          <Card className="rounded-[32px] border-muted shadow-sm overflow-hidden">
            <div className="p-8">
       
              {activeTab === "services" && (
                <div>
                  <h4 className="text-2xl font-bold mb-6">Услуги</h4>
                  <div className="space-y-4">
                    {services.map((s: any) => (
                      <div key={s.id} className="flex gap-4 p-5 bg-muted/50 rounded-2xl items-center">
                        {s.image && <img src={s.image} alt={s.name} className="w-20 h-20 object-cover rounded-xl" />}
                        <div className="flex-1">
                          <p className="font-semibold">{s.name}</p>
                          <p className="text-sm text-muted-foreground">{s.duration} мин • {s.price} ₽</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditModal(s, "service")}>
                            <Pencil size={18} />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => deleteService(s.id)}>
                            <Trash2 size={18} />
                          </Button>
                        </div>
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
                      <div key={m.id} className="flex gap-4 p-5 bg-muted/50 rounded-2xl items-center">
                        {m.photo && <img src={m.photo} alt={m.name} className="w-20 h-20 object-cover rounded-full" />}
                        <div className="flex-1">
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-sm text-muted-foreground">{m.specialty}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" onClick={() => openEditModal(m, "master")}>
                            <Pencil size={18} />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => deleteMaster(m.id)}>
                            <Trash2 size={18} />
                          </Button>
                        </div>
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
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => openEditModal(booking, "booking")}>
                              <Pencil size={18} />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => deleteBooking(booking.id)}>
                              <Trash2 size={18} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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
            </div>
          </Card>
        </div>
      </main>


      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">
              {modalType === "service" && (isEditMode ? "Редактировать услугу" : "Добавить услугу")}
              {modalType === "master" && (isEditMode ? "Редактировать мастера" : "Добавить мастера")}
              {modalType === "booking" && (isEditMode ? "Редактировать бронирование" : "Новое бронирование")}
            </DialogTitle>
          </DialogHeader>

          {isModalReady && currentItem && (
            <div className="space-y-6 py-4">
              {modalType === "service" && (
                <>
                  <div>
                    <Label>Фото услуги</Label>
                    {currentItem.image && <img src={currentItem.image} alt="" className="mt-3 w-32 h-32 object-cover rounded-xl" />}
                    <label className="mt-3 cursor-pointer bg-primary text-white px-5 py-3 rounded-xl inline-flex items-center gap-2">
                      <Upload size={18} /> Загрузить фото
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "image")} />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input value={currentItem.name} onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Цена</Label>
                      <Input type="number" value={currentItem.price} onChange={(e) => setCurrentItem({...currentItem, price: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Длительность (мин)</Label>
                      <Input type="number" value={currentItem.duration} onChange={(e) => setCurrentItem({...currentItem, duration: Number(e.target.value)})} />
                    </div>
                  </div>
                </>
              )}

              {modalType === "master" && (
                <>
                  <div>
                    <Label>Фото мастера</Label>
                    {currentItem.photo && <img src={currentItem.photo} alt="" className="mt-3 w-32 h-32 object-cover rounded-full" />}
                    <label className="mt-3 cursor-pointer bg-primary text-white px-5 py-3 rounded-xl inline-flex items-center gap-2">
                      <Upload size={18} /> Загрузить фото
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "photo")} />
                    </label>
                  </div>
                  <div className="space-y-2">
                    <Label>Имя</Label>
                    <Input value={currentItem.name} onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Специальность</Label>
                    <Input value={currentItem.specialty} onChange={(e) => setCurrentItem({...currentItem, specialty: e.target.value})} />
                  </div>
                </>
              )}

              {modalType === "booking" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Имя клиента</Label>
                    <Input value={currentItem.name} onChange={(e) => setCurrentItem({...currentItem, name: e.target.value})} placeholder="Иван Иванов" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Телефон</Label>
                      <Input value={currentItem.phone} onChange={(e) => setCurrentItem({...currentItem, phone: e.target.value})} placeholder="+7 (___) ___-__-__" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={currentItem.email} onChange={(e) => setCurrentItem({...currentItem, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Услуга</Label>
                    <Input value={currentItem.service} onChange={(e) => setCurrentItem({...currentItem, service: e.target.value})} placeholder="Стрижка + окрашивание" />
                  </div>
                  <div className="space-y-2">
                    <Label>Мастер</Label>
                    <Input value={currentItem.master} onChange={(e) => setCurrentItem({...currentItem, master: e.target.value})} placeholder="Анна Смирнова" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Дата</Label>
                      <Input type="date" value={currentItem.date} onChange={(e) => setCurrentItem({...currentItem, date: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Время</Label>
                      <Input type="time" value={currentItem.time} onChange={(e) => setCurrentItem({...currentItem, time: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsModalOpen(false); setCurrentItem(null); }}>
              Отмена
            </Button>
            <Button onClick={saveItem} disabled={!currentItem}>
              {isEditMode ? "Сохранить изменения" : "Добавить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}