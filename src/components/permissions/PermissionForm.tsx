
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchPermissionById, createPermission, updatePermission } from "@/services/permissionsService";
import { toast } from "sonner";

interface PermissionFormProps {
  permissionId?: string | null;
  isEditing?: boolean;
  onSave: () => void;
}

const PermissionForm = ({ permissionId, isEditing = false, onSave }: PermissionFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: permission } = useQuery({
    queryKey: ['permission', permissionId],
    queryFn: () => fetchPermissionById(permissionId!),
    enabled: !!permissionId && isEditing,
  });

  useEffect(() => {
    if (permission) {
      setName(permission.name || "");
      setDescription(permission.description || "");
    }
  }, [permission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing && permissionId) {
        await updatePermission({
          id: permissionId,
          name,
          description,
        });
      } else {
        await createPermission({
          name,
          description,
        });
      }
      
      onSave();
    } catch (error: any) {
      console.error("خطأ في إضافة/تعديل الصلاحية:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ الصلاحية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="permission_name">اسم الصلاحية</Label>
          <Input 
            id="permission_name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="مثال: view_users, edit_leads"
          />
          <p className="text-xs text-muted-foreground">
            يجب أن يكون اسم الصلاحية فريداً ويفضل استخدام التنسيق: action_resource
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="permission_description">وصف الصلاحية</Label>
          <Textarea 
            id="permission_description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف مختصر للصلاحية"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onSave}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : isEditing ? "حفظ التغييرات" : "إضافة الصلاحية"}
        </Button>
      </div>
    </form>
  );
};

export default PermissionForm;
