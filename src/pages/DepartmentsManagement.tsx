import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Building, Plus, Edit, Trash2, Users } from "lucide-react";
import { Department, fetchDepartments, createDepartment, updateDepartment, deleteDepartment } from "@/services/departmentsService";
import DepartmentForm from "@/components/users/DepartmentForm";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

const DepartmentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const { data: departments = [], isLoading, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddDepartment = async (data: { name: string; description?: string }) => {
    const newDepartment = await createDepartment(data);
    if (newDepartment) {
      setShowAddDepartment(false);
      refetch();
    }
  };

  const handleEditDepartment = (department: Department) => {
    setSelectedDepartment(department);
    setShowEditDepartment(true);
  };

  const handleSaveEdit = async (data: { name: string; description?: string }) => {
    if (!selectedDepartment) return;
    
    const updated = await updateDepartment({
      id: selectedDepartment.id,
      name: data.name,
      description: data.description
    });
    
    if (updated) {
      setShowEditDepartment(false);
      refetch();
    }
  };

  const handleDeletePrompt = (department: Department) => {
    setSelectedDepartment(department);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;
    
    const success = await deleteDepartment(selectedDepartment.id);
    if (success) {
      setShowDeleteDialog(false);
      refetch();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">إدارة الأقسام</h1>
            <p className="text-gray-500">إنشاء وتعديل وحذف الأقسام في المنظمة</p>
          </div>
          
          <Button onClick={() => setShowAddDepartment(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>إضافة قسم</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>قائمة الأقسام</CardTitle>
                <CardDescription>
                  إجمالي الأقسام: {filteredDepartments.length}
                </CardDescription>
              </div>
              
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="بحث عن قسم..."
                  className="w-full md:w-80 pr-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">جاري تحميل البيانات...</div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-10">
                <Building className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">لا توجد أقسام</h3>
                <p className="text-gray-500 mt-1">أضف أقساماً جديدة لتنظيم المستخدمين والفرق</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم القسم</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>عدد المستخدمين</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium">{department.name}</TableCell>
                      <TableCell>{department.description || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{department.user_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(department.created_at).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditDepartment(department)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeletePrompt(department)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showAddDepartment} onOpenChange={setShowAddDepartment}>
        <DialogContent className="sm:max-w-md rtl">
          <DialogHeader>
            <DialogTitle>إضافة قسم جديد</DialogTitle>
            <DialogDescription>أدخل بيانات القسم الجديد</DialogDescription>
          </DialogHeader>
          <DepartmentForm onSave={handleAddDepartment} onCancel={() => setShowAddDepartment(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditDepartment} onOpenChange={setShowEditDepartment}>
        <DialogContent className="sm:max-w-md rtl">
          <DialogHeader>
            <DialogTitle>تعديل قسم</DialogTitle>
            <DialogDescription>تعديل بيانات القسم</DialogDescription>
          </DialogHeader>
          <DepartmentForm 
            department={selectedDepartment} 
            onSave={handleSaveEdit} 
            onCancel={() => setShowEditDepartment(false)} 
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md rtl">
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              هل أنت متأكد من رغبتك في حذف قسم "{selectedDepartment?.name}"؟
            </p>
            <p className="text-sm text-amber-600">
              ملاحظة: لا يمكن حذف القسم إذا كان يحتوي على مستخدمين أو فرق.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                إلغاء
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                حذف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DepartmentsManagement;
