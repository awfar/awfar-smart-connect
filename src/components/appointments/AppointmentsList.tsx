
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, CheckCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AppointmentForm from "./AppointmentForm";
import { useBreakpoints } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "@/services/appointments/types";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import AppointmentDetail from "./AppointmentDetail";

// Define status mapping for display
const statusDisplay = {
  scheduled: "مجدول",
  completed: "مكتمل",
  cancelled: "ملغي"
};

// Sample initial appointments data - replace with API call
const MOCK_APPOINTMENTS: Partial<Appointment>[] = [
  { 
    id: "1", 
    title: "اجتماع مع عميل جديد", 
    start_time: new Date(2025, 3, 14, 10, 0).toISOString(), 
    end_time: new Date(2025, 3, 14, 11, 0).toISOString(), 
    status: "scheduled", 
    description: "اجتماع",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    location: "office",
    owner_id: "1"
  },
  { 
    id: "2", 
    title: "متابعة عرض المنتج", 
    start_time: new Date(2025, 3, 15, 14, 30).toISOString(), 
    end_time: new Date(2025, 3, 15, 15, 30).toISOString(), 
    status: "scheduled", 
    description: "عرض",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    location: "zoom",
    owner_id: "1"
  },
  { 
    id: "3", 
    title: "مراجعة مشروع", 
    start_time: new Date(2025, 3, 15, 16, 0).toISOString(), 
    end_time: new Date(2025, 3, 15, 17, 0).toISOString(), 
    status: "scheduled", 
    description: "مراجعة",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    location: "google-meet",
    owner_id: "2"
  },
  { 
    id: "4", 
    title: "مكالمة مع فريق التطوير", 
    start_time: new Date(2025, 3, 20, 11, 0).toISOString(), 
    end_time: new Date(2025, 3, 20, 12, 0).toISOString(), 
    status: "cancelled", 
    description: "مكالمة",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    location: "microsoft-teams",
    owner_id: "1"
  },
  { 
    id: "5", 
    title: "اجتماع استراتيجي", 
    start_time: new Date(2025, 3, 25, 13, 0).toISOString(), 
    end_time: new Date(2025, 3, 25, 14, 0).toISOString(), 
    status: "scheduled", 
    description: "اجتماع",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    location: "office",
    owner_id: "3"
  },
];

