import { useEffect, useState } from "react";
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
import { AlertCircle, CheckCircle, Edit, MessageCircle, Tag, Trash2, Loader2 } from "lucide-react";
import { deleteTicket, fetchTickets, Ticket } from "@/services/tickets";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface TicketsListProps {
  view: "all" | "open" | "closed";
  filterPriority: string;
  filterCategory: string;
  triggerRefresh?: number;
}

const TicketsList: React.FC<TicketsListProps> = ({ 
  view, 
  filterPriority, 
  filterCategory,
  triggerRefresh = 0 
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  const { data: tickets = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['tickets', view, filterPriority, filterCategory, triggerRefresh],
    queryFn: () => fetchTickets(
      view, 
      filterPriority !== 'all' ? filterPriority : undefined,
      filterCategory !== 'all' ? filterCategory : undefined
    ),
  });
  
  useEffect(() => {
    refetch();
  }, [triggerRefresh, refetch]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

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
    return status === "open" ? 
      <AlertCircle className="h-4 w-4 text-orange-500" /> : 
      <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getCategoryLabel = (categoryValue: string): string => {
    switch (categoryValue) {
      case "customer-service": return "خدمة العملاء";
      case "technical-support": return "الدعم الفني";
      case "sales": return "المبيعات";
      case "finance": return "المالية";
      case "other": return "أخرى";
      default: return categoryValue;
    }
  };

  const handleEdit = (ticketId: string) => {
    // Navigate to edit page or open edit dialog
    toast.info("سيتم تنفيذ تعديل التذكرة قريبًا");
  };

  const confirmDelete = (ticketId: string) => {
    setTicketToDelete(ticketId);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!ticketToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteTicket(ticketToDelete);
      if (success) {
        refetch();
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="mr-2 text-lg">جاري تحميل البيانات...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-2" />
        <p className="text-lg font-medium">حدث خطأ أثناء تحميل البيانات</p>
        <Button onClick={() => refetch()} variant="outline" className="mt-2">
          المحاولة مرة أخرى
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      {tickets.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-lg font-medium mb-2">لا توجد تذاكر تطابق المعايير المحددة</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/tickets', { state: { createNew: true } })}
            className="mt-2"
          >
            إنشاء تذكرة جديدة
          </Button>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم التذكرة</TableHead>
                <TableHead>العنوان</TableHead>
                <TableHead>تاريخ الإنشاء</TableHead>
                <TableHead>الفئة</TableHead>
                <TableHead>الأولوية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-center">التعليقات</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket: Ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono">#{ticket.id?.substring(0, 8)}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{ticket.subject}</TableCell>
                  <TableCell>{formatDate(ticket.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Tag className="ml-2 h-4 w-4 text-muted-foreground" />
                      <span>{getCategoryLabel(ticket.category || '')}</span>
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
                      <span className="mr-2">{ticket.status === 'open' ? 'مفتوح' : 'مغلق'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <MessageCircle className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>0</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(ticket.id!)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => confirmDelete(ticket.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تأكيد الحذف</DialogTitle>
              </DialogHeader>
              <p className="py-4">هل أنت متأكد من رغبتك في حذف هذه التذكرة؟ هذا الإجراء لا يمكن التراجع عنه.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>إلغاء</Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الحذف...
                    </>
                  ) : (
                    "حذف"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default TicketsList;
