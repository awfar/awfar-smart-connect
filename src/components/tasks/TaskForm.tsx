
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
import { Checkbox } from "@/components/ui/checkbox";

interface TaskFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onCancel, onSave }) => {
  const [date, setDate] = useState<Date | undefined>();
  const [reminderEnabled, setReminderEnabled] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">عنوان المهمة</Label>
          <Input id="title" placeholder="أدخل عنوان المهمة" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="description">وصف المهمة</Label>
          <Textarea
            id="description"
            placeholder="أدخل وصفاً تفصيلياً للمهمة"
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="assignee">تعيين إلى</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الشخص المكلف" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الفريق</SelectLabel>
                  <SelectItem value="ahmed">أحمد محمد</SelectItem>
                  <SelectItem value="sara">سارة خالد</SelectItem>
                  <SelectItem value="khalid">خالد أحمد</SelectItem>
                  <SelectItem value="fatima">فاطمة محمد</SelectItem>
                  <SelectItem value="mohammed">محمد خالد</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">الحالة</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
                <SelectItem value="معلق">معلق</SelectItem>
                <SelectItem value="ملغي">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">الأولوية</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="منخفض">منخفض</SelectItem>
                <SelectItem value="متوسط">متوسط</SelectItem>
                <SelectItem value="عالي">عالي</SelectItem>
                <SelectItem value="عاجل">عاجل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>تاريخ الاستحقاق</Label>
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
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox 
              id="reminder"
              checked={reminderEnabled}
              onCheckedChange={(checked) => setReminderEnabled(!!checked)} 
            />
            <Label htmlFor="reminder" className="cursor-pointer">تفعيل التذكير</Label>
          </div>
          
          {reminderEnabled && (
            <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="reminderDate">تاريخ التذكير</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1 justify-start text-right"
                    >
                      <CalendarIcon className="ml-2 h-4 w-4" />
                      <span>اختر تاريخاً</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="reminderTime">وقت التذكير</Label>
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
                  <PopoverContent className="w-56" align="start">
                    <div className="grid grid-cols-2 gap-2 py-2">
                      {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"].map((time) => (
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
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel}>إلغاء</Button>
        <Button type="submit">حفظ المهمة</Button>
      </div>
    </form>
  );
};

export default TaskForm;
