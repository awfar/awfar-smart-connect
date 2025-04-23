
import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBreakpoints } from "@/hooks/use-mobile";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/services/appointments/types";
import { CalendarClock, ChevronRight, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetail from "./AppointmentDetail";
import { format, addMonths, subMonths, addDays, isSameDay } from "date-fns";

// Mock data - replace with API calls to fetch appointments
const MOCK_APPOINTMENTS: Partial<Appointment>[] = [
  { id: "1", title: "اجتماع مع عميل جديد", start_time: new Date(2025, 3, 14, 10, 0).toISOString(), end_time: new Date(2025, 3, 14, 11, 0).toISOString(), status: "scheduled", location: "office", owner_id: "1" },
  { id: "2", title: "متابعة عرض المنتج", start_time: new Date(2025, 3, 15, 14, 30).toISOString(), end_time: new Date(2025, 3, 15, 15, 30).toISOString(), status: "scheduled", location: "zoom", owner_id: "1" },
  { id: "3", title: "مراجعة مشروع", start_time: new Date(2025, 3, 15, 16, 0).toISOString(), end_time: new Date(2025, 3, 15, 17, 0).toISOString(), status: "scheduled", location: "google-meet", owner_id: "2" },
  { id: "4", title: "مكالمة مع فريق التطوير", start_time: new Date(2025, 3, 20, 11, 0).toISOString(), end_time: new Date(2025, 3, 20, 12, 0).toISOString(), status: "cancelled", location: "microsoft-teams", owner_id: "1" },
  { id: "5", title: "اجتماع استراتيجي", start_time: new Date(2025, 3, 25, 13, 0).toISOString(), end_time: new Date(2025, 3, 25, 14, 0).toISOString(), status: "scheduled", location: "office", owner_id: "3" },
];

// Define calendar view types
type CalendarViewType = 'month' | 'week' | 'day';

interface AppointmentCalendarProps {
  filter?: "all" | "my" | "team" | "upcoming";
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ filter = "all" }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<CalendarViewType>('month');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isMobile } = useBreakpoints();

  // Filter appointments based on the selected tab
  const filteredAppointments = useMemo(() => {
    let appointments = [...MOCK_APPOINTMENTS] as Appointment[];
    
    switch (filter) {
      case "my":
        // In a real app, filter by current user ID
        appointments = appointments.filter(appointment => appointment.owner_id === "1");
        break;
      case "team":
        // In a real app, filter by team IDs
        appointments = appointments.filter(appointment => 
          ["1", "2", "3"].includes(appointment.owner_id || ""));
        break;
      case "upcoming":
        // Filter for upcoming appointments (today and future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        appointments = appointments.filter(appointment => {
          const appDate = new Date(appointment.start_time);
          return appDate >= today;
        });
        break;
      default:
        // All appointments
        break;
    }
    
    return appointments;
  }, [filter]);

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Navigate to previous month/week/day
  const goToPrevious = () => {
    if (calendarView === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  // Navigate to next month/week/day
  const goToNext = () => {
    if (calendarView === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (calendarView === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  // Function to check if a date has appointments
  const hasAppointment = (day: Date) => {
    return filteredAppointments.some(
      appointment => {
        const appointmentDate = new Date(appointment.start_time);
        return isSameDay(appointmentDate, day);
      }
    );
  };

  // Function to get appointments for a specific day
  const getAppointmentsForDay = (day: Date) => {
    return filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.start_time);
      return isSameDay(appointmentDate, day);
    });
  };

  // Function to render appointment cards for a specific day
  const renderAppointmentsForDay = (day: Date) => {
    const dayAppointments = getAppointmentsForDay(day);
    
    return (
      <div className="space-y-2">
        {dayAppointments.map((appointment) => (
          <Card 
            key={appointment.id} 
            className={`p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
              appointment.status === "cancelled" ? "opacity-60" : ""
            }`}
            onClick={() => {
              setSelectedAppointment(appointment);
              setIsViewingDetail(true);
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium">{appointment.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(appointment.start_time), "HH:mm")} - 
                  {format(new Date(appointment.end_time), "HH:mm")}
                </p>
              </div>
              <Badge 
                variant={
                  appointment.status === "scheduled" ? "default" : 
                  appointment.status === "completed" ? "success" : 
                  "outline"
                }
                className="text-xs"
              >
                {appointment.status === "scheduled" ? "مجدول" :
                 appointment.status === "completed" ? "مكتمل" : "ملغي"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Handle edit appointment
  const handleEditAppointment = () => {
    setIsViewingDetail(false);
    setIsEditing(true);
  };

  // Handle save appointment changes
  const handleSaveAppointment = async () => {
    // In a real app, save changes to the API
    setIsEditing(false);
    setSelectedAppointment(null);
    return Promise.resolve();
  };

  // Handle close appointment detail/edit dialog
  const handleCloseDialog = () => {
    setIsViewingDetail(false);
    setIsEditing(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToPrevious}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={goToToday}
          >
            اليوم
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToNext}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-lg font-medium">
            {format(currentDate, "MMMM yyyy")}
          </div>
        </div>
        
        <Select
          value={calendarView}
          onValueChange={(value) => setCalendarView(value as CalendarViewType)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">شهر</SelectItem>
            <SelectItem value="week">أسبوع</SelectItem>
            <SelectItem value="day">يوم</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <TooltipProvider>
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => date && setCurrentDate(date)}
              className="rounded-md border"
              month={currentDate}
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
            <h3 className="text-lg font-medium flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              المواعيد في {format(currentDate, "yyyy-MM-dd")}
            </h3>

            {getAppointmentsForDay(currentDate).length === 0 ? (
              <p className="text-muted-foreground">لا توجد مواعيد في هذا اليوم</p>
            ) : (
              renderAppointmentsForDay(currentDate)
            )}
          </div>
        </div>
      </div>

      {/* Appointment Detail Dialog */}
      <Dialog
        open={isViewingDetail && !isEditing}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الموعد</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentDetail
              appointment={selectedAppointment as Appointment}
              onEdit={handleEditAppointment}
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog
        open={isEditing}
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الموعد</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <AppointmentForm
              appointment={selectedAppointment as Appointment}
              onSubmit={handleSaveAppointment}
              onCancel={handleCloseDialog}
              onClose={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentCalendar;
