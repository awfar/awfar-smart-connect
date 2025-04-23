
// LIVE TasksList: Always fetch from Supabase, support filter/sort/status/type

import React, { useState, useEffect } from "react";
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
import { Edit, Trash2, Calendar, User, FileText } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Task, castToTask } from "@/services/tasks/types";
import { toast } from "sonner";

const STATUS_LOOKUP: { [key: string]: string } = {
  pending: "قيد الانتظار",
  in_progress: "قيد التنفيذ",
  completed: "مكتملة",
  cancelled: "ملغاة",
};
const PRIORITY_LOOKUP: { [key: string]: string } = {
  low: "منخفضة",
  medium: "متوسطة",
  high: "عالية",
};

interface TasksListProps {
  view: "all" | "myTasks" | "team";
  filterStatus?: string;
  filterPriority?: string;
  filterType?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onShowDetails?: (task: Task) => void;
}

const TasksList = ({
  view,
  filterStatus = "all",
  filterPriority = "all",
  filterType = "all",
  onEdit,
  onDelete,
  onShowDetails,
}: TasksListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Get my user id from Supabase
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) setUserId(data.user.id);
    });
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      let query = supabase.from("tasks").select("*").order("due_date", { ascending: true });

      if (view === "myTasks" && userId) {
        query = query.eq("assigned_to", userId);
      }
      if (view === "team" && userId) {
        // Can be refined to team ID in profile
        query = query.neq("assigned_to", userId);
      }
      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }
      if (filterPriority !== "all") {
        query = query.eq("priority", filterPriority);
      }
      if (filterType !== "all") {
        query = query.eq("type", filterType);
      }
      const { data, error } = await query;
      if (error) {
        toast.error("فشل في تحميل المهام");
        setTasks([]);
        setLoading(false);
        return;
      }
      
      // Convert the data to Task[] using the castToTask function
      const typedTasks: Task[] = data ? data.map(castToTask) : [];
      setTasks(typedTasks);
      setLoading(false);
    };
    if (userId) loadTasks();
  }, [view, userId, filterStatus, filterPriority, filterType]);

  const handleCheck = (task: Task, checked: boolean) => {
    // Mark complete/incomplete
    supabase.from('tasks').update({ status: checked ? "completed" : "pending" }).eq('id', task.id).then(({ error }) => {
      if (error) toast.error("فشل في تحديث المهمة");
      else toast.success('تم تحديث حالة المهمة');
      // Reload after update
      setTasks(tasks =>
        tasks.map(t => (t.id === task.id ? { ...t, status: checked ? "completed" : "pending" } : t))
      );
    });
  };

  const formatDate = (s: string | null) => {
    if (!s) return "-";
    try {
      return format(new Date(s), "d MMMM yyyy, HH:mm", { locale: ar });
    } catch {
      return s;
    }
  };

  return (
    <div className='w-full overflow-auto min-h-[180px]'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>المهمة</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>الحالة</TableHead>
            <TableHead>الأولوية</TableHead>
            <TableHead>مكلف بها</TableHead>
            <TableHead>تاريخ الاستحقاق</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                جاري التحميل...
              </TableCell>
            </TableRow>
          ) : tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                لا توجد مهام لعرضها
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                className={task.status === "completed" ? "bg-muted/40" : ""}
                onClick={() => onShowDetails?.(task)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Checkbox
                    checked={task.status === "completed"}
                    onCheckedChange={(checked) => handleCheck(task, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <span className={task.status === "completed" ? "line-through text-muted-foreground" : ""}>
                    {task.title}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge>{task.type || 'مهمة'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{STATUS_LOOKUP[task.status] ?? task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{PRIORITY_LOOKUP[task.priority] ?? task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {task.assigned_to_name || '-'}
                  </span>
                </TableCell>
                <TableCell>
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(task.due_date || null)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-center">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit?.(task); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDelete?.(task.id); }}>
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