interface AppointmentsListProps {
  filter?: "all" | "my" | "team" | "upcoming";
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ filter = "all" }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS.map(app => ({
    ...app,
    created_at: app.created_at || new Date().toISOString(),
    updated_at: app.updated_at || new Date().toISOString()
  })) as Appointment[]);
  
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const { isMobile } = useBreakpoints();

  // Filter appointments based on the selected tab
  const filteredAppointments = React.useMemo(() => {
    switch (filter) {
      case "my":
        // In a real app, filter by current user ID
        return appointments.filter(app => app.owner_id === "1");
      case "team":
        // In a real app, filter by team IDs
        return appointments.filter(app => 
          ["1", "2", "3"].includes(app.owner_id || ""));
      case "upcoming":
        // Filter for upcoming appointments (today and future)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return appointments.filter(app => {
          const appDate = new Date(app.start_time);
          return appDate >= today;
        });
      default:
        // All appointments
        return appointments;
    }
  }, [appointments, filter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm");
  };

  const handleViewDetail = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsViewingDetail(true);
    }
  };

  const handleEdit = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsEditing(true);
    }
  };

  const handleDelete = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (appointmentToDelete !== null) {
      setAppointments(appointments.filter(a => a.id !== appointmentToDelete));
      toast.success("تم حذف الموعد بنجاح");
      setDeleteConfirmOpen(false);
      setAppointmentToDelete(null);
    }
  };

  const handleFormSubmit = async (appointmentData: any) => {
    if (selectedAppointment) {
      // Edit existing appointment
      setAppointments(appointments.map(a => 
        a.id === selectedAppointment.id ? { ...a, ...appointmentData } : a
      ));
      toast.success("تم تحديث الموعد بنجاح");
    } else {
      // Add new appointment
      const newId = Math.max(...appointments.map(a => parseInt(a.id)), 0) + 1;
      const newAppointment: Appointment = {
        id: newId.toString(),
        title: appointmentData.title || "",
        start_time: appointmentData.start_time || new Date().toISOString(),
        end_time: appointmentData.end_time || new Date().toISOString(),
        location: appointmentData.location || "",
        status: (appointmentData.status || "scheduled") as AppointmentStatus,
        description: appointmentData.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setAppointments([newAppointment, ...appointments]);
      toast.success("تم إضافة الموعد بنجاح");
    }
    setIsEditing(false);
    setSelectedAppointment(undefined);
    return Promise.resolve();
  };

  const handleMarkAsComplete = (appointmentId: string) => {
    setAppointments(appointments.map(a => 
      a.id === appointmentId ? { ...a, status: "completed" } : a
    ));
    toast.success("تم تحديث حالة الموعد إلى مكتمل");
  };

  // Map status to display text
  const getStatusDisplay = (status: AppointmentStatus) => {
    return statusDisplay[status] || status;
  };

  // Determine badge variant based on status
  const getStatusVariant = (status: AppointmentStatus) => {
    if (status === "scheduled") return "default";
    if (status === "completed") return "success";
    return "destructive";
  };

  // Get location display
  const getLocationDisplay = (location?: string) => {
    if (!location) return "-";
    
    switch(location) {
      case "zoom": return "Zoom";
      case "google-meet": return "Google Meet";
      case "microsoft-teams": return "Microsoft Teams";
      case "office": return "مكتب";
      default: return location;
    }
  };

  // Handle close detail/edit dialog
  const handleCloseDialog = () => {
    setIsViewingDetail(false);
    setIsEditing(false);
    setSelectedAppointment(undefined);
  };

  return (
    <div className="w-full">
      {isMobile ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{appointment.title}</h3>
                  <Badge variant={getStatusVariant(appointment.status)}>
                    {getStatusDisplay(appointment.status)}
                  </Badge>
                </div>
                
                <div className="mt-2 text-sm">
                  <div className="text-muted-foreground mb-1">
                    {formatDate(appointment.start_time)} - {formatTime(appointment.start_time)} إلى {formatTime(appointment.end_time)}
                  </div>
                  <div className="text-muted-foreground mb-1">
                    {getLocationDisplay(appointment.location)}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-3">
                  {appointment.status !== "completed" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMarkAsComplete(appointment.id)}
                      className="gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      اكتمل
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetail(appointment.id)}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    عرض
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(appointment.id)}
                    className="gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    تعديل
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(appointment.id)}
                    className="gap-1 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد مواعيد متاحة
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الوقت</TableHead>
                <TableHead>الموقع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.title}</TableCell>
                  <TableCell>{formatDate(appointment.start_time)}</TableCell>
                  <TableCell>
                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                  </TableCell>
                  <TableCell>
                    {getLocationDisplay(appointment.location)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(appointment.status)}>
                      {getStatusDisplay(appointment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      {appointment.status !== "completed" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleMarkAsComplete(appointment.id)}
                          title="تعيين كمكتمل"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleViewDetail(appointment.id)}
                        title="عرض التفاصيل"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(appointment.id)}
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(appointment.id)}
                        title="حذف"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    لا توجد مواعيد متاحة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Appointment Detail Dialog */}
      <Dialog 
        open={isViewingDetail} 
        onOpenChange={(open) => {
          if (!open) handleCloseDialog();
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedAppointment && (
            <AppointmentDetail
              appointment={selectedAppointment}
              onEdit={() => {
                setIsViewingDetail(false);
                setIsEditing(true);
              }}
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
          <AppointmentForm 
            appointment={selectedAppointment}
            onCancel={handleCloseDialog}
            onClose={handleCloseDialog}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirmOpen} 
        onOpenChange={setDeleteConfirmOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الموعد؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف هذا الموعد نهائيًا ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppointmentsList;
