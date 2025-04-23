
import React from 'react';
import { Appointment } from '@/services/appointments/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarClock, MapPin, Clock, Link, User, Building, FileText, Edit, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { markAppointmentAsCompleted, deleteAppointment } from '@/services/appointments/appointmentsService';

interface AppointmentDetailProps {
  appointment: Appointment;
  onEdit: () => void;
  onClose: () => void;
}

const AppointmentDetail: React.FC<AppointmentDetailProps> = ({ 
  appointment,
  onEdit,
  onClose,
}) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm");
  };

  // Handle delete appointment
  const handleDeleteAppointment = async () => {
    try {
      const success = await deleteAppointment(appointment.id);
      if (success) {
        toast.success("تم حذف الموعد بنجاح");
        onClose();
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("فشل في حذف الموعد");
    }
  };

  // Handle mark as completed
  const handleMarkAsCompleted = async () => {
    try {
      await markAppointmentAsCompleted(appointment.id);
      toast.success("تم تحديث حالة الموعد");
      onClose();
    } catch (error) {
      console.error("Error marking appointment as completed:", error);
      toast.error("فشل في تحديث حالة الموعد");
    }
  };

  // Get location display name
  const getLocationDisplay = (location?: string) => {
    if (!location) return "غير محدد";
    
    switch(location) {
      case "zoom": return "Zoom";
      case "google-meet": return "Google Meet";
      case "microsoft-teams": return "Microsoft Teams";
      case "office": return "مكتب";
      default: return location;
    }
  };
  
  // Get status display name and color
  const getStatusDisplay = (status: string) => {
    switch(status) {
      case "scheduled": return { text: "مجدول", variant: "default" as const };
      case "completed": return { text: "مكتمل", variant: "success" as const };
      case "cancelled": return { text: "ملغي", variant: "destructive" as const };
      default: return { text: status, variant: "outline" as const };
    }
  };

  const statusInfo = getStatusDisplay(appointment.status);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold">{appointment.title}</h2>
        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
      </div>

      {appointment.description && (
        <div className="text-sm text-muted-foreground">
          {appointment.description}
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {formatDate(appointment.start_time)} {formatTime(appointment.start_time)} - 
            {appointment.is_all_day ? " طوال اليوم" : ` ${formatTime(appointment.end_time)}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {getLocationDisplay(appointment.location)}
            {appointment.location_details && ` - ${appointment.location_details}`}
          </span>
        </div>

        {appointment.client_id && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              جهة الاتصال: {appointment.client_id}
            </span>
          </div>
        )}

        {appointment.company_id && (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              الشركة: {appointment.company_id}
            </span>
          </div>
        )}

        {appointment.reminder_time && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              التذكير قبل: {appointment.reminder_time} دقيقة
            </span>
          </div>
        )}

        {appointment.related_deal_id && (
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              صفقة مرتبطة: {appointment.related_deal_id}
            </span>
          </div>
        )}
      </div>

      {appointment.notes && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">ملاحظات</h3>
          </div>
          <div className="text-sm bg-muted p-3 rounded-md">
            {appointment.notes}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        {appointment.status !== "completed" && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleMarkAsCompleted}
          >
            <CheckCircle className="h-4 w-4" />
            تم الاكتمال
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          تعديل
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" />
              حذف
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من حذف هذا الموعد؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف هذا الموعد نهائياً ولا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAppointment}>
                تأكيد الحذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AppointmentDetail;
