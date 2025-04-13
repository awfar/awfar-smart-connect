
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchPermissionById, createPermission, updatePermission, getSystemModules } from "@/services/permissions/permissionsService";
import { PermissionAction, PermissionScope } from "@/services/permissions/permissionTypes";

interface PermissionFormProps {
  permissionId?: string | null;
  isEditing?: boolean;
  onSave: () => void;
}

const PermissionForm = ({ permissionId, isEditing = false, onSave }: PermissionFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState("");
  const [action, setAction] = useState<PermissionAction>("read");
  const [scope, setScope] = useState<PermissionScope>("own");
  const [loading, setLoading] = useState(false);
  
  const modules = getSystemModules();
  
  const { data: permission } = useQuery({
    queryKey: ['permission', permissionId],
    queryFn: () => fetchPermissionById(permissionId!),
    enabled: !!permissionId && isEditing,
  });

  useEffect(() => {
    if (permission) {
      setName(permission.name || "");
      setDescription(permission.description || "");
      setModule(permission.module || "");
      setAction(permission.action || "read");
      setScope(permission.scope || "own");
    }
  }, [permission]);

  const generatePermissionName = () => {
    if (module && action && scope) {
      return `${module}_${action}_${scope}`;
    }
    return name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const permissionData = {
        name: generatePermissionName(),
        description,
        module,
        action,
        scope
      };
      
      let result;
      
      if (isEditing && permissionId) {
        result = await updatePermission({
          id: permissionId,
          ...permissionData
        });
      } else {
        result = await createPermission(permissionData);
      }
      
      if (!result) throw new Error("فشل في حفظ الصلاحية");
      
      onSave();
      toast.success(isEditing ? "تم تحديث الصلاحية بنجاح" : "تم إنشاء الصلاحية بنجاح");
    } catch (error: any) {
      console.error("خطأ في حفظ الصلاحية:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ الصلاحية");
    } finally {
      setLoading(false);
    }
  };

  const actions: { value: PermissionAction, label: string }[] = [
    { value: "create", label: "إنشاء" },
    { value: "read", label: "قراءة" },
    { value: "update", label: "تعديل" },
    { value: "delete", label: "حذف" }
  ];
  
  const scopes: { value: PermissionScope, label: string }[] = [
    { value: "own", label: "خاص بالمستخدم" },
    { value: "team", label: "فريق المستخدم" },
    { value: "all", label: "جميع البيانات" }
  ];

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="permission-module">الوحدة</Label>
            <Select value={module} onValueChange={setModule} required>
              <SelectTrigger id="permission-module">
                <SelectValue placeholder="اختر الوحدة" />
              </SelectTrigger>
              <SelectContent>
                {modules.map((mod) => (
                  <SelectItem key={mod.name} value={mod.name}>
                    {mod.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="permission-action">نوع الصلاحية</Label>
            <Select value={action} onValueChange={(val) => setAction(val as PermissionAction)} required>
              <SelectTrigger id="permission-action">
                <SelectValue placeholder="اختر نوع الصلاحية" />
              </SelectTrigger>
              <SelectContent>
                {actions.map((act) => (
                  <SelectItem key={act.value} value={act.value}>
                    {act.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="permission-scope">نطاق الصلاحية</Label>
            <Select value={scope} onValueChange={(val) => setScope(val as PermissionScope)} required>
              <SelectTrigger id="permission-scope">
                <SelectValue placeholder="اختر نطاق الصلاحية" />
              </SelectTrigger>
              <SelectContent>
                {scopes.map((sc) => (
                  <SelectItem key={sc.value} value={sc.value}>
                    {sc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="permission-name">اسم الصلاحية</Label>
          <Input
            id="permission-name"
            value={generatePermissionName()}
            readOnly
            className="bg-muted"
          />
          <p className="text-sm text-muted-foreground">
            يتم إنشاء اسم الصلاحية تلقائيًا بناءً على الوحدة ونوع ونطاق الصلاحية
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="permission-description">وصف الصلاحية</Label>
          <Textarea
            id="permission-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف مختصر للصلاحية"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={onSave}>
          إلغاء
        </Button>
        <Button disabled={loading} type="submit">
          {loading ? "جاري الحفظ..." : isEditing ? "تحديث الصلاحية" : "إضافة الصلاحية"}
        </Button>
      </div>
    </form>
  );
};

export default PermissionForm;
