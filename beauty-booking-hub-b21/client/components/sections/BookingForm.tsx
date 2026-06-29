  import { useState, useEffect } from "react";
  import emailjs from "@emailjs/browser";
  import { motion, AnimatePresence } from "framer-motion";
  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import * as z from "zod";
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
    ChevronRight,
    ChevronLeft
  } from "lucide-react";

  import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval, 
    addMonths, 
    subMonths, 
    isSameMonth, 
    isSameDay, 
    isToday 
  } from "date-fns";
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

  const timeSlots = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"];

  export default function BookingForm() {
    const [services, setServices] = useState<any[]>([]);
    const [masters, setMasters] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    

    const [bookedSlots, setBookedSlots] = useState<any[]>(() => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("bookedSlots");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [step, setStep] = useState(1);

    useEffect(() => {
      const loadData = () => {
        const savedServices = localStorage.getItem("services");
        const savedMasters = localStorage.getItem("masters");
        if (savedServices) setServices(JSON.parse(savedServices));
        if (savedMasters) setMasters(JSON.parse(savedMasters));
      };
      loadData();
      window.addEventListener("storage", loadData);
      window.addEventListener("servicesUpdated", loadData);
      window.addEventListener("mastersUpdated", loadData);
      return () => {
        window.removeEventListener("storage", loadData);
        window.removeEventListener("servicesUpdated", loadData);
        window.removeEventListener("mastersUpdated", loadData);
      };
    }, []);

    const form = useForm<z.infer<typeof bookingSchema>>({
      resolver: zodResolver(bookingSchema),
      defaultValues: {
        service: "", master: "", date: undefined,
        time: "", name: "", phone: "", email: "",
      },
    });

    const { watch, setValue, trigger } = form;
    const selectedService = watch("service");
    const selectedMaster = watch("master");
    const selectedDate = watch("date");
    const selectedTime = watch("time");

    const nextStep = async () => {
      let fields: any[] = [];
      if (step === 1) fields = ["service", "master"];
      if (step === 2) fields = ["date", "time"];
      const isValid = await trigger(fields as any);
      if (isValid) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    function onSubmit(values: z.infer<typeof bookingSchema>) {
      if (isSending) return;
      setIsSending(true);

      const formattedDate = format(values.date, "d MMMM yyyy", { locale: ru });

      const templateParams = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        service: values.service,
        master: values.master,
        date: formattedDate,
        time: values.time
      };

      emailjs.send("service_wv1qvdr", "template_26gp1zc", templateParams, "pZyvPNLJ85tlgd0Cb")
      .then(() => {
        const newBooking = {
          id: Date.now().toString(),
          clientName: values.name, 
          phone: values.phone,
          date: format(values.date, "yyyy-MM-dd"), 
          time: values.time,
          service: values.service,
          masterName: values.master 
        };

        const existingBookings = JSON.parse(localStorage.getItem("bookedSlots") || "[]");
        const updatedBookings = [...existingBookings, newBooking];
        
        localStorage.setItem("bookedSlots", JSON.stringify(updatedBookings));
        setBookedSlots(updatedBookings);

        setIsSubmitted(true);
        toast.success("Запись оформлена!");
      })
      .catch(() => toast.error("Ошибка отправки"))
      .finally(() => setIsSending(false));
    }

    return (
      <section id="booking" className="py-24 px-6 bg-[#111] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-0 opacity-50" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-4 space-y-10">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-5xl font-serif font-bold leading-tight">Бронирование</h2>
                <p className="text-gray-400 mt-4 text-lg">Выберите услугу, время и мастера.</p>
              </motion.div>

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
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow flex flex-col">
                          
                          {step === 1 && (
                            <div className="space-y-10">
                              <div className="space-y-4">
                                <h3 className="text-2xl font-serif font-bold text-black">Выберите услугу</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {services.map((s) => (
                                    <button key={s.id} type="button" onClick={() => setValue("service", s.title, { shouldValidate: true })}
                                      className={cn("group relative h-28 rounded-3xl overflow-hidden border-2 transition-all duration-300", watch("service") === s.title ? "border-primary ring-4 ring-primary/10 bg-primary/5 shadow-md" : "border-gray-100 bg-white hover:border-gray-200")}>
                                      <img src={s.image} className={cn("absolute inset-0 w-full h-full object-cover transition-all duration-500", watch("service") === s.title ? "opacity-60 scale-110" : "opacity-40 group-hover:scale-105")} alt="" />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 p-5 flex flex-col justify-end text-left">
                                        <p className={cn("font-bold text-lg", watch("service") === s.title ? "text-primary" : "text-white")}>{s.title}</p>
                                        <p className="text-primary text-xs font-bold">{s.price} ₽</p>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-4">
                                <h3 className="text-2xl font-serif font-bold text-black">Ваш специалист</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  {masters.map((m) => (
                                    <button key={m.id} type="button" onClick={() => setValue("master", m.name, { shouldValidate: true })}
                                      className={cn("flex flex-col items-center p-4 rounded-3xl border-2 transition-all duration-300", watch("master") === m.name ? "border-primary bg-primary/5 ring-4 ring-primary/10 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200")}>
                                      <div className={cn("w-16 h-16 rounded-full overflow-hidden mb-2 border-2", watch("master") === m.name ? "border-primary scale-110" : "border-transparent")}>
                                        <img src={m.image} className="w-full h-full object-cover" alt="" />
                                      </div>
                                      <p className={cn("font-bold text-sm", watch("master") === m.name ? "text-primary" : "text-black")}>{m.name}</p>
                                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">{m.role}</p>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {step === 2 && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                              <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="flex-grow w-full bg-white rounded-[35px] border border-zinc-100 shadow-xl p-6">
                                  <div className="flex items-center justify-between mb-6 px-2 text-black">
                                    <h3 className="text-lg font-bold font-serif uppercase tracking-wider">
                                      {format(currentMonth, "LLLL yyyy", { locale: ru })}
                                    </h3>
                                    <div className="flex gap-1">
                                      <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><ChevronLeft size={20}/></button>
                                      <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><ChevronRight size={20}/></button>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-7 mb-4">
                                    {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map(day => (
                                      <div key={day} className="text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">{day}</div>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-7 gap-y-2">
                                    {(() => {
                                      const monthStart = startOfMonth(currentMonth);
                                      const monthEnd = endOfMonth(monthStart);
                                      const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
                                      const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
                                      const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

                                      return calendarDays.map((date, i) => {
                                        const isCurMonth = isSameMonth(date, monthStart);
                                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                                        const isPast = date < new Date(new Date().setHours(0,0,0,0));

                                        return (
                                          <div key={i} className="flex justify-center">
                                            <button type="button" disabled={!isCurMonth || isPast} 
                                              onClick={() => setValue("date", date, { shouldValidate: true })}
                                              className={cn(
                                                "h-10 w-10 rounded-full flex flex-col items-center justify-center text-sm transition-all relative",
                                                isSelected ? "bg-primary text-white shadow-lg scale-110 z-10" : 
                                                isToday(date) ? "border-2 border-primary/30 text-primary font-bold" :
                                                !isCurMonth ? "text-transparent pointer-events-none" :
                                                isPast ? "text-zinc-200 cursor-not-allowed opacity-30" : "hover:bg-zinc-100 text-zinc-800"
                                              )}
                                            >
                                              {format(date, "d")}
                                              {isToday(date) && !isSelected && <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />}
                                            </button>
                                          </div>
                                        );
                                      });
                                    })()}
                                  </div>
                                </div>

                                <div className="lg:w-64 w-full bg-white rounded-[35px] border border-zinc-100 shadow-xl p-6 text-black">
                                  <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2"><Clock className="text-primary" size={18} />Время</h3>
                                  <div className="grid grid-cols-2 gap-2">
                                    {timeSlots.map((slot) => {
                                      const isBooked = selectedDate && bookedSlots.some(s => 
                                        s.date === format(selectedDate, "yyyy-MM-dd") && s.time === slot && (s.masterName === selectedMaster || s.master === selectedMaster)
                                      );
                                      return (
                                        <button key={slot} type="button" disabled={!selectedDate || isBooked}
                                          onClick={() => setValue("time", slot, { shouldValidate: true })}
                                          className={cn("py-3 rounded-xl border-2 text-sm font-bold transition-all",
                                            selectedTime === slot ? "bg-primary border-primary text-white shadow-md" : isBooked ? "bg-zinc-50 text-zinc-200 border-transparent cursor-not-allowed" : "bg-white border-zinc-50 hover:border-primary text-black")}>
                                          {slot}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {step === 3 && (
                            <div className="space-y-4 max-w-md mx-auto w-full">
                              <h3 className="text-2xl font-serif font-bold text-center text-black">Ваши данные</h3>
                              <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormControl><Input placeholder="Имя" {...field} className="h-14 rounded-2xl bg-gray-50 border-none text-black" /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem><FormControl><Input placeholder="Телефон" {...field} className="h-14 rounded-2xl bg-gray-50 border-none text-black" /></FormControl><FormMessage /></FormItem>
                              )} />
                              <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormControl><Input placeholder="Email" {...field} className="h-14 rounded-2xl bg-gray-50 border-none text-black" /></FormControl><FormMessage /></FormItem>
                              )} />
                            </div>
                          )}

                          <div className="mt-auto pt-10 flex gap-4">
                            {step > 1 && <Button type="button" variant="ghost" onClick={prevStep} className="h-14 rounded-2xl text-black">Назад</Button>}
                            <Button type={step === 3 ? "submit" : "button"} onClick={step < 3 ? nextStep : undefined}
                              className="flex-grow h-14 rounded-2xl text-lg font-bold" disabled={isSending}>
                              {step === 3 ? (isSending ? "Отправка..." : "Забронировать") : "Далее"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 flex flex-col items-center justify-center flex-grow">
                      <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl"><CheckCircle2 size={40} /></div>
                      <h3 className="text-3xl font-serif font-bold mb-2 text-black">Запись создана!</h3>
                      <p className="text-gray-500 mb-8">Мы ждем вас {selectedDate && format(selectedDate, "d MMMM", { locale: ru })} в {selectedTime}.</p>
                      <Button onClick={() => { setIsSubmitted(false); setStep(1); form.reset(); }} className="rounded-2xl h-14 px-10">Ок</Button>
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