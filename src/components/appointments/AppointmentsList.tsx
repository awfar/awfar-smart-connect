
import React, { useState, useEffect } from 'react';
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
import { 
  fetchAppointments,
  fetchAppointmentsByUserId, 
  fetchAppointmentsByTeam, 
  fetchUpcomingAppointments,
  createAppointment, 
  updateAppointment, 
  deleteAppointment, 
  markAppointmentAsCompleted 
} from '@/services/appointments';
import { supabase } from '@/integrations/supabase/client';

// Define status mapping for display
const statusDisplay = {
  scheduled: "مجدول",
  completed: "مكتمل",
  cancelled: "ملغي"
};

interface AppointmentsListProps {
  filter?: "all" | "my" | "team" | "upcoming";
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ filter = "all" }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const { isMobile } = useBreakpoints();

  // Get current user
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };

    getUserId();
  }, []);

  // Load appointments based on filter
  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      try {
        let appointmentsData: Appointment[] = [];

        switch (filter) {
          case "my":
            if (currentUserId) {
              appointmentsData = await fetchAppointmentsByUserId(currentUserId);
            }
            break;
          case "team":
            // In a real app, you would get the user's team ID and pass it
            // For now, we'll use a mock team ID or just show all appointments
            appointmentsData = await fetchAppointmentsByTeam("1");
            break;
          case "upcoming":
            appointmentsData = await fetchUpcomingAppointments();
            break;
          case "all":
          default:
            appointmentsData = await fetchAppointments();
            break;
        }

        // Ensure we always have an array, even if the API returned undefined
        setAppointments(appointmentsData || []);
      } catch (error) {
        console.error(`Error loading ${filter} appointments:`, error);
        toast.error(`فشل في تحميل المواعيد`);
        // Set empty array in case of error
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, [filter, currentUserId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm");
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
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

  const confirmDelete = async () => {
    if (appointmentToDelete !== null) {
      try {
        const success = await deleteAppointment(appointmentToDelete);
        if (success) {
          setAppointments(appointments.filter(a => a.id !== appointmentToDelete));
          setDeleteConfirmOpen(false);
          setAppointmentToDelete(null);
        }
      } catch (error) {
        console.error("Error deleting appointment:", error);
        toast.error("فشل في حذف الموعد");
      }
    }
  };

  const handleFormSubmit = async (appointmentData: any) => {
    try {
      if (selectedAppointment) {
        // Edit existing appointment
        const updatedAppointment = await updateAppointment(selectedAppointment.id, appointmentData);
        if (updatedAppointment) {
          setAppointments(appointments.map(a => 
            a.id === selectedAppointment.id ? updatedAppointment : a
          ));
        }
      } else {
        // Add new appointment
        const newAppointment = await createAppointment(appointmentData);
        if (newAppointment) {
          setAppointments([newAppointment, ...appointments]);
        }
      }
      
      setIsEditing(false);
      setSelectedAppointment(undefined);
      return Promise.resolve();
    } catch (error) {
      console.error("Error submitting appointment form:", error);
      toast.error("فشل في حفظ الموعد");
      return Promise.reject(error);
    }
  };

  const handleMarkAsComplete = async (appointmentId: string) => {
    try {
      const updatedAppointment = await markAppointmentAsCompleted(appointmentId);
      if (updatedAppointment) {
        setAppointments(appointments.map(a => 
          a.id === appointmentId ? updatedAppointment : a
        ));
      }
    } catch (error) {
      console.error("Error marking appointment as complete:", error);
      toast.error("فشل في تحديث حالة الموعد");
    }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isMobile ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
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
          
          {appointments.length === 0 && (
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
              {appointments.map((appointment) => (
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

              {appointments.length === 0 && (
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
