
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { fetchDepartments } from "@/services/departmentsService";
import { fetchTeams } from "@/services/teamsService";

interface UserFiltersProps {
  onApplyFilters: (role: string | null, department: string | null, team: string | null) => void;
}

const UserFilters = ({ onApplyFilters }: UserFiltersProps) => {
  const [role, setRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });
  
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });
  
  // Handle teams data when it changes or department changes
  useEffect(() => {
    if (teams) {
      if (department) {
        const filtered = teams.filter(t => t.department_id === department);
        setFilteredTeams(filtered);
      } else {
        setFilteredTeams(teams);
      }
    }
  }, [teams, department]);

  const handleDepartmentChange = (value: string) => {
    const departmentId = value || null;
    setDepartment(departmentId);
    setTeam(null); // إعادة تعيين الفريق عند تغيير القسم
    
    // فلترة الفرق حسب القسم المحدد
    if (departmentId && teams) {
      const filtered = teams.filter(t => t.department_id === departmentId);
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams || []);
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters(role, department, team);
  };

  const handleClearFilters = () => {
    setRole(null);
    setDepartment(null);
    setTeam(null);
    setFilteredTeams(teams || []);
    onApplyFilters(null, null, null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role-filter">الدور</Label>
          <Select value={role || ""} onValueChange={setRole}>
            <SelectTrigger id="role-filter">
              <SelectValue placeholder="جميع الأدوار" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأدوار</SelectItem>
              <SelectItem value="super_admin">مدير النظام</SelectItem>
              <SelectItem value="team_manager">مدير فريق</SelectItem>
              <SelectItem value="sales">مبيعات</SelectItem>
              <SelectItem value="customer_service">خدمة عملاء</SelectItem>
              <SelectItem value="technical_support">دعم فني</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department-filter">القسم</Label>
          <Select value={department || ""} onValueChange={handleDepartmentChange}>
            <SelectTrigger id="department-filter">
              <SelectValue placeholder="جميع الأقسام" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الأقسام</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team-filter">الفريق</Label>
          <Select 
            value={team || ""} 
            onValueChange={setTeam}
            disabled={!department} // تعطيل اختيار الفريق إذا لم يتم تحديد قسم
          >
            <SelectTrigger id="team-filter">
              <SelectValue placeholder={department ? "جميع الفرق" : "اختر قسمًا أولاً"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع الفرق</SelectItem>
              {filteredTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleClearFilters}>
          إعادة تعيين
        </Button>
        <Button onClick={handleApplyFilters}>
          تطبيق الفلترة
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
