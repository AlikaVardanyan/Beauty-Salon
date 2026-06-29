import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Scissors, Users, Calendar as CalendarIcon, Settings, LogOut,
  Plus, Trash2, Edit2, Lock, Phone, Upload, X, Check, Image as ImageIcon
} from "lucide-react";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("admin") === "true");
  const [activeTab, setActiveTab] = useState("bookings");
  
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [masters, setMasters] = useState([]);


  const [salonName, setSalonName] = useState(localStorage.getItem("salonName") || "BEAUTY NOVA");
  const [salonPhone, setSalonPhone] = useState(localStorage.getItem("salonPhone") || "+7 (999) 000-00-00");
  const [salonLogo, setSalonLogo] = useState(localStorage.getItem("salonLogo") || "");

  
  const [editingBookingIndex, setEditingBookingIndex] = useState<number | null>(null);
  const [editBookingData, setEditBookingData] = useState<any>(null);

  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [editServiceData, setEditServiceData] = useState<any>(null);

  const [editingMasterIndex, setEditingMasterIndex] = useState<number | null>(null);
  const [editMasterData, setEditMasterData] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ 
    name: "", title: "", price: "", role: "", image: "",
    clientName: "", phone: "", date: "", time: "", service: "", masterName: "" 
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = () => {
      setServices(JSON.parse(localStorage.getItem("services") || "[]"));
      setBookings(JSON.parse(localStorage.getItem("bookedSlots") || "[]"));
      setMasters(JSON.parse(localStorage.getItem("masters") || "[]"));
    };
    if (isLoggedIn) loadData();
  }, [isLoggedIn]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSalonLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'services' | 'masters') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'services') setEditServiceData({ ...editServiceData, image: reader.result as string });
        else setEditMasterData({ ...editMasterData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let updated;
    if (activeTab === "bookings") {
      updated = [...bookings, { ...newItem, id: Date.now().toString(), name: newItem.clientName, master: newItem.masterName }];
      setBookings(updated);
      localStorage.setItem("bookedSlots", JSON.stringify(updated));
    } else if (activeTab === "services") {
      updated = [...services, { id: Date.now().toString(), title: newItem.title, price: newItem.price, image: newItem.image || "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800" }];
      setServices(updated);
      localStorage.setItem("services", JSON.stringify(updated));
      window.dispatchEvent(new Event("servicesUpdated"));
    } else if (activeTab === "masters") {
      updated = [...masters, { id: Date.now().toString(), name: newItem.name, role: newItem.role, image: newItem.image || "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800", rating: 5.0, reviews: 0 }];
      setMasters(updated);
      localStorage.setItem("masters", JSON.stringify(updated));
      window.dispatchEvent(new Event("mastersUpdated"));
    }
    setIsModalOpen(false);
    setNewItem({ name: "", title: "", price: "", role: "", image: "", clientName: "", phone: "", date: "", time: "", service: "", masterName: "" });
  };

  const saveEditBooking = (index: number) => {
    const updated = [...bookings];
    updated[index] = { ...editBookingData, name: editBookingData.clientName, master: editBookingData.masterName };
    setBookings(updated);
    localStorage.setItem("bookedSlots", JSON.stringify(updated));
    setEditingBookingIndex(null);
  };

  const saveEditService = (index: number) => {
    const updated = [...services];
    updated[index] = editServiceData;
    setServices(updated);
    localStorage.setItem("services", JSON.stringify(updated));
    window.dispatchEvent(new Event("servicesUpdated"));
    setEditingServiceIndex(null);
  };

  const saveEditMaster = (index: number) => {
    const updated = [...masters];
    updated[index] = editMasterData;
    setMasters(updated);
    localStorage.setItem("masters", JSON.stringify(updated));
    window.dispatchEvent(new Event("mastersUpdated"));
    setEditingMasterIndex(null);
  };

  const deleteItem = (id: string, type: 'services' | 'masters') => {
    if (!confirm("Удалить?")) return;
    const key = type === 'services' ? "services" : "masters";
    const updated = (type === 'services' ? services : masters).filter((item: any) => item.id !== id);
    if (type === 'services') setServices(updated); else setMasters(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event(`${key}Updated`));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login === "admin" && password === "admin777") {
      localStorage.setItem("admin", "true");
      setIsLoggedIn(true);
    } else setError("Доступ запрещен");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-[400px] p-10 shadow-2xl rounded-[40px] bg-white border-none text-center text-black">
          <Lock className="mx-auto mb-6 text-primary w-12 h-12" />
          <h1 className="text-2xl font-bold font-serif mb-8 uppercase italic text-black">Beauty Nova Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4 text-black">
            <Input placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-6" />
            <Input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl h-12 bg-slate-50 border-none px-6" />
            {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
            <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg">Войти</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex text-black">
      <aside className="w-64 border-r bg-white h-screen sticky top-0 flex flex-col">
        <div className="p-6 border-b flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {salonLogo ? (
              <img src={salonLogo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Scissors className="text-white w-5 h-5" />
            )}
          </div>
          <span className="font-serif font-bold italic tracking-tighter uppercase truncate text-sm">
            {salonName}
          </span>
        </div>

        <nav className="flex-grow p-4 space-y-2 font-bold text-sm">
          <button onClick={() => setActiveTab("bookings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "bookings" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}><CalendarIcon size={18}/> Бронирования</button>
          <button onClick={() => setActiveTab("services")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "services" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}><Scissors size={18}/> Услуги</button>
          <button onClick={() => setActiveTab("masters")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "masters" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}><Users size={18}/> Мастера</button>
          <button onClick={() => setActiveTab("settings")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "settings" ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted"}`}><Settings size={18}/> Настройки</button>
        </nav>
        <button onClick={() => { localStorage.removeItem("admin"); window.location.reload(); }} className="p-8 text-red-500 font-bold flex items-center gap-2 hover:bg-red-50 transition-colors"><LogOut size={18}/> Выйти</button>
      </aside>

      <main className="flex-grow p-10 bg-muted/10 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-4xl font-bold italic font-serif capitalize text-black">{activeTab === "bookings" ? "Бронирования" : activeTab === "services" ? "Услуги" : activeTab === "masters" ? "Мастера" : "Настройки"}</h2>
            {activeTab !== "settings" && (
              <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl bg-black text-white px-6 h-12 hover:bg-black/80 transition-all"><Plus size={20} className="mr-2" /> Добавить</Button>
            )}
          </div>

          <Card className="rounded-[40px] p-8 bg-white min-h-[500px] shadow-sm border-none">
            {activeTab === "bookings" && bookings.map((b: any, i) => (
              <div key={i} className="flex justify-between items-center p-6 bg-slate-50 rounded-[24px] mb-4 border border-slate-100 shadow-sm text-black">
                <div className="flex gap-6 items-center flex-grow">
                  <span className="text-slate-400 font-mono font-bold w-6">{i + 1}.</span>
                  {editingBookingIndex === i ? (
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
                      <Input value={editBookingData.clientName || editBookingData.name} onChange={(e) => setEditBookingData({...editBookingData, clientName: e.target.value, name: e.target.value})} placeholder="Имя" className="bg-white" />
                      <Input value={editBookingData.phone} onChange={(e) => setEditBookingData({...editBookingData, phone: e.target.value})} placeholder="Телефон" className="bg-white" />
                      <Input type="date" value={editBookingData.date} onChange={(e) => setEditBookingData({...editBookingData, date: e.target.value})} className="bg-white" />
                      <Input type="time" value={editBookingData.time} onChange={(e) => setEditBookingData({...editBookingData, time: e.target.value})} className="bg-white" />
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-lg">{b.clientName || b.name}</p>
                      <p className="text-primary text-sm font-semibold flex items-center gap-1"><Phone size={14}/> {b.phone}</p>
                      <p className="text-xs text-muted-foreground mt-1 italic">{b.date} в {b.time} — <b>{b.service}</b></p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingBookingIndex === i ? (
                    <Button variant="ghost" onClick={() => saveEditBooking(i)} className="text-green-600"><Check/></Button>
                  ) : (
                    <Button variant="ghost" onClick={() => { setEditingBookingIndex(i); setEditBookingData(b); }} className="text-blue-500 hover:bg-blue-50"><Edit2 size={18}/></Button>
                  )}
                  <Button variant="ghost" onClick={() => { const up = bookings.filter((_, idx) => idx !== i); setBookings(up); localStorage.setItem("bookedSlots", JSON.stringify(up)); }} className="text-red-500 hover:bg-red-50"><Trash2/></Button>
                </div>
              </div>
            ))}

            {activeTab === "services" && services.map((s: any, i) => (
              <div key={s.id || i} className="flex justify-between items-center p-4 bg-slate-50 rounded-3xl mb-3 border border-slate-100 shadow-sm text-black">
                <div className="flex items-center gap-4 flex-grow">
                  <span className="font-mono text-slate-300 font-bold w-6 text-center">{i + 1}</span>
                  {editingServiceIndex === i ? (
                    <>
                      <div className="relative group w-14 h-14 shrink-0">
                        <img src={editServiceData.image} className="w-14 h-14 rounded-2xl object-cover border bg-white" alt="" />
                        <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                          <Upload className="text-white w-5 h-5" />
                          <input type="file" accept="image/*" onChange={(e) => handleEditFileChange(e, 'services')} className="hidden" />
                        </label>
                      </div>
                      <div className="flex-grow flex gap-3 mr-4">
                        <Input value={editServiceData.title} onChange={(e) => setEditServiceData({...editServiceData, title: e.target.value})} className="h-9 rounded-xl bg-white" />
                        <Input value={editServiceData.price} onChange={(e) => setEditServiceData({...editServiceData, price: e.target.value})} className="h-9 w-32 rounded-xl bg-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={s.image} className="w-14 h-14 rounded-2xl object-cover border bg-white shadow-sm shrink-0" alt="" />
                      <div><p className="font-bold text-lg">{s.title}</p><p className="text-primary font-bold">{s.price} ₽</p></div>
                    </>
                  )}
                </div>
                <div className="flex gap-1 ml-4">
                  {editingServiceIndex === i ? (
                    <Button variant="ghost" onClick={() => saveEditService(i)} className="text-green-600"><Check size={20}/></Button>
                  ) : (
                    <Button variant="ghost" onClick={() => { setEditingServiceIndex(i); setEditServiceData(s); }} className="text-blue-500 hover:bg-blue-50"><Edit2 size={18}/></Button>
                  )}
                  <Button variant="ghost" onClick={() => deleteItem(s.id, 'services')} className="text-red-400 hover:bg-red-50"><Trash2 size={20}/></Button>
                </div>
              </div>
            ))}

            {activeTab === "masters" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                {masters.map((m: any, i) => (
                  <div key={m.id || i} className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm transition-all">
                    {editingMasterIndex === i ? (
                      <>
                        <div className="relative group w-16 h-16 shrink-0">
                          <img src={editMasterData.image} className="w-16 h-16 rounded-2xl object-cover border bg-white shadow-sm" alt="" />
                          <label className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <Upload className="text-white w-6 h-6" />
                            <input type="file" accept="image/*" onChange={(e) => handleEditFileChange(e, 'masters')} className="hidden" />
                          </label>
                        </div>
                        <div className="flex-grow space-y-2">
                          <Input value={editMasterData.name} onChange={(e) => setEditMasterData({...editMasterData, name: e.target.value})} className="h-8 text-sm rounded-lg bg-white" />
                          <Input value={editMasterData.role} onChange={(e) => setEditMasterData({...editMasterData, role: e.target.value})} className="h-8 text-sm rounded-lg bg-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-slate-300 font-bold w-4 text-center">{i + 1}</span>
                        <img src={m.image} className="w-16 h-16 rounded-2xl object-cover border bg-white shadow-sm shrink-0" alt="" />
                        <div className="flex-grow"><p className="font-bold">{m.name}</p><p className="text-xs text-muted-foreground uppercase tracking-widest">{m.role}</p></div>
                      </>
                    )}
                    <div className="flex gap-1 ml-2">
                      {editingMasterIndex === i ? (
                        <Button variant="ghost" onClick={() => saveEditMaster(i)} className="text-green-600"><Check size={20}/></Button>
                      ) : (
                        <Button variant="ghost" onClick={() => { setEditingMasterIndex(i); setEditMasterData(m); }} className="text-blue-500 hover:bg-blue-50"><Edit2 size={18}/></Button>
                      )}
                      <Button variant="ghost" onClick={() => deleteItem(m.id, 'masters')} className="text-red-400 hover:bg-red-50"><Trash2 size={18}/></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-md space-y-6 text-black">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative group">
                    <div 
                      onClick={() => logoInputRef.current?.click()} 
                      className="w-32 h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-100 transition-all shadow-sm"
                    >
                      {salonLogo ? <img src={salonLogo} className="w-full h-full object-contain" /> : <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"><Scissors className="text-white w-8 h-8"/></div>}
                    </div>
                    {salonLogo && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if(confirm("Удалить логотип?")) {
                            setSalonLogo("");
                            localStorage.removeItem("salonLogo"); 
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <input type="file" ref={logoInputRef} onChange={handleLogoChange} accept="image/*" className="hidden" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{salonLogo ? "Нажми, чтобы изменить" : "Загрузить лого"}</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Название салона</label>
                    <Input value={salonName} onChange={(e) => setSalonName(e.target.value)} placeholder="Название" className="h-12 rounded-xl bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-2">Телефон</label>
                    <Input value={salonPhone} onChange={(e) => setSalonPhone(e.target.value)} placeholder="Телефон" className="h-12 rounded-xl bg-white" />
                  </div>
                  <Button 
                    className="w-full h-14 rounded-2xl bg-black text-white font-bold text-lg hover:opacity-80 transition-all mt-6 shadow-xl shadow-black/10" 
                    onClick={() => {
                      localStorage.setItem("salonName", salonName);
                      localStorage.setItem("salonPhone", salonPhone);
                      
                   
                      if (!salonLogo || salonLogo === "" || salonLogo === null) {
                        localStorage.removeItem("salonLogo");
                      } else {
                        localStorage.setItem("salonLogo", salonLogo);
                      }

                 
                      window.dispatchEvent(new Event("storage"));
                      window.dispatchEvent(new Event("settingsUpdated"));

                      alert("Настройки успешно сохранены!");
                      
                    
                      setTimeout(() => {
                        window.location.reload();
                      }, 100);
                    }}
                  >
                    Сохранить настройки
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative text-black text-left">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-black transition-colors"><X/></button>
              <h3 className="text-2xl font-bold mb-8 italic font-serif">Добавить новое</h3>
              
              <div className="space-y-4">
                {activeTab === "bookings" ? (
                  <>
                    <Input placeholder="Имя клиента" value={newItem.clientName} onChange={(e) => setNewItem({...newItem, clientName: e.target.value})} className="h-12 rounded-xl" />
                    <Input placeholder="Телефон" value={newItem.phone} onChange={(e) => setNewItem({...newItem, phone: e.target.value})} className="h-12 rounded-xl" />
                    <div className="grid grid-cols-2 gap-2">
                       <Input type="date" value={newItem.date} onChange={(e) => setNewItem({...newItem, date: e.target.value})} className="h-12 rounded-xl" />
                       <Input type="time" value={newItem.time} onChange={(e) => setNewItem({...newItem, time: e.target.value})} className="h-12 rounded-xl" />
                    </div>
                    <Input placeholder="Услуга" value={newItem.service} onChange={(e) => setNewItem({...newItem, service: e.target.value})} className="h-12 rounded-xl" />
                    <Input placeholder="Мастер" value={newItem.masterName} onChange={(e) => setNewItem({...newItem, masterName: e.target.value})} className="h-12 rounded-xl" />
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center gap-4 mb-4">
                      <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-100 transition-colors">
                        {newItem.image ? <img src={newItem.image} className="w-full h-full object-cover" /> : <Upload className="text-slate-300"/>}
                      </div>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Загрузить фото</span>
                    </div>
                    {activeTab === "services" ? (
                      <>
                        <Input placeholder="Название услуги" value={newItem.title} onChange={(e) => setNewItem({...newItem, title: e.target.value})} className="h-12 rounded-xl" />
                        <Input placeholder="Цена (₽)" type="number" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: e.target.value})} className="h-12 rounded-xl" />
                      </>
                    ) : (
                      <>
                        <Input placeholder="Имя мастера" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} className="h-12 rounded-xl" />
                        <Input placeholder="Специализация" value={newItem.role} onChange={(e) => setNewItem({...newItem, role: e.target.value})} className="h-12 rounded-xl" />
                      </>
                    )}
                  </>
                )}
                <Button onClick={handleSave} className="w-full h-14 rounded-2xl bg-black text-white font-bold text-lg mt-4 shadow-xl shadow-black/10 transition-all hover:scale-[1.02]">Сохранить</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}