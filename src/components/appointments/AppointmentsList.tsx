
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
import { CalendarClock, Edit, Trash2 } from "lucide-react";

// Mock data for appointments
const MOCK_APPOINTMENTS = [
  { id: 1, title: "اجتماع مع عميل جديد", date: new Date(2025, 3, 14), clientName: "أحمد محمد", time: "10:00 ص", type: "اجتماع", status: "مؤكد" },
  { id: 2, title: "متابعة عرض المنتج", date: new Date(2025, 3, 15), clientName: "سارة خالد", time: "02:30 م", type: "عرض", status: "مؤكد" },
  { id: 3, title: "مراجعة مشروع", date: new Date(2025, 3, 15), clientName: "محمد علي", time: "04:00 م", type: "مراجعة", status: "مؤكد" },
  { id: 4, title: "مكالمة مع فريق التطوير", date: new Date(2025, 3, 20), clientName: "فريق التطوير", time: "11:00 ص", type: "مكالمة", status: "معلق" },
  { id: 5, title: "اجتماع استراتيجي", date: new Date(2025, 3, 25), clientName: "خالد عبدالله", time: "01:00 م", type: "اجتماع", status: "مؤكد" },
];

const AppointmentsList = () => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA');
  };

  const handleEdit = (appointmentId: number) => {
    console.log("Edit appointment", appointmentId);
  };

  const handleDelete = (appointmentId: number) => {
    console.log("Delete appointment", appointmentId);
  };

  return (
    <div className="w-full overflow-auto">
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
          {MOCK_APPOINTMENTS.map((appointment) => (
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
  );
};

export default AppointmentsList;
