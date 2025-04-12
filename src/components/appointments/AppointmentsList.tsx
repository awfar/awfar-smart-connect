
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
import AppointmentForm, { Appointment } from "./AppointmentForm";
import { useBreakpoints } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
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
  { id: 1, title: "اجتماع مع عميل جديد", date: new Date(2025, 3, 14), clientName: "أحمد محمد", time: "10:00 ص", type: "اجتماع", status: "مؤكد" },
  { id: 2, title: "متابعة عرض المنتج", date: new Date(2025, 3, 15), clientName: "سارة خالد", time: "02:30 م", type: "عرض", status: "مؤكد" },
  { id: 3, title: "مراجعة مشروع", date: new Date(2025, 3, 15), clientName: "محمد علي", time: "04:00 م", type: "مراجعة", status: "مؤكد" },
  { id: 4, title: "مكالمة مع فريق التطوير", date: new Date(2025, 3, 20), clientName: "فريق التطوير", time: "11:00 ص", type: "مكالمة", status: "معلق" },
  { id: 5, title: "اجتماع استراتيجي", date: new Date(2025, 3, 25), clientName: "خالد عبدالله", time: "01:00 م", type: "اجتماع", status: "مؤكد" },
];

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);
  const { isMobile } = useBreakpoints();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA');
  };

  const handleNewAppointment = () => {
    setEditingAppointment(undefined);
    setShowForm(true);
  };

  const handleEdit = (appointmentId: number) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setEditingAppointment(appointment);
      setShowForm(true);
    }
  };

  const handleDelete = (appointmentId: number) => {
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

  const handleFormSubmit = (appointmentData: Partial<Appointment>) => {
    if (editingAppointment) {
      // Edit existing appointment
      setAppointments(appointments.map(a => 
        a.id === editingAppointment.id ? { ...a, ...appointmentData } : a
      ));
    } else {
      // Add new appointment
      const newId = Math.max(...appointments.map(a => a.id), 0) + 1;
      const newAppointment: Appointment = {
        id: newId,
        title: appointmentData.title || "",
        clientName: appointmentData.clientName || "",
        date: appointmentData.date || new Date(),
        time: appointmentData.time || "",
        type: appointmentData.type || "اجتماع",
        status: appointmentData.status || "مؤكد",
        description: appointmentData.description,
      };
      setAppointments([newAppointment, ...appointments]);
    }
    setShowForm(false);
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
                  {appointment.clientName}
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(appointment.date)} - {appointment.time}</span>
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
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CalendarClock className="ml-2 h-4 w-4 text-muted-foreground" />
                      <span>{appointment.type}</span>
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
            onClose={() => setShowForm(false)} 
            onSubmit={handleFormSubmit} 
            initialData={editingAppointment}
            title={editingAppointment ? "تحديث موعد" : "إضافة موعد جديد"} 
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
