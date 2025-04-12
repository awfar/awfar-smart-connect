
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
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, CalendarClock, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Define task status types and their badge styles
type TaskStatus = "مكتمل" | "قيد التنفيذ" | "معلق" | "ملغي";
type TaskPriority = "منخفض" | "متوسط" | "عالي" | "عاجل";

// Mock data for tasks
const MOCK_TASKS = [
  { 
    id: 1, 
    title: "إكمال تقرير المبيعات الشهري", 
    status: "قيد التنفيذ" as TaskStatus, 
    priority: "عالي" as TaskPriority,
    assignedTo: "أحمد محمد",
    createdBy: "محمد خالد",
    dueDate: new Date(2025, 3, 20),
    description: "يجب إعداد تقرير المبيعات الشهري وتقديمه إلى الإدارة"
  },
  { 
    id: 2, 
    title: "متابعة العميل المحتمل", 
    status: "معلق" as TaskStatus, 
    priority: "متوسط" as TaskPriority,
    assignedTo: "سارة علي",
    createdBy: "محمد خالد",
    dueDate: new Date(2025, 3, 22),
    description: "متابعة العميل المحتمل للحصول على رد بشأن العرض المقدم"
  },
  { 
    id: 3, 
    title: "تحديث قاعدة بيانات العملاء", 
    status: "مكتمل" as TaskStatus, 
    priority: "منخفض" as TaskPriority,
    assignedTo: "خالد أحمد",
    createdBy: "أحمد محمد",
    dueDate: new Date(2025, 3, 15),
    description: "تحديث معلومات الاتصال وتفاصيل العملاء في قاعدة البيانات"
  },
  { 
    id: 4, 
    title: "إعداد عرض تقديمي للمنتج الجديد", 
    status: "قيد التنفيذ" as TaskStatus, 
    priority: "عاجل" as TaskPriority,
    assignedTo: "أحمد محمد",
    createdBy: "محمد خالد",
    dueDate: new Date(2025, 3, 18),
    description: "إعداد عرض تقديمي شامل للمنتج الجديد لاجتماع المبيعات القادم"
  },
  { 
    id: 5, 
    title: "مراجعة خطة التسويق", 
    status: "معلق" as TaskStatus, 
    priority: "عالي" as TaskPriority,
    assignedTo: "فاطمة محمد",
    createdBy: "سارة علي",
    dueDate: new Date(2025, 3, 25),
    description: "مراجعة وتحديث خطة التسويق للربع القادم"
  },
];

interface TasksListProps {
  view: "all" | "myTasks" | "team";
  filterStatus: string;
  filterPriority: string;
}

const TasksList = ({ view, filterStatus, filterPriority }: TasksListProps) => {
  // Filter tasks based on view and filters
  const filteredTasks = MOCK_TASKS.filter(task => {
    // Filter by view (all, myTasks, team)
    if (view === "myTasks" && task.assignedTo !== "أحمد محمد") return false;
    if (view === "team" && task.createdBy !== "محمد خالد") return false;
    
    // Filter by status
    if (filterStatus !== "all" && task.status !== filterStatus) return false;
    
    // Filter by priority
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    
    return true;
  });

  const getStatusBadgeVariant = (status: TaskStatus) => {
    switch (status) {
      case "مكتمل": return "success";
      case "قيد التنفيذ": return "default";
      case "معلق": return "outline";
      case "ملغي": return "destructive";
      default: return "outline";
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "منخفض": 
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">منخفض</Badge>;
      case "متوسط": 
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">متوسط</Badge>;
      case "عالي": 
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">عالي</Badge>;
      case "عاجل": 
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">عاجل</Badge>;
      default: 
        return <Badge variant="outline">غير محدد</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: ar });
  };

  const handleTaskToggle = (taskId: number, checked: boolean) => {
    console.log(`Task ${taskId} toggled to ${checked ? 'completed' : 'not completed'}`);
  };

  const handleEdit = (taskId: number) => {
    console.log("Edit task", taskId);
  };

  const handleDelete = (taskId: number) => {
    console.log("Delete task", taskId);
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>المهمة</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الأولوية</TableHead>
            <TableHead>المكلف</TableHead>
            <TableHead>تاريخ الاستحقاق</TableHead>
            <TableHead className="text-left">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                لا توجد مهام تطابق المعايير المحددة
              </TableCell>
            </TableRow>
          ) : (
            filteredTasks.map((task) => (
              <TableRow key={task.id} className={task.status === "مكتمل" ? "bg-muted/40" : ""}>
                <TableCell>
                  <Checkbox 
                    checked={task.status === "مكتمل"} 
                    onCheckedChange={(checked) => handleTaskToggle(task.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <p className={task.status === "مكتمل" ? "line-through text-muted-foreground" : ""}>{task.title}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{task.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(task.status)}>
                    {task.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {getPriorityBadge(task.priority)}
                </TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarClock className="ml-2 h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(task.dueDate)}</span>
                    {task.priority === "عاجل" && (
                      <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(task.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TasksList;
