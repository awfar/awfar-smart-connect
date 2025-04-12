
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
import { AlertCircle, CheckCircle, Clock, Edit, MessageCircle, Tag, Trash2 } from "lucide-react";

interface TicketsListProps {
  view: "all" | "open" | "closed";
  filterPriority: string;
  filterCategory: string;
}

// Mock data for tickets
const MOCK_TICKETS = [
  { 
    id: 1, 
    title: "مشكلة في تسجيل الدخول", 
    description: "لا يمكنني تسجيل الدخول إلى حسابي", 
    clientName: "أحمد محمد", 
    createdAt: new Date(2025, 3, 14), 
    lastUpdated: new Date(2025, 3, 14), 
    category: "خدمة العملاء", 
    priority: "عالي", 
    status: "مفتوح", 
    assignedTo: "سارة علي",
    comments: 3
  },
  { 
    id: 2, 
    title: "خطأ في الفاتورة", 
    description: "تم احتساب مبلغ خاطئ في الفاتورة الأخيرة", 
    clientName: "خالد أحمد", 
    createdAt: new Date(2025, 3, 10), 
    lastUpdated: new Date(2025, 3, 12), 
    category: "المالية", 
    priority: "متوسط", 
    status: "مفتوح", 
    assignedTo: "محمد علي",
    comments: 5
  },
  { 
    id: 3, 
    title: "طلب استرداد", 
    description: "أريد استرداد قيمة المنتج لأنه معيب", 
    clientName: "فاطمة خالد", 
    createdAt: new Date(2025, 3, 5), 
    lastUpdated: new Date(2025, 3, 13), 
    category: "المبيعات", 
    priority: "منخفض", 
    status: "مفتوح", 
    assignedTo: "أحمد خالد",
    comments: 8
  },
  { 
    id: 4, 
    title: "مشكلة في المنتج", 
    description: "المنتج لا يعمل بشكل صحيح", 
    clientName: "علي محمود", 
    createdAt: new Date(2025, 3, 1), 
    lastUpdated: new Date(2025, 3, 10), 
    category: "الدعم الفني", 
    priority: "عاجل", 
    status: "مفتوح", 
    assignedTo: "محمد سعيد",
    comments: 12
  },
  { 
    id: 5, 
    title: "استفسار عن المنتج", 
    description: "أريد معلومات إضافية عن المنتج الجديد", 
    clientName: "سارة محمد", 
    createdAt: new Date(2025, 2, 25), 
    lastUpdated: new Date(2025, 2, 28), 
    category: "المبيعات", 
    priority: "منخفض", 
    status: "مغلق", 
    assignedTo: "خالد علي",
    comments: 4
  },
];

const TicketsList: React.FC<TicketsListProps> = ({ view, filterPriority, filterCategory }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA');
  };

  // Filter tickets based on view and filters
  const filteredTickets = MOCK_TICKETS.filter(ticket => {
    // Filter by view (status)
    if (view === "open" && ticket.status !== "مفتوح") return false;
    if (view === "closed" && ticket.status !== "مغلق") return false;
    
    // Filter by priority
    if (filterPriority !== "all" && ticket.priority !== filterPriority) return false;
    
    // Filter by category
    if (filterCategory !== "all" && ticket.category !== filterCategory) return false;
    
    return true;
  });

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "عاجل": return "destructive";
      case "عالي": return "default";
      case "متوسط": return "secondary";
      case "منخفض": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "مفتوح" ? 
      <AlertCircle className="h-4 w-4 text-orange-500" /> : 
      <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const handleEdit = (ticketId: number) => {
    console.log("Edit ticket", ticketId);
  };

  const handleDelete = (ticketId: number) => {
    console.log("Delete ticket", ticketId);
  };

  return (
    <div className="w-full overflow-auto">
      {filteredTickets.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          لا توجد تذاكر تطابق المعايير المحددة
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رقم التذكرة</TableHead>
              <TableHead>العنوان</TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>الأولوية</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-center">التعليقات</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-mono">#{ticket.id.toString().padStart(4, '0')}</TableCell>
                <TableCell className="font-medium max-w-[200px] truncate">{ticket.title}</TableCell>
                <TableCell>{ticket.clientName}</TableCell>
                <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Tag className="ml-2 h-4 w-4 text-muted-foreground" />
                    <span>{ticket.category}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getStatusIcon(ticket.status)}
                    <span className="mr-2">{ticket.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <MessageCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{ticket.comments}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(ticket.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(ticket.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default TicketsList;
