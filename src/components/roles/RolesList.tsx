
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  Shield,
  ShieldCheck
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Role, deleteRole } from "@/services/rolesService";
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
import { useState } from "react";
import { toast } from "sonner";

interface RolesListProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (roleId: string) => void;
  onManagePermissions: (roleId: string) => void;
  onRefresh: () => void;
}

const RolesList = ({ roles, isLoading, onEdit, onManagePermissions, onRefresh }: RolesListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const handleDeleteClick = (roleId: string) => {
    setRoleToDelete(roleId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    
    try {
      await deleteRole(roleToDelete);
      toast.success("تم حذف الدور بنجاح");
      onRefresh();
    } catch (error) {
      console.error("خطأ في حذف الدور:", error);
      toast.error("حدث خطأ أثناء محاولة حذف الدور");
    }
    
    setDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  const getSystemRoleBadge = (roleName: string) => {
    if (['super_admin', 'team_manager', 'sales', 'customer_service', 'technical_support'].includes(roleName)) {
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-200">دور نظام</Badge>;
    }
    return null;
  };

  if (isLoading) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  if (!roles || roles.length === 0) {
    return (
      <div className="text-center py-10">
        <Shield className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium">لا توجد أدوار</h3>
        <p className="text-gray-500 mt-1">لم يتم إضافة أي أدوار بعد</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>النوع</TableHead>
            <TableHead>إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>{getSystemRoleBadge(role.name)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onManagePermissions(role.id)}>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      <span>إدارة الصلاحيات</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(role.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      <span>تعديل</span>
                    </DropdownMenuItem>
                    {!['super_admin', 'team_manager', 'sales', 'customer_service', 'technical_support'].includes(role.name) && (
                      <DropdownMenuItem onClick={() => handleDeleteClick(role.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>حذف</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الدور؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الدور بشكل نهائي. قد يؤثر ذلك على المستخدمين الذين لديهم هذا الدور.
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
    </>
  );
};

export default RolesList;
