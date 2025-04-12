
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, CalendarClock, User, Clock } from "lucide-react";
import { toast } from "sonner";

export interface Appointment {
  id: number;
  title: string;
  date: Date;
  clientName: string;
  time: string;
  type: string;
  status: string;
  description?: string;
}

interface AppointmentFormProps {
  onClose: () => void;
  onSubmit: (appointment: Partial<Appointment>) => void;
  initialData?: Appointment;
  title: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState<Partial<Appointment>>({
    title: initialData?.title || "",
    clientName: initialData?.clientName || "",
    date: initialData?.date || new Date(),
    time: initialData?.time || "10:00",
    type: initialData?.type || "اجتماع",
    status: initialData?.status || "مؤكد",
    description: initialData?.description || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof Partial<Appointment>, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      onSubmit(formData);
      toast.success(initialData ? "تم تحديث الموعد بنجاح" : "تم إضافة الموعد بنجاح");
      onClose();
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error(initialData ? "فشل تحديث الموعد" : "فشل إضافة الموعد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان الموعد</Label>
            <Input 
              id="title" 
              value={formData.title} 
              onChange={(e) => handleChange("title", e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">اسم العميل</Label>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input 
                id="clientName" 
                value={formData.clientName} 
                onChange={(e) => handleChange("clientName", e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <CalendarClock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input 
                  id="date" 
                  type="date"
                  value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''} 
                  onChange={(e) => {
                    const dateValue = e.target.value ? new Date(e.target.value) : new Date();
                    handleChange("date", dateValue);
                  }} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">الوقت</Label>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Input 
                  id="time" 
                  type="time"
                  value={formData.time} 
                  onChange={(e) => handleChange("time", e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">نوع الموعد</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="اجتماع">اجتماع</SelectItem>
                  <SelectItem value="مكالمة">مكالمة</SelectItem>
                  <SelectItem value="عرض">عرض</SelectItem>
                  <SelectItem value="مراجعة">مراجعة</SelectItem>
                  <SelectItem value="آخر">آخر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">الحالة</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مؤكد">مؤكد</SelectItem>
                  <SelectItem value="معلق">معلق</SelectItem>
                  <SelectItem value="ملغي">ملغي</SelectItem>
                  <SelectItem value="مكتمل">مكتمل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">التفاصيل</Label>
            <Textarea 
              id="description" 
              rows={3}
              value={formData.description || ""} 
              onChange={(e) => handleChange("description", e.target.value)} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>إلغاء</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "جاري الحفظ..." : initialData ? "تحديث" : "إضافة"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AppointmentForm;
