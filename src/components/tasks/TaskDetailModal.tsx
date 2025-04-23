
// Task detail with activity log/timeline

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/services/tasks/types";
import { User, FileText } from "lucide-react";

interface TaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

interface TaskLog {
  id: string;
  task_id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
}

const ACTION_MAP: Record<string, string> = {
  created: "تم الإنشاء",
  updated: "تم التعديل",
  status_changed: "تغيرت الحالة",
  reassigned: "إعادة تعيين",
  comment_added: "إضافة تعليق",
  deleted: "تم الحذف"
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ open, onClose, task }) => {
  const [logs, setLogs] = useState<TaskLog[]>([]);
  useEffect(() => {
    if (!open || !task) return;
    const fetchLogs = async () => {
      const { data: logsData } = await supabase
        .from('task_logs')
        .select('*')
        .eq('task_id', task.id)
        .order('created_at', { ascending: false });
      setLogs(logsData ?? []);
    };
    fetchLogs();
  }, [open, task]);

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>تفاصيل المهمة</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex items-center gap-2">
            <Badge>{task.type || 'مهمة'}</Badge>
            <Badge>{task.status}</Badge>
            <Badge>{task.priority}</Badge>
          </div>
          <h2 className="font-bold text-lg mt-4">{task.title}</h2>
          <p className="">الوصف: {task.description || "-"}</p>
          <div className="mt-4">
            <p className="mb-1 font-medium">سجل النشاط</p>
            <div className="border p-2 rounded overflow-y-auto max-h-[180px] bg-muted/50">
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-sm">لا يوجد سجل نشاط بعد.</p>
              ) : (
                <ul className="space-y-2">
                  {logs.map(log => (
                    <li key={log.id} className="flex gap-2 text-xs items-center">
                      <FileText className="h-4 w-4" />
                      <span>{ACTION_MAP[log.action] ?? log.action}</span>
                      <span>({format(new Date(log.created_at), "d MMM, HH:mm", { locale: ar })})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
