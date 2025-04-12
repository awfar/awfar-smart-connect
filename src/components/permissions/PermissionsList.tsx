
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  Shield
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Permission, deletePermission } from "@/services/permissionsService";
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

interface PermissionsListProps {
  permissions: Permission[];
  isLoading: boolean;
  onEdit: (permissionId: string) => void;
  onRefresh: () => void;
}

const PermissionsList = ({ permissions, isLoading, onEdit, onRefresh }: PermissionsListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(null);

  const handleDeleteClick = (permissionId: string) => {
    setPermissionToDelete(permissionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!permissionToDelete) return;
    
    try {
      await deletePermission(permissionToDelete);
      toast.success("تم حذف الصلاحية بنجاح");
      onRefresh();
    } catch (error) {
      console.error("خطأ في حذف الصلاحية:", error);
      toast.error("حدث خطأ أثناء محاولة حذف الصلاحية");
    }
    
    setDeleteDialogOpen(false);
    setPermissionToDelete(null);
  };

  if (isLoading) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  if (!permissions || permissions.length === 0) {
    return (
      <div className="text-center py-10">
        <Shield className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium">لا توجد صلاحيات</h3>
        <p className="text-gray-500 mt-1">لم يتم إضافة أي صلاحيات بعد</p>
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
            <TableHead>إجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell className="font-medium">{permission.name}</TableCell>
              <TableCell>{permission.description}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(permission.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      <span>تعديل</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(permission.id)}>
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الصلاحية؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الصلاحية بشكل نهائي. قد يؤثر ذلك على المستخدمين الذين لديهم هذه الصلاحية.
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

export default PermissionsList;
