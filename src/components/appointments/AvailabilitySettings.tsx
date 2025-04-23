
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const daysOfWeek = [
  { value: 0, label: "الأحد" },
  { value: 1, label: "الإثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
];

const AvailabilitySettings: React.FC = () => {
  const [availabilitySlots, setAvailabilitySlots] = useState<TimeSlot[]>([
    { id: "1", dayOfWeek: 0, startTime: "09:00", endTime: "17:00" },
    { id: "2", dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    { id: "3", dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
    { id: "4", dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
    { id: "5", dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
  ]);
  
  const [defaultMeetingDuration, setDefaultMeetingDuration] = useState("30");
  const [bufferTime, setBufferTime] = useState("10");
  const [defaultLocation, setDefaultLocation] = useState("zoom");
  const [bookingLinkEnabled, setBookingLinkEnabled] = useState(true);
  const [bookingLinkSlug, setBookingLinkSlug] = useState("your-name");
  const [allowPublicBooking, setAllowPublicBooking] = useState(true);
  
  const handleAddTimeSlot = () => {
    // Find first unused day of week
    const usedDays = new Set(availabilitySlots.map(slot => slot.dayOfWeek));
    const availableDay = daysOfWeek.find(day => !usedDays.has(day.value));
    
    if (availableDay) {
      const newSlot: TimeSlot = {
        id: `slot-${Date.now()}`,
        dayOfWeek: availableDay.value,
        startTime: "09:00",
        endTime: "17:00",
      };
      
      setAvailabilitySlots([...availabilitySlots, newSlot]);
    } else {
      toast.info("لقد قمت بإضافة جميع أيام الأسبوع");
    }
  };
  
  const handleRemoveTimeSlot = (id: string) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
  };
  
  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: any) => {
    setAvailabilitySlots(availabilitySlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };
  
  const handleSaveSettings = () => {
    // In a real app, save to API
    toast.success("تم حفظ إعدادات التوافر بنجاح");
  };
  
  const validateTimeSlots = () => {
    for (const slot of availabilitySlots) {
      if (slot.startTime >= slot.endTime) {
        return false;
      }
    }
    return true;
  };

  const generateBookingLink = () => {
    return `awfar.com/book/${bookingLinkSlug}`;
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>أوقات التوافر</CardTitle>
          <CardDescription>
            حدد الأيام والساعات التي تكون متاحًا فيها لحجز المواعيد
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availabilitySlots.map((slot) => (
              <div key={slot.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                <div className="md:col-span-4">
                  <Label htmlFor={`day-${slot.id}`}>اليوم</Label>
                  <Select
                    value={slot.dayOfWeek.toString()}
                    onValueChange={(value) => updateTimeSlot(slot.id, 'dayOfWeek', parseInt(value))}
                  >
                    <SelectTrigger id={`day-${slot.id}`}>
                      <SelectValue placeholder="اختر اليوم" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem 
                          key={day.value} 
                          value={day.value.toString()}
                          disabled={availabilitySlots.some(s => 
                            s.id !== slot.id && s.dayOfWeek === day.value
                          )}
                        >
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-3">
                  <Label htmlFor={`start-${slot.id}`}>من الساعة</Label>
                  <Input
                    id={`start-${slot.id}`}
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-3">
                  <Label htmlFor={`end-${slot.id}`}>إلى الساعة</Label>
                  <Input
                    id={`end-${slot.id}`}
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2 flex items-end justify-end h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTimeSlot(slot.id)}
                    className="text-destructive h-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={handleAddTimeSlot}
              className="mt-2 gap-2"
              disabled={availabilitySlots.length >= 7}
            >
              <Plus className="h-4 w-4" />
              إضافة فترة توافر جديدة
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>إعدادات الحجز</CardTitle>
          <CardDescription>
            خصص كيفية حجز المواعيد معك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="default-duration">المدة الافتراضية للموعد</Label>
                <Select
                  value={defaultMeetingDuration}
                  onValueChange={setDefaultMeetingDuration}
                >
                  <SelectTrigger id="default-duration">
                    <SelectValue placeholder="اختر المدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 دقيقة</SelectItem>
                    <SelectItem value="30">30 دقيقة</SelectItem>
                    <SelectItem value="45">45 دقيقة</SelectItem>
                    <SelectItem value="60">ساعة</SelectItem>
                    <SelectItem value="90">ساعة ونصف</SelectItem>
                    <SelectItem value="120">ساعتان</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="buffer-time">وقت الفاصل بين المواعيد</Label>
                <Select
                  value={bufferTime}
                  onValueChange={setBufferTime}
                >
                  <SelectTrigger id="buffer-time">
                    <SelectValue placeholder="اختر المدة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">بدون فاصل</SelectItem>
                    <SelectItem value="5">5 دقائق</SelectItem>
                    <SelectItem value="10">10 دقائق</SelectItem>
                    <SelectItem value="15">15 دقيقة</SelectItem>
                    <SelectItem value="30">30 دقيقة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="default-location">الموقع الافتراضي للمواعيد</Label>
                <Select
                  value={defaultLocation}
                  onValueChange={setDefaultLocation}
                >
                  <SelectTrigger id="default-location">
                    <SelectValue placeholder="اختر الموقع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="google-meet">Google Meet</SelectItem>
                    <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                    <SelectItem value="office">مكتب</SelectItem>
                    <SelectItem value="other">آخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>رابط الحجز</CardTitle>
          <CardDescription>
            أنشئ رابطًا شخصيًا يمكن للعملاء استخدامه لحجز مواعيد معك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Switch
                id="booking-link-enabled"
                checked={bookingLinkEnabled}
                onCheckedChange={setBookingLinkEnabled}
              />
              <Label htmlFor="booking-link-enabled">تفعيل رابط الحجز</Label>
            </div>
            
            {bookingLinkEnabled && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="booking-link-slug">المعرف الخاص بك في رابط الحجز</Label>
                  <div className="flex mt-1.5">
                    <div className="bg-muted px-3 py-2 border border-input rounded-l-md text-sm text-muted-foreground">
                      awfar.com/book/
                    </div>
                    <Input
                      id="booking-link-slug"
                      value={bookingLinkSlug}
                      onChange={(e) => setBookingLinkSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Switch
                    id="public-booking"
                    checked={allowPublicBooking}
                    onCheckedChange={setAllowPublicBooking}
                  />
                  <Label htmlFor="public-booking">
                    السماح بالحجز العام (بدون تسجيل دخول)
                  </Label>
                </div>
                
                {bookingLinkSlug && (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="text-sm font-medium mb-1">رابط الحجز الخاص بك:</div>
                    <div className="flex justify-between items-center">
                      <code className="text-sm">{generateBookingLink()}</code>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="gap-2 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(generateBookingLink());
                          toast.success("تم نسخ الرابط");
                        }}
                      >
                        نسخ الرابط
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          disabled={!validateTimeSlots()}
          className="gap-2"
        >
          <Check className="h-4 w-4" />
          حفظ الإعدادات
        </Button>
      </div>
    </div>
  );
};

export default AvailabilitySettings;
