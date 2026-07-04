import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  User, 
  Scissors, 
  Clock,
  ChevronLeft,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  service: z.string().min(1, "Выберите услугу"),
  master: z.string().min(1, "Выберите мастера"),
  date: z.date({ required_error: "Выберите дату" }),
  time: z.string().min(1, "Выберите время"),
  name: z.string().min(2, "Имя слишком короткое"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  email: z.string().email("Некорректный email"),
});

export default function BookingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  
  const [services, setServices] = useState<any[]>([]);
  const [masters, setMasters] = useState<any[]>([]);

  const [bookedSlots, setBookedSlots] = useState([
    { master: "Анна Соколова", date: "2026-07-05", time: "10:30" },
  ]);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      service: "",
      master: "",
      date: undefined,
      time: "",
      name: "",
      phone: "",
      email: "",
    },
  });

  const { watch, setValue, trigger } = form;
  const selectedService = watch("service");
  const selectedMaster = watch("master");
  const selectedDate = watch("date");
  const selectedTime = watch("time");


  useEffect(() => {
    const loadedServices = JSON.parse(localStorage.getItem("services") || "[]");
    const loadedMasters = JSON.parse(localStorage.getItem("masters") || "[]");

    setServices(loadedServices.length > 0 ? loadedServices : [
      // fallback если ничего нет в localStorage
      { id: 1, name: "Маникюр и педикюр", price: "от 1 500 ₽", image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=300" },
    ]);

    setMasters(loadedMasters.length > 0 ? loadedMasters : [
      { id: 1, name: "Анна Соколова", specialty: "Топ-стилист", photo: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200" },
    ]);
  }, []);

  const isSlotBooked = (master: string, date: Date | undefined, time: string) => {
    if (!date) return false;
    const dateStr = format(date, "yyyy-MM-dd");
    return bookedSlots.some(slot => 
      slot.master === master && slot.date === dateStr && slot.time === time
    );
  };

  const nextStep = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ["service", "master"];
    if (step === 2) fields = ["date", "time"];
    
    const isValid = await trigger(fields as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    const newBooking = {
      id: Date.now(),
      service: values.service,
      master: values.master,
      date: format(values.date, "yyyy-MM-dd"),
      time: values.time,
      name: values.name,
      phone: values.phone,
      email: values.email,
    };

    const existingBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    localStorage.setItem("bookings", JSON.stringify([newBooking, ...existingBookings]));

    setBookedSlots(prev => [...prev, {
      master: values.master,
      date: newBooking.date,
      time: values.time,
    }]);

    console.log("Новая запись:", newBooking);
    setIsSubmitted(true);
    toast.success("Ваша запись успешно создана!");
  }

  return (
    <section id="booking" className="py-24 px-6 bg-[#111] text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-0 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-0 opacity-30" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 space-y-10">
      
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-5xl font-serif font-bold leading-tight">Бронирование</h2>
                <p className="text-gray-400 mt-4 text-lg">Выберите услугу, время и мастера. Мы позаботимся о вашем комфорте.</p>
              </motion.div>
            </div>

            {!isSubmitted && (
              <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 space-y-6">
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Ваш выбор</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase">Услуга</p>
                      <p className="font-bold">{selectedService || "Не выбрана"}</p>
                    </div>
                    {selectedService && <Scissors className="text-primary w-4 h-4" />}
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase">Мастер</p>
                      <p className="font-bold">{selectedMaster || "Не выбран"}</p>
                    </div>
                    {selectedMaster && <User className="text-primary w-4 h-4" />}
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase">Дата и время</p>
                      <p className="font-bold">
                        {selectedDate ? format(selectedDate, "d MMMM", { locale: ru }) : "Дата не выбрана"}
                        {selectedTime ? `, ${selectedTime}` : ""}
                      </p>
                    </div>
                    {(selectedDate || selectedTime) && <Clock className="text-primary w-4 h-4" />}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white text-black rounded-[40px] shadow-2xl p-6 md:p-12 min-h-[600px] flex flex-col relative overflow-hidden">
              {!isSubmitted && (
                <div className="flex gap-2 mb-12">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={cn("h-1.5 flex-grow rounded-full transition-all duration-500", step >= i ? "bg-primary" : "bg-gray-100")} />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-grow flex flex-col">
                    <Form {...form}>
                      <form className="flex-grow flex flex-col">
                        {step === 1 && (
                          <div className="space-y-10">
                            <div className="space-y-4">
                              <h3 className="text-2xl font-serif font-bold">Выберите категорию</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {services.map((s: any) => (
                                  <button 
                                    key={s.id} 
                                    type="button" 
                                    onClick={() => setValue("service", s.name, { shouldValidate: true })}
                                    className={cn("group relative h-32 rounded-3xl overflow-hidden border-2 transition-all", 
                                      selectedService === s.name ? "border-primary ring-4 ring-primary/10" : "border-transparent hover:border-primary/50"
                                    )}
                                  >
                                    <img 
                                      src={s.image || s.img} 
                                      alt={s.name} 
                                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5 text-left">
                                      <p className="text-white font-bold text-lg">{s.name}</p>
                                      <p className="text-primary text-xs font-medium">
                                        {s.price ? `${s.price} ₽` : "Цена по запросу"}
                                      </p>
                                    </div>
                                    {selectedService === s.name && (
                                      <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                                        <CheckCircle2 size={16} />
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-2xl font-serif font-bold">Ваш специалист</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {masters.map((m: any) => (
                                  <button 
                                    key={m.id || m.name} 
                                    type="button" 
                                    onClick={() => setValue("master", m.name, { shouldValidate: true })}
                                    className={cn("flex flex-col items-center p-6 rounded-3xl border-2 transition-all gap-4", 
                                      selectedMaster === m.name ? "border-primary bg-primary/5 shadow-inner" : "border-gray-100 hover:border-primary/30"
                                    )}
                                  >
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                      <img 
                                        src={m.photo || m.img} 
                                        alt={m.name} 
                                        className="w-full h-full object-cover" 
                                      />
                                    </div>
                                    <div className="text-center">
                                      <p className="font-bold text-base">{m.name}</p>
                                      <p className="text-xs text-muted-foreground font-medium">
                                        {m.specialty || m.role}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                       
                        {step === 2 && (
                          <div className="space-y-12">
                            <div className="flex flex-col lg:flex-row gap-12">
                              <div className="flex-grow space-y-6">
                                <h3 className="text-2xl font-serif font-bold">Выберите дату</h3>
                                <div className="border border-gray-100 rounded-[40px] p-8 shadow-xl bg-white">
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => setValue("date", date as Date, { shouldValidate: true })}
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                    initialFocus
                                    locale={ru}
                                    weekStartsOn={1}
                                    className="w-full flex justify-center"
                                    classNames={{
                                      head_row: "flex w-full",
                                      head_cell: "text-muted-foreground font-medium text-[0.8rem] flex-1 text-center py-2",
                                      row: "flex w-full mt-1",
                                      cell: "relative h-10 flex-1 text-center text-sm p-0 flex items-center justify-center",
                                      day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 rounded-full transition-all",
                                      day_selected: "bg-primary text-white hover:bg-primary rounded-full",
                                      day_today: "font-bold text-primary border border-primary rounded-full",
                                      day_outside: "text-gray-300 opacity-60",
                                      day_disabled: "text-gray-300 opacity-40",
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="lg:w-80 space-y-6">
                                <h3 className="text-2xl font-serif font-bold">Свободное время</h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"].map((slot) => {
                                    const isBooked = isSlotBooked(selectedMaster, selectedDate, slot);
                                    return (
                                      <button
                                        key={slot}
                                        type="button"
                                        disabled={isBooked}
                                        onClick={() => !isBooked && setValue("time", slot, { shouldValidate: true })}
                                        className={cn(
                                          "py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden",
                                          selectedTime === slot
                                            ? "bg-primary text-white border-primary shadow-lg"
                                            : isBooked
                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                            : "border-gray-50 hover:border-primary/50 text-gray-600 hover:bg-gray-50"
                                        )}
                                      >
                                        <Clock size={14} />
                                        {slot}
                                        {isBooked && (
                                          <div className="absolute top-1 right-1 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                                            занято
                                          </div>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {step === 3 && (
                          <div className="max-w-md mx-auto w-full space-y-8 py-4">
                            <h3 className="text-3xl font-serif font-bold text-center">Контактная информация</h3>
                            <div className="space-y-4">
                              <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="Ваше полное имя" {...field} className="rounded-2xl h-14 bg-gray-50 border-none px-6 text-lg" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="+7 (___) ___-__-__" {...field} className="rounded-2xl h-14 bg-gray-50 border-none px-6 text-lg" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input placeholder="E-mail" {...field} className="rounded-2xl h-14 bg-gray-50 border-none px-6 text-lg" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            </div>
                          </div>
                        )}

                        <div className="mt-auto pt-16 flex gap-4">
                          {step > 1 && (
                            <Button type="button" variant="ghost" onClick={prevStep} className="rounded-2xl h-14 px-8">
                              <ChevronLeft className="mr-2" size={18} /> Назад
                            </Button>
                          )}
                          {step < 3 ? (
                            <Button 
                              type="button" 
                              onClick={nextStep} 
                              className="flex-grow rounded-2xl h-14 text-lg font-bold shadow-primary/30"
                              disabled={step === 1 && (!selectedService || !selectedMaster)}
                            >
                              Следующий шаг <ArrowRight className="ml-2" size={18} />
                            </Button>
                          ) : (
                            <Button 
                              type="button" 
                              onClick={form.handleSubmit(onSubmit)} 
                              className="flex-grow rounded-2xl h-14 text-lg font-bold"
                            >
                              Завершить бронирование
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div key="success" className="text-center py-20 space-y-8 flex flex-col items-center justify-center flex-grow">
                    <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-4xl font-serif font-bold">Готово!</h3>
                    <Button 
                      onClick={() => { 
                        setIsSubmitted(false); 
                        setStep(1); 
                        form.reset(); 
                      }} 
                      variant="outline" 
                      className="rounded-2xl h-14 px-10 border-2"
                    >
                      На главную
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}