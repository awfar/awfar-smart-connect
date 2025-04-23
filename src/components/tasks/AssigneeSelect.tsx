
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EntityOption = { value: string; label: string };

interface AssigneeSelectProps {
  users: EntityOption[];
  value: string;
  onChange: (v: string) => void;
}

const AssigneeSelect: React.FC<AssigneeSelectProps> = ({ users, value, onChange }) => (
  <div>
    <label className="text-sm font-medium">تعيين إلى مستخدم</label>
    <Select
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="اختر مستخدم..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="no-user" value="none">بدون</SelectItem>
        {users.map(u => (
          <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default AssigneeSelect;
