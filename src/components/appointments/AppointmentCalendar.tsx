
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for appointments
const MOCK_APPOINTMENTS = [
  { id: 1, title: "اجتماع مع عميل جديد", date: new Date(2025, 3, 14), clientName: "أحمد محمد", time: "10:00 ص", type: "اجتماع", status: "مؤكد" },
  { id: 2, title: "متابعة عرض المنتج", date: new Date(2025, 3, 15), clientName: "سارة خالد", time: "02:30 م", type: "عرض", status: "مؤكد" },
  { id: 3, title: "مراجعة مشروع", date: new Date(2025, 3, 15), clientName: "محمد علي", time: "04:00 م", type: "مراجعة", status: "مؤكد" },
  { id: 4, title: "مكالمة مع فريق التطوير", date: new Date(2025, 3, 20), clientName: "فريق التطوير", time: "11:00 ص", type: "مكالمة", status: "معلق" },
  { id: 5, title: "اجتماع استراتيجي", date: new Date(2025, 3, 25), clientName: "خالد عبدالله", time: "01:00 م", type: "اجتماع", status: "مؤكد" },
];

const AppointmentCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSelect = (date: Date | undefined) => {
    setDate(date);
    setSelectedDate(date || null);
  };

  // Get appointments for the selected day
  const selectedDayAppointments = MOCK_APPOINTMENTS.filter(
    (appointment) => selectedDate && 
    appointment.date.getDate() === selectedDate.getDate() && 
    appointment.date.getMonth() === selectedDate.getMonth() && 
    appointment.date.getFullYear() === selectedDate.getFullYear()
  );

  // Function to check if a date has appointments
  const hasAppointment = (day: Date) => {
    return MOCK_APPOINTMENTS.some(
      appointment =>
        appointment.date.getDate() === day.getDate() &&
        appointment.date.getMonth() === day.getMonth() &&
        appointment.date.getFullYear() === day.getFullYear()
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <TooltipProvider>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="rounded-md border"
            modifiers={{
              hasAppointment: (date) => hasAppointment(date),
            }}
            modifiersClassNames={{
              hasAppointment: "bg-primary/10 font-bold text-primary",
            }}
            components={{
              DayContent: (props) => {
                const date = props.date;
                const hasAppt = hasAppointment(date);
                
                if (hasAppt) {
                  return (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="relative w-full h-full flex items-center justify-center">
                          {props.date.getDate()}
                          <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">يوجد مواعيد</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                
                return <>{props.date.getDate()}</>;
              },
            }}
          />
        </TooltipProvider>
      </div>

      <div className="md:w-1/2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {selectedDate ? (
              <>المواعيد في {selectedDate.toLocaleDateString('ar-SA')}</>
            ) : (
              'اختر تاريخ لعرض المواعيد'
            )}
          </h3>

          {selectedDayAppointments.length === 0 && selectedDate && (
            <p className="text-muted-foreground">لا توجد مواعيد في هذا اليوم</p>
          )}

          {selectedDayAppointments.map((appointment) => (
            <Card key={appointment.id} className="p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{appointment.title}</h4>
                  <p className="text-sm text-muted-foreground">مع: {appointment.clientName}</p>
                  <p className="text-sm text-muted-foreground">الوقت: {appointment.time}</p>
                </div>
                <Badge variant={appointment.status === "مؤكد" ? "default" : "outline"}>
                  {appointment.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
