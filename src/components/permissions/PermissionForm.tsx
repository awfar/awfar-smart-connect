
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchPermissionById, createPermission, updatePermission, getSystemObjects } from "@/services/permissions/permissionsService";
import { PermissionLevel, PermissionScope } from "@/services/permissions/permissionTypes";

interface PermissionFormProps {
  permissionId?: string | null;
  isEditing?: boolean;
  onSave: () => void;
}

const PermissionForm = ({ permissionId, isEditing = false, onSave }: PermissionFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [object, setObject] = useState("");
  const [level, setLevel] = useState<PermissionLevel>("read-only");
  const [scope, setScope] = useState<PermissionScope>("own");
  const [loading, setLoading] = useState(false);
  const [availableScopes, setAvailableScopes] = useState<PermissionScope[]>([]);
  
  const objects = getSystemObjects();
  
  const { data: permission } = useQuery({
    queryKey: ['permission', permissionId],
    queryFn: () => fetchPermissionById(permissionId!),
    enabled: !!permissionId && isEditing,
  });

  useEffect(() => {
    if (permission) {
      setName(permission.name || "");
      setDescription(permission.description || "");
      setObject(permission.object || "");
      setLevel(permission.level || "read-only");
      setScope(permission.scope || "own");
    }
  }, [permission]);

  useEffect(() => {
    if (object && level) {
      const selectedObject = objects.find(obj => obj.name === object);
      if (selectedObject) {
        const permissionDef = selectedObject.permissions.find(p => p.level === level);
        if (permissionDef) {
          setAvailableScopes(permissionDef.scopes);
          
          // If current scope is not available in the new level, select the first available scope
          if (!permissionDef.scopes.includes(scope)) {
            setScope(permissionDef.scopes[0]);
          }
        }
      }
    }
  }, [object, level, objects, scope]);

  const generatePermissionName = () => {
    if (object && level && scope) {
      return `${object}_${level}_${scope}`;
    }
    return name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const generatedName = generatePermissionName();
      
      const permissionData = {
        name: generatedName,
        description: description || generatedName,
        object,
        level,
        scope
      };
      
      console.log("Submitting permission:", permissionData);
      
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

  const levels: { value: PermissionLevel, label: string }[] = [
    { value: "read-only", label: "قراءة فقط" },
    { value: "read-edit", label: "قراءة وتعديل" },
    { value: "full-access", label: "وصول كامل" }
  ];
  
  const scopes: { value: PermissionScope, label: string }[] = [
    { value: "own", label: "سجلاته" },
    { value: "team", label: "سجلات فريقه" },
    { value: "all", label: "جميع السجلات" },
    { value: "unassigned", label: "سجلات غير مسندة" }
  ];

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="permission-object">الوحدة</Label>
            <Select value={object} onValueChange={setObject} required>
              <SelectTrigger id="permission-object">
                <SelectValue placeholder="اختر الوحدة" />
              </SelectTrigger>
              <SelectContent>
                {objects.map((obj) => (
                  <SelectItem key={obj.name} value={obj.name}>
                    {obj.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="permission-level">مستوى الصلاحية</Label>
            <Select value={level} onValueChange={(val) => setLevel(val as PermissionLevel)} required>
              <SelectTrigger id="permission-level">
                <SelectValue placeholder="اختر مستوى الصلاحية" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((lvl) => (
                  <SelectItem key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="permission-scope">نطاق الصلاحية</Label>
            <Select 
              value={scope} 
              onValueChange={(val) => setScope(val as PermissionScope)} 
              required
              disabled={availableScopes.length === 0}
            >
              <SelectTrigger id="permission-scope">
                <SelectValue placeholder="اختر نطاق الصلاحية" />
              </SelectTrigger>
              <SelectContent>
                {scopes
                  .filter(s => availableScopes.includes(s.value))
                  .map((sc) => (
                    <SelectItem key={sc.value} value={sc.value}>
                      {sc.label}
                    </SelectItem>
                  ))
                }
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
