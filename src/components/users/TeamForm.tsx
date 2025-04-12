
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Team } from "@/services/teamsService";
import { fetchDepartments } from "@/services/departmentsService";
import { fetchUsers } from "@/services/usersService";

interface TeamFormProps {
  team?: Team | null;
  onSave: (data: { name: string; department_id: string; manager_id?: string }) => void;
  onCancel: () => void;
}

const TeamForm = ({ team, onSave, onCancel }: TeamFormProps) => {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [managerId, setManagerId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<any[]>([]);

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    onSuccess: (data) => {
      // فلترة المستخدمين للحصول على المديرين المحتملين (مدير نظام أو مدير فريق)
      const potentialManagers = data.filter(user => 
        user.role === 'super_admin' || user.role === 'team_manager'
      );
      setManagers(potentialManagers);
    }
  });

  useEffect(() => {
    if (team) {
      setName(team.name);
      setDepartmentId(team.department_id || "");
      setManagerId(team.manager_id);
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      onSave({
        name,
        department_id: departmentId,
        manager_id: managerId
      });
    } catch (error) {
      console.error("خطأ في حفظ بيانات الفريق:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم الفريق</Label>
        <Input 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسم الفريق"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="department">القسم</Label>
        <Select value={departmentId} onValueChange={setDepartmentId} required>
          <SelectTrigger id="department">
            <SelectValue placeholder="اختر قسماً" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="manager">مدير الفريق (اختياري)</Label>
        <Select 
          value={managerId || ""} 
          onValueChange={(value) => setManagerId(value || undefined)}
        >
          <SelectTrigger id="manager">
            <SelectValue placeholder="اختر مديراً للفريق" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">بدون مدير</SelectItem>
            {managers.map((manager) => (
              <SelectItem key={manager.id} value={manager.id}>
                {manager.first_name} {manager.last_name} ({manager.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : team ? "حفظ التغييرات" : "إضافة الفريق"}
        </Button>
      </div>
    </form>
  );
};

export default TeamForm;
