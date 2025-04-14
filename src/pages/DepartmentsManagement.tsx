import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Building2, Edit, MoreVertical, Trash2, Users } from "lucide-react";
import { fetchDepartments, deleteDepartment, Department, updateDepartment, createDepartment } from "@/services/departmentsService";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MobileOptimizedContainer from "@/components/ui/mobile-optimized-container";

interface DepartmentFormProps {
  department?: Department;
  isEditing: boolean;
  onSave: () => void;
}

const DepartmentForm = ({ department, isEditing, onSave }: DepartmentFormProps) => {
  const [name, setName] = useState(department?.name || "");
  const [description, setDescription] = useState(department?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing && department) {
        await updateDepartment({
          id: department.id,
          name,
          description,
        });
      } else {
        await createDepartment({
          name,
          description,
        });
      }
      
      onSave();
    } catch (error: any) {
      console.error("خطأ في إضافة/تعديل القسم:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ القسم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dept_name">اسم القسم</Label>
          <Input 
            id="dept_name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="مثال: المبيعات، خدمة العملاء"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dept_description">وصف القسم</Label>
          <Textarea 
            id="dept_description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف مختصر للقسم والمسؤوليات المرتبطة به"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onSave}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : isEditing ? "حفظ التغييرات" : "إضافة القسم"}
        </Button>
      </div>
    </form>
  );
};

const DepartmentsManagement = () => {
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  
  const { data: departments, isLoading, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: () => fetchDepartments(),
  });

  const handleDepartmentAdded = () => {
    refetch();
    setShowDepartmentForm(false);
    toast.success("تم إضافة القسم بنجاح");
  };

  const handleDepartmentUpdated = () => {
    refetch();
    setShowDepartmentForm(false);
    toast.success("تم تحديث القسم بنجاح");
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowDepartmentForm(true);
  };

  const handleDeleteClick = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDepartment) return;
    
    try {
      const deleted = await deleteDepartment(selectedDepartment.id);
      if (deleted) {
        toast.success("تم حذف القسم بنجاح");
        refetch();
      } else {
        toast.error("فشل في حذف القسم");
      }
    } catch (error) {
      console.error("خطأ في حذف القسم:", error);
      toast.error("حدث خطأ أثناء محاولة حذف القسم");
    }
    
    setDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">إدارة الأقسام</h1>
            <p className="text-gray-500">إدارة أقسام الشركة وتنظيم المستخدمين</p>
          </div>
          
          <Button onClick={() => {setSelectedDepartment(null); setShowDepartmentForm(true)}} className="flex items-center gap-2">
            <span>إضافة قسم جديد</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>قائمة الأقسام</CardTitle>
            <CardDescription>
              الأقسام المتاحة في النظام وعدد المستخدمين في كل قسم
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">جاري تحميل البيانات...</div>
            ) : !departments || departments.length === 0 ? (
              <div className="text-center py-10">
                <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">لا توجد أقسام</h3>
                <p className="text-gray-500 mt-1">لم يتم إضافة أي أقسام بعد</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>عدد المستخدمين</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{department.user_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                              <Edit className="h-4 w-4 mr-2" />
                              <span>تعديل</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(department)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>حذف</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showDepartmentForm} onOpenChange={setShowDepartmentForm}>
        <DialogContent className="max-w-2xl rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDepartment ? "تعديل القسم" : "إضافة قسم جديد"}</DialogTitle>
          </DialogHeader>
          <MobileOptimizedContainer>
            <DepartmentForm 
              department={selectedDepartment || undefined} 
              isEditing={!!selectedDepartment}
              onSave={selectedDepartment ? handleDepartmentUpdated : handleDepartmentAdded} 
            />
          </MobileOptimizedContainer>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا القسم؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف القسم بشكل نهائي. لا يمكنك حذف قسم يحتوي على مستخدمين.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DepartmentsManagement;
