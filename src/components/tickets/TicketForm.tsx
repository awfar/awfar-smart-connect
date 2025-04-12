
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

interface TicketFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onCancel, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">عنوان التذكرة</Label>
          <Input 
            id="title" 
            placeholder="أدخل عنوان التذكرة" 
            className="mt-1" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">وصف المشكلة</Label>
          <Textarea
            id="description"
            placeholder="اكتب وصفاً تفصيلياً للمشكلة"
            className="mt-1"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client">العميل</Label>
            <Select value={client} onValueChange={setClient} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر العميل" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>العملاء</SelectLabel>
                  <SelectItem value="ahmed">أحمد محمد</SelectItem>
                  <SelectItem value="khaled">خالد أحمد</SelectItem>
                  <SelectItem value="fatima">فاطمة خالد</SelectItem>
                  <SelectItem value="ali">علي محمود</SelectItem>
                  <SelectItem value="sara">سارة محمد</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">الفئة</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الفئات</SelectLabel>
                  <SelectItem value="customer-service">خدمة العملاء</SelectItem>
                  <SelectItem value="technical-support">الدعم الفني</SelectItem>
                  <SelectItem value="sales">المبيعات</SelectItem>
                  <SelectItem value="finance">المالية</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priority">الأولوية</Label>
            <Select value={priority} onValueChange={setPriority} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر الأولوية" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>مستوى الأولوية</SelectLabel>
                  <SelectItem value="low">منخفض</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                  <SelectItem value="urgent">عاجل</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignedTo">تعيين إلى</Label>
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="تعيين المسؤول" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الموظفين</SelectLabel>
                  <SelectItem value="sarah">سارة علي</SelectItem>
                  <SelectItem value="mohammed">محمد علي</SelectItem>
                  <SelectItem value="ahmed">أحمد خالد</SelectItem>
                  <SelectItem value="mohammed2">محمد سعيد</SelectItem>
                  <SelectItem value="khaled">خالد علي</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="attachments">المرفقات (اختياري)</Label>
          <Input 
            id="attachments" 
            type="file" 
            className="mt-1" 
            multiple
          />
          <p className="text-xs text-muted-foreground mt-1">يمكنك إرفاق ملفات متعددة (الحد الأقصى: 5 ملفات، 10 ميجابايت لكل ملف)</p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} type="button">إلغاء</Button>
        <Button type="submit">حفظ التذكرة</Button>
      </div>
    </form>
  );
};

export default TicketForm;
