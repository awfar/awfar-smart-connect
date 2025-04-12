
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { fetchUserById, updateUser } from "@/services/usersService";
import { fetchDepartments } from "@/services/departmentsService";
import { fetchTeams } from "@/services/teamsService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserFormProps {
  userId?: string;
  isEditing?: boolean;
  onSave: () => void;
}

const UserForm = ({ userId, isEditing = false, onSave }: UserFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("sales");
  const [departmentId, setDepartmentId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId && isEditing,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });
  
  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setRole(user.role || "sales");
      setDepartmentId(user.department_id || "");
      setTeamId(user.team_id || "");
      setIsActive(user.is_active !== undefined ? user.is_active : true);
    }
  }, [user]);

  useEffect(() => {
    if (departmentId && teams) {
      const filtered = teams.filter(team => team.department_id === departmentId);
      setFilteredTeams(filtered);
      
      // إذا كان الفريق المحدد حاليا ليس في القسم الجديد، فقم بإعادة تعيينه
      if (teamId && !filtered.some(team => team.id === teamId)) {
        setTeamId("");
      }
    } else {
      setFilteredTeams([]);
      setTeamId("");
    }
  }, [departmentId, teams, teamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing && userId) {
        // تعديل مستخدم موجود
        await updateUser({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          role,
          department_id: departmentId || null,
          team_id: teamId || null,
          is_active: isActive
        });
        onSave();
      } else {
        // إنشاء مستخدم جديد
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              role,
            }
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("لم يتم إنشاء المستخدم");
        
        // تحديث معلومات المستخدم الإضافية في جدول profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            department_id: departmentId || null,
            team_id: teamId || null,
            is_active: isActive
          })
          .eq('id', authData.user.id);
        
        if (profileError) throw profileError;
        
        onSave();
      }
    } catch (error: any) {
      console.error("خطأ في إضافة/تعديل المستخدم:", error);
      toast.error(error.message || "حدث خطأ أثناء إضافة/تعديل المستخدم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">الاسم الأول</Label>
          <Input 
            id="first_name" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">الاسم الأخير</Label>
          <Input 
            id="last_name" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input 
            id="email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={isEditing} 
          />
        </div>
        
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditing} 
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="role">الدور</Label>
          <Select value={role} onValueChange={setRole} required>
            <SelectTrigger id="role">
              <SelectValue placeholder="اختر دوراً" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="super_admin">مدير النظام</SelectItem>
              <SelectItem value="team_manager">مدير فريق</SelectItem>
              <SelectItem value="sales">مبيعات</SelectItem>
              <SelectItem value="customer_service">خدمة عملاء</SelectItem>
              <SelectItem value="technical_support">دعم فني</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">القسم</Label>
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger id="department">
              <SelectValue placeholder="اختر قسماً" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="none">بدون قسم</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team">الفريق</Label>
          <Select value={teamId} onValueChange={setTeamId} disabled={!departmentId}>
            <SelectTrigger id="team">
              <SelectValue placeholder={departmentId ? "اختر فريقاً" : "اختر قسماً أولا"} />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="none">بدون فريق</SelectItem>
              {filteredTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Separator />
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="active">الحساب نشط</Label>
          <p className="text-sm text-muted-foreground">
            عند إلغاء التفعيل، لن يتمكن المستخدم من تسجيل الدخول
          </p>
        </div>
        <Switch 
          id="active" 
          checked={isActive}
          onCheckedChange={setIsActive}
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onSave}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : isEditing ? "حفظ التغييرات" : "إضافة المستخدم"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
