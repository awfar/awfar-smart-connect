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
import { CalendarClock, Edit, Trash2, PlusCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AppointmentForm from "./AppointmentForm";
import { useBreakpoints } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Appointment } from "@/services/appointments/types";
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

// Mock data for appointments
const INITIAL_APPOINTMENTS = [
  { id: "1", title: "اجتماع مع عميل جديد", start_time: new Date(2025, 3, 14).toISOString(), clientName: "أحمد محمد", end_time: new Date(2025, 3, 14, 11, 0).toISOString(), type: "اجتماع", status: "مؤكد" },
  { id: "2", title: "متابعة عرض المنتج", start_time: new Date(2025, 3, 15).toISOString(), clientName: "سارة خالد", end_time: new Date(2025, 3, 15, 15, 30).toISOString(), type: "عرض", status: "مؤكد" },
  { id: "3", title: "مراجعة مشروع", start_time: new Date(2025, 3, 15).toISOString(), clientName: "محمد علي", end_time: new Date(2025, 3, 15, 16, 0).toISOString(), type: "مراجعة", status: "مؤكد" },
  { id: "4", title: "مكالمة مع فريق التطوير", start_time: new Date(2025, 3, 20).toISOString(), clientName: "فريق التطوير", end_time: new Date(2025, 3, 20, 12, 0).toISOString(), type: "مكالمة", status: "معلق" },
  { id: "5", title: "اجتماع استراتيجي", start_time: new Date(2025, 3, 25).toISOString(), clientName: "خالد عبدالله", end_time: new Date(2025, 3, 25, 14, 0).toISOString(), type: "اجتماع", status: "مؤكد" },
];

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS as unknown as Appointment[]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const { isMobile } = useBreakpoints();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  const handleNewAppointment = () => {
    setEditingAppointment(undefined);
    setShowForm(true);
  };

  const handleEdit = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setEditingAppointment(appointment);
      setShowForm(true);
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
    if (editingAppointment) {
      // Edit existing appointment
      setAppointments(appointments.map(a => 
        a.id === editingAppointment.id ? { ...a, ...appointmentData } : a
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
        status: appointmentData.status || "مؤكد",
        description: appointmentData.description,
      };
      setAppointments([newAppointment, ...appointments]);
      toast.success("تم إضافة الموعد بنجاح");
    }
    setShowForm(false);
    return Promise.resolve();
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">المواعيد</h2>
        <Button onClick={handleNewAppointment} size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          إضافة موعد
        </Button>
      </div>

      {isMobile ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{appointment.title}</h3>
                  <Badge variant={appointment.status === "مؤكد" ? "default" : "outline"}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {appointment.client_id}
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(appointment.start_time)} - {appointment.end_time ? new Date(appointment.end_time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
                <div className="flex justify-end space-x-2 rtl:space-x-reverse mt-3">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(appointment.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(appointment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>العنوان</TableHead>
                <TableHead>العميل</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الوقت</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.title}</TableCell>
                  <TableCell>{appointment.client_id}</TableCell>
                  <TableCell>{formatDate(appointment.start_time)}</TableCell>
                  <TableCell>{new Date(appointment.start_time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarClock className="ml-2 h-4 w-4 text-muted-foreground" />
                      <span>{appointment.description || "موعد"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={appointment.status === "مؤكد" ? "default" : "outline"}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <AppointmentForm 
            onCancel={() => setShowForm(false)} 
            onSubmit={handleFormSubmit} 
            appointment={editingAppointment}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
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
