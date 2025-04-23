
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { CalendarClock, Check, Clock, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BookingPageProps {
  userSlug?: string;
}

const BookingPage: React.FC<BookingPageProps> = ({ userSlug = 'demo-user' }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | undefined>(undefined);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    meetingType: 'zoom',
    notes: '',
  });
  
  // Mock user data
  const userData = {
    name: "أحمد محمد",
    position: "مستشار المبيعات",
    avatar: "/placeholder.svg",
    meetingTypes: [
      { id: "zoom", label: "اجتماع Zoom" },
      { id: "google-meet", label: "Google Meet" },
      { id: "office", label: "مقابلة في المكتب" },
      { id: "phone", label: "مكالمة هاتفية" },
    ],
    meetingDuration: 30, // minutes
  };
  
  // Mock available time slots
  const availableTimeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMeetingTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, meetingType: value }));
  };
  
  const handleNextStep = () => {
    if (formStep === 1 && (!selectedDate || !selectedTimeSlot)) {
      toast.error("يرجى تحديد التاريخ والوقت");
      return;
    }
    
    if (formStep === 2 && (!formData.name || !formData.email)) {
      toast.error("يرجى تعبئة الاسم والبريد الإلكتروني");
      return;
    }
    
    if (formStep < 3) {
      setFormStep(formStep === 1 ? 2 : 3);
    }
  };
  
  const handlePreviousStep = () => {
    if (formStep > 1) {
      setFormStep(formStep === 2 ? 1 : 2);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, submit to API
    toast.success("تم حجز الموعد بنجاح!");
    
    // Reset form
    setTimeout(() => {
      setFormStep(1);
      setSelectedDate(undefined);
      setSelectedTimeSlot(undefined);
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        meetingType: 'zoom',
        notes: '',
      });
    }, 2000);
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-2xl">{userData.name}</CardTitle>
          <CardDescription>{userData.position}</CardDescription>
        </CardHeader>
        
        <CardContent>
          {formStep === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    اختر التاريخ
                  </h3>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      // Disable past dates and weekends in this example
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const dayOfWeek = date.getDay();
                      return date < today || dayOfWeek === 5 || dayOfWeek === 6; // Friday and Saturday
                    }}
                    className="rounded-md border"
                  />
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    مدة الاجتماع: {userData.meetingDuration} دقيقة
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    اختر الوقت
                  </h3>
                  
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimeSlots.map(time => (
                        <Button
                          key={time}
                          variant={selectedTimeSlot === time ? "default" : "outline"}
                          className="justify-start"
                          onClick={() => setSelectedTimeSlot(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      يرجى اختيار تاريخ أولاً
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {formStep === 2 && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md mb-6">
                <div className="font-medium">تفاصيل الموعد</div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedTimeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.meetingTypes.find(type => type.id === formData.meetingType)?.label || formData.meetingType}</span>
                  </div>
                  <div className="col-span-2 text-muted-foreground">
                    مدة الاجتماع: {userData.meetingDuration} دقيقة
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">الاسم <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="الاسم الكامل"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">البريد الإلكتروني <span className="text-destructive">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@company.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966 5x xxx xxxx"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyName">اسم الشركة</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="اسم الشركة"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="meetingType">نوع الاجتماع</Label>
                  <Select
                    value={formData.meetingType}
                    onValueChange={handleMeetingTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر نوع الاجتماع" />
                    </SelectTrigger>
                    <SelectContent>
                      {userData.meetingTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="أضف أي معلومات قد تكون مفيدة للاجتماع"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}
          
          {formStep === 3 && (
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-md text-center">
                <Check className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <h3 className="text-xl font-bold mb-2">تم تأكيد الموعد!</h3>
                <p>
                  تم حجز موعد مع {userData.name} في يوم{' '}
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} الساعة {selectedTimeSlot}.
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <h4 className="font-medium mb-2">تفاصيل الموعد</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedTimeSlot} ({userData.meetingDuration} دقيقة)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.meetingTypes.find(type => type.id === formData.meetingType)?.label || formData.meetingType}</span>
                  </li>
                </ul>
                
                <div className="mt-4">
                  <p className="text-sm">
                    تم إرسال تفاصيل الاجتماع إلى بريدك الإلكتروني {formData.email}.
                    ستتلقى تذكيرًا قبل الموعد بساعة.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button variant="outline" onClick={() => setFormStep(1)}>
                  حجز موعد آخر
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        {formStep < 3 && (
          <CardFooter className="flex justify-between">
            {formStep > 1 ? (
              <Button variant="outline" onClick={handlePreviousStep}>
                السابق
              </Button>
            ) : (
              <div></div>
            )}
            
            {formStep < 3 ? (
              <Button onClick={handleNextStep}>
                {formStep === 1 ? 'التالي' : 'تأكيد الحجز'}
              </Button>
            ) : null}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default BookingPage;
