
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Team } from "@/services/teamsService";
import { fetchDepartments } from "@/services/departmentsService";
import { fetchUsers } from "@/services/users";
import { toast } from "sonner";

interface TeamFormProps {
  team?: Team | null;
  onSave: (data: { name: string; department_id?: string; manager_id?: string }) => void;
  onCancel: () => void;
}

const TeamForm = ({ team, onSave, onCancel }: TeamFormProps) => {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState<string | undefined>(undefined);
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
  });
  
  // Handle users data when it's available
  useEffect(() => {
    if (users && Array.isArray(users) && users.length > 0) {
      // Filter users to get potential managers (admin or team manager)
      const potentialManagers = users.filter(user => 
        user.role === 'super_admin' || user.role === 'team_manager'
      );
      setManagers(potentialManagers);
    }
  }, [users]);

  useEffect(() => {
    if (team) {
      setName(team.name);
      setDepartmentId(team.department_id || undefined);
      setManagerId(team.manager_id || undefined);
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Submitting team data:", { name, departmentId, managerId });
      onSave({
        name,
        department_id: departmentId === "none" ? undefined : departmentId,
        manager_id: managerId === "none" ? undefined : managerId
      });
      
      // Don't set loading to false here, let the parent component do it after API call
    } catch (error) {
      console.error("خطأ في حفظ بيانات الفريق:", error);
      toast.error("حدث خطأ أثناء حفظ الفريق");
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
        <Select value={departmentId || "none"} onValueChange={(value) => setDepartmentId(value === "none" ? undefined : value)}>
          <SelectTrigger id="department">
            <SelectValue placeholder="اختر قسماً" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">لا ينتمي لأي قسم</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="manager">مدير الفريق (اختياري)</Label>
        <Select 
          value={managerId || "none"} 
          onValueChange={(value) => setManagerId(value === "none" ? undefined : value)}
        >
          <SelectTrigger id="manager">
            <SelectValue placeholder="اختر مديراً للفريق" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">بدون مدير</SelectItem>
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
