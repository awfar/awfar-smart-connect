
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface AppointmentFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onCancel, onSave }) => {
  const [date, setDate] = useState<Date | undefined>();
  
  // Time slots for selection
  const timeSlots = [
    "09:00 ص", "09:30 ص", "10:00 ص", "10:30 ص", "11:00 ص", "11:30 ص",
    "12:00 م", "12:30 م", "01:00 م", "01:30 م", "02:00 م", "02:30 م",
    "03:00 م", "03:30 م", "04:00 م", "04:30 م", "05:00 م"
  ];

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">عنوان الموعد</Label>
          <Input id="title" placeholder="أدخل عنوان الموعد" className="mt-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client">العميل</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر العميل" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>العملاء</SelectLabel>
                  <SelectItem value="ahmed">أحمد محمد</SelectItem>
                  <SelectItem value="sara">سارة خالد</SelectItem>
                  <SelectItem value="mohammed">محمد علي</SelectItem>
                  <SelectItem value="khalid">خالد عبدالله</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">نوع الموعد</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">اجتماع</SelectItem>
                <SelectItem value="call">مكالمة</SelectItem>
                <SelectItem value="presentation">عرض تقديمي</SelectItem>
                <SelectItem value="review">مراجعة</SelectItem>
                <SelectItem value="other">أخرى</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>تاريخ الموعد</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-right"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP", { locale: ar })
                  ) : (
                    <span>اختر تاريخاً</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>وقت الموعد</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-right"
                >
                  <Clock className="ml-2 h-4 w-4" />
                  <span>اختر وقتاً</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="start">
                <div className="grid grid-cols-2 gap-2 py-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">ملاحظات</Label>
          <Textarea
            id="notes"
            placeholder="أدخل أي ملاحظات إضافية هنا"
            className="mt-1"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>إلغاء</Button>
        <Button type="submit">حفظ الموعد</Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
