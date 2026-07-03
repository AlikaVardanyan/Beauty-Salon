import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = false, ...props }: CalendarProps) {
  return (
    <DayPicker
      locale={ru}
      weekStartsOn={1}
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)} // Увеличили внутренний отступ
      classNames={{
        months: "flex flex-col",
        month: "space-y-6",
        // ГЛАВНОЕ: разделяем заголовок и навигацию
        caption: "flex flex-col items-center py-2 relative space-y-4", 
        caption_label: "text-xl font-serif font-bold text-black", // Заголовок крупнее
        nav: "flex items-center justify-between w-full", // Стрелки на всю ширину
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 bg-white border-gray-200 hover:bg-gray-50 rounded-full shadow-sm",
        ),
        nav_button_previous: "static",
        nav_button_next: "static",
        table: "w-full border-collapse mt-2",
        head_row: "flex w-full mb-4", // Больше места до дат
        head_cell: "text-gray-400 font-medium text-sm flex-1 text-center", // Четкие заголовки дней
        row: "flex w-full mt-2",
        cell: "h-12 flex-1 text-center text-base p-0 flex items-center justify-center", // Крупнее шрифт дней
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium rounded-full transition-all hover:bg-primary/10 hover:text-primary aria-selected:opacity-100",
        ),
        day_selected: "bg-primary text-white hover:bg-primary rounded-full shadow-md",
        day_today: "bg-gray-100 text-black font-bold border border-primary/20",
        day_outside: "hidden",
        ...classNames,
      }}
      components={{
        Chevron: (props) => (props.orientation === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";
export { Calendar };