
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchRoleById, createRole, updateRole } from "@/services/rolesService";
import { toast } from "sonner";

interface RoleFormProps {
  roleId?: string | null;
  isEditing?: boolean;
  onSave: () => void;
}

const RoleForm = ({ roleId, isEditing = false, onSave }: RoleFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: role } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => fetchRoleById(roleId!),
    enabled: !!roleId && isEditing,
  });

  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setDescription(role.description || "");
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing && roleId) {
        await updateRole({
          id: roleId,
          name,
          description,
        });
      } else {
        await createRole({
          name,
          description,
        });
      }
      
      onSave();
    } catch (error: any) {
      console.error("خطأ في إضافة/تعديل الدور:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ الدور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role_name">اسم الدور</Label>
          <Input 
            id="role_name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="مثال: مدير، مشرف، محرر"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role_description">وصف الدور</Label>
          <Textarea 
            id="role_description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف مختصر للدور والمسؤوليات المرتبطة به"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onSave}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : isEditing ? "حفظ التغييرات" : "إضافة الدور"}
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;
