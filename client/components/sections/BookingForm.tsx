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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Calendar as CalendarIcon, 
  User, 
  Scissors, 
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  service: z.string().min(1, "Выберите услугу"),
  master: z.string().min(1, "Выберите мастера"),
  date: z.date({
    required_error: "Выберите дату",
  }),
  time: z.string().min(1, "Выберите время"),
  name: z.string().min(2, "Имя слишком короткое"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  email: z.string().email("Некорректный email"),
});

const services = [
  { id: "nails", name: "Маникюр и педикюр", price: "от 1 500 ₽", img: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=300" },
  { id: "hair", name: "Парикмахерские услуги", price: "от 2 000 ₽", img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=300" },
  { id: "cosm", name: "Косметология", price: "от 3 500 ₽", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=300" },
  { id: "spa", name: "SPA и Массаж", price: "от 2 500 ₽", img: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=300" },
];

const masters = [
  { name: "Анна Соколова", role: "Топ-стилист", img: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=200" },
  { name: "Мария Иванова", role: "Мастер маникюра", img: "https://images.unsplash.com/photo-1594744803329-a584af1cae24?auto=format&fit=crop&q=80&w=200" },
  { name: "Елена Петрова", role: "Косметолог", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
];

const timeSlots = [
  "09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30"
];

export default function BookingForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);

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

  const nextStep = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ["service", "master"];
    if (step === 2) fields = ["date", "time"];
    
    const isValid = await trigger(fields as any);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    console.log("Booking values:", values);
    setIsSubmitted(true);
    toast.success("Ваша запись успешно создана!");
  }

  return (
    <section id="booking" className="py-24 px-6 bg-[#111] text-white relative overflow-hidden">
      {/* Abstract Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-0 opacity-50" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-0 opacity-30" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Side: Info & Summary */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl font-serif font-bold leading-tight">Бронирование</h2>
                <p className="text-gray-400 mt-4 text-lg">
                  Выберите услугу, время и мастера. Мы позаботимся о вашем комфорте.
                </p>
              </motion.div>
            </div>

            {/* Selection Summary */}
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

          {/* Right Side: Step Wizard */}
          <div className="lg:col-span-8">
            <div className="bg-white text-black rounded-[40px] shadow-2xl p-6 md:p-12 min-h-[600px] flex flex-col relative overflow-hidden">
              
              {/* Stepper Progress */}
              {!isSubmitted && (
                <div className="flex gap-2 mb-12">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1.5 flex-grow rounded-full transition-all duration-500",
                        step >= i ? "bg-primary" : "bg-gray-100"
                      )} 
                    />
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex-grow flex flex-col"
                  >
                    <Form {...form}>
                      <form className="flex-grow flex flex-col">
                        
                        {step === 1 && (
                          <div className="space-y-10">
                            <div className="space-y-4">
                              <h3 className="text-2xl font-serif font-bold">Выберите категорию</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {services.map((s) => (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setValue("service", s.name, { shouldValidate: true })}
                                    className={cn(
                                      "group relative h-32 rounded-3xl overflow-hidden border-2 transition-all",
                                      selectedService === s.name 
                                        ? "border-primary ring-4 ring-primary/10" 
                                        : "border-transparent hover:border-primary/50"
                                    )}
                                  >
                                    <img src={s.img} alt={s.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5 text-left">
                                      <p className="text-white font-bold text-lg">{s.name}</p>
                                      <p className="text-primary text-xs font-medium">{s.price}</p>
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
                                {masters.map((m) => (
                                  <button
                                    key={m.name}
                                    type="button"
                                    onClick={() => setValue("master", m.name, { shouldValidate: true })}
                                    className={cn(
                                      "flex flex-col items-center p-6 rounded-3xl border-2 transition-all gap-4",
                                      selectedMaster === m.name 
                                        ? "border-primary bg-primary/5 shadow-inner" 
                                        : "border-gray-100 hover:border-primary/30"
                                    )}
                                  >
                                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl">
                                      <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-center">
                                      <p className="font-bold text-base">{m.name}</p>
                                      <p className="text-xs text-muted-foreground font-medium">{m.role}</p>
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
                                <div className="flex items-center justify-between">
                                  <h3 className="text-2xl font-serif font-bold">Выберите дату</h3>
                                  <div className="px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-wider">
                                    Шаг 2 из 3
                                  </div>
                                </div>
                                <div className="border border-gray-100 rounded-[40px] p-8 shadow-xl bg-white relative overflow-hidden group">
                                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => {
                                      console.log("Date selected:", date);
                                      setValue("date", date as Date, { shouldValidate: true });
                                    }}
                                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                    initialFocus
                                    locale={ru}
                                    className="w-full flex justify-center"
                                  />
                                </div>
                              </div>

                              <div className="lg:w-80 space-y-6">
                                <h3 className="text-2xl font-serif font-bold">Свободное время</h3>
                                <div className="grid grid-cols-2 gap-3">
                                  {timeSlots.map((slot) => (
                                    <button
                                      key={slot}
                                      type="button"
                                      onClick={() => setValue("time", slot, { shouldValidate: true })}
                                      className={cn(
                                        "py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2",
                                        selectedTime === slot
                                          ? "bg-primary text-white border-primary shadow-lg scale-[1.05]"
                                          : "border-gray-50 hover:border-primary/50 text-gray-600 bg-gray-50/50"
                                      )}
                                    >
                                      <Clock size={14} className={cn(selectedTime === slot ? "text-white" : "text-primary")} />
                                      {slot}
                                    </button>
                                  ))}
                                </div>

                                {selectedDate && selectedTime && (
                                  <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mt-6 p-6 bg-[#111] text-white rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden"
                                  >
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-xl" />
                                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Вы подтверждаете:</p>
                                    <p className="text-lg font-bold leading-tight">
                                      {format(selectedDate, "d MMMM", { locale: ru })} <br />
                                      <span className="text-primary">в {selectedTime}</span>
                                    </p>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {step === 3 && (
                          <div className="max-w-md mx-auto w-full space-y-8 py-4">
                            <div className="text-center space-y-2">
                              <h3 className="text-3xl font-serif font-bold">Контактная информация</h3>
                              <p className="text-muted-foreground">Почти готово! Введите ваши данные</p>
                            </div>
                            
                            <div className="space-y-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input placeholder="Ваше полное имя" {...field} className="rounded-2xl h-14 bg-gray-50 border-none px-6 focus-visible:ring-primary text-lg" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input placeholder="+7 (___) ___-__-__" {...field} className="rounded-2xl h-14 bg-gray-50 border-none px-6 focus-visible:ring-primary text-lg" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input placeholder="E-mail для подтверждения" {...field} className="rounded-2xl h-14 bg-gray-50 border-none px-6 focus-visible:ring-primary text-lg" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="bg-gray-50 rounded-[32px] p-8 space-y-4 border border-gray-100 shadow-inner">
                              <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">Итоговые детали:</p>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Услуга и мастер:</span>
                                <span className="font-bold text-right">{selectedService} / {selectedMaster}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Дата и время:</span>
                                <span className="font-bold">{format(selectedDate as Date, "d MMM yyyy", { locale: ru })}, {selectedTime}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="mt-auto pt-16 flex gap-4">
                          {step > 1 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              onClick={prevStep}
                              className="rounded-2xl h-14 px-8 text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                            >
                              <ChevronLeft className="mr-2" size={18} /> Назад
                            </Button>
                          )}
                          
                          {step < 3 ? (
                            <Button 
                              type="button" 
                              onClick={nextStep}
                              className="flex-grow rounded-2xl h-14 text-lg font-bold shadow-2xl shadow-primary/30 transition-all hover:translate-x-1 group"
                              disabled={step === 1 && (!selectedService || !selectedMaster)}
                            >
                              Следующий шаг <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                            </Button>
                          ) : (
                            <Button 
                              type="button"
                              onClick={form.handleSubmit(onSubmit)}
                              className="flex-grow rounded-2xl h-14 text-lg font-bold shadow-2xl shadow-primary/30"
                            >
                              Завершить бронирование
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 space-y-8 flex flex-col items-center justify-center flex-grow"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-green-400/20 rounded-full blur-xl"
                      />
                      <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl relative">
                        <CheckCircle2 size={48} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-4xl font-serif font-bold">Готово!</h3>
                      <p className="text-gray-500 text-lg max-w-sm mx-auto leading-relaxed">
                        Ваша запись подтверждена. Мы отправили детали на вашу почту <span className="text-primary font-bold">{form.getValues("email")}</span>.
                      </p>
                    </div>
                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        setStep(1);
                        form.reset();
                      }} 
                      variant="outline" 
                      className="rounded-2xl h-14 px-10 border-2 font-bold"
                    >
                      Вернуться на главную
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
