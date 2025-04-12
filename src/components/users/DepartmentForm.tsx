
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Department } from "@/services/departmentsService";

interface DepartmentFormProps {
  department?: Department | null;
  onSave: (data: { name: string; description?: string }) => void;
  onCancel: () => void;
}

const DepartmentForm = ({ department, onSave, onCancel }: DepartmentFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setName(department.name);
      setDescription(department.description || "");
    }
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      onSave({
        name,
        description: description || undefined
      });
    } catch (error) {
      console.error("خطأ في حفظ بيانات القسم:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم القسم</Label>
        <Input 
          id="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسم القسم"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">وصف القسم</Label>
        <Textarea 
          id="description" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="أدخل وصفاً للقسم (اختياري)"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : department ? "حفظ التغييرات" : "إضافة القسم"}
        </Button>
      </div>
    </form>
  );
};

export default DepartmentForm;
