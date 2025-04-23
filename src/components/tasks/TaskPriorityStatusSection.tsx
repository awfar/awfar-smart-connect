
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRIORITIES = [
  { value: "low", label: "منخفضة" },
  { value: "medium", label: "متوسطة" },
  { value: "high", label: "عالية" }
];

const STATUSES = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "in_progress", label: "قيد التنفيذ" },
  { value: "completed", label: "مكتملة" },
  { value: "cancelled", label: "ملغاة" }
];

interface Props {
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  setPriority: (v: "low" | "medium" | "high") => void;
  setStatus: (v: "pending" | "in_progress" | "completed" | "cancelled") => void;
}

const TaskPriorityStatusSection: React.FC<Props> = ({
  priority, status, setPriority, setStatus
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-medium">الأولوية</label>
      <Select
        value={priority}
        onValueChange={(v) => setPriority(v as "low" | "medium" | "high")}
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر الأولوية" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITIES.map(p => (
            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <label className="text-sm font-medium">الحالة</label>
      <Select
        value={status}
        onValueChange={(v) => setStatus(v as "pending" | "in_progress" | "completed" | "cancelled")}
      >
        <SelectTrigger>
          <SelectValue placeholder="اختر الحالة" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map(s => (
            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default TaskPriorityStatusSection;
