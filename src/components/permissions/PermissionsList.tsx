
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
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
import { Pencil, Trash2, RefreshCw, MoreVertical } from "lucide-react";
import { deletePermission } from "@/services/permissions/permissionsService";
import { PermissionDefinition } from "@/services/permissions/permissionTypes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PermissionsListProps {
  permissions: PermissionDefinition[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onRefresh: () => void;
}

const PermissionsList = ({ permissions, isLoading, onEdit, onRefresh }: PermissionsListProps) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState("");

  const handleDeleteClick = (id: string) => {
    setSelectedPermissionId(id);
    setConfirmDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePermission(selectedPermissionId);
      onRefresh();
      toast.success("تم حذف الصلاحية بنجاح");
    } catch (error) {
      console.error("Failed to delete permission:", error);
      toast.error("فشل حذف الصلاحية");
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const getLevelLabel = (level: string): string => {
    switch (level) {
      case 'read-only':
        return 'قراءة فقط';
      case 'read-edit':
        return 'قراءة وتعديل';
      case 'full-access':
        return 'وصول كامل';
      default:
        return level;
    }
  };

  const getScopeLabel = (scope: string): string => {
    switch (scope) {
      case 'own':
        return 'سجلاته';
      case 'team':
        return 'فريقه';
      case 'all':
        return 'الكل';
      case 'unassigned':
        return 'غير مسندة';
      default:
        return scope;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          {!isLoading && (
            <p className="text-sm text-muted-foreground">
              إجمالي الصلاحيات: {permissions.length}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          تحديث
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full border-2 border-primary border-t-transparent h-8 w-8 mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      ) : permissions.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">لا توجد صلاحيات</p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوحدة</TableHead>
                <TableHead>مستوى الصلاحية</TableHead>
                <TableHead>نطاق الصلاحية</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead className="text-left">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.object}</TableCell>
                  <TableCell>{getLevelLabel(permission.level)}</TableCell>
                  <TableCell>{getScopeLabel(permission.scope)}</TableCell>
                  <TableCell>{permission.description}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(permission.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>تعديل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(permission.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>حذف</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الصلاحية؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيؤدي حذف هذه الصلاحية إلى إزالتها من جميع الأدوار المرتبطة بها.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDeleteConfirm}>
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PermissionsList;
