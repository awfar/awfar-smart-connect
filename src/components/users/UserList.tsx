
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  UserCheck, 
  UserX, 
  MoreVertical, 
  Users, 
  Building2,
  Shield 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, activateUser, deactivateUser } from "@/services/users";
import { toast } from "sonner";

interface UserListProps {
  users: User[];
  isLoading: boolean;
  onShowDetails: (userId: string) => void;
  onRefresh: () => void;
}

const UserList = ({ users, isLoading, onShowDetails, onRefresh }: UserListProps) => {
  const handleActivate = async (userId: string) => {
    const success = await activateUser(userId);
    if (success) {
      onRefresh();
    }
  };

  const handleDeactivate = async (userId: string) => {
    const success = await deactivateUser(userId);
    if (success) {
      onRefresh();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case 'team_manager':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'sales':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'customer_service':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'technical_support':
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return "مدير النظام";
      case 'team_manager':
        return "مدير فريق";
      case 'sales':
        return "مبيعات";
      case 'customer_service':
        return "خدمة عملاء";
      case 'technical_support':
        return "دعم فني";
      default:
        return "غير محدد";
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">جاري تحميل البيانات...</div>;
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-10">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium">لا يوجد مستخدمين</h3>
        <p className="text-gray-500 mt-1">لم يتم العثور على أي مستخدمين مطابقين للمعايير المحددة</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الاسم</TableHead>
          <TableHead>البريد الإلكتروني</TableHead>
          <TableHead>الدور</TableHead>
          <TableHead>القسم</TableHead>
          <TableHead>الفريق</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>إجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="font-medium">
                {user.first_name} {user.last_name}
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline" className={`${getRoleBadgeColor(user.role)}`}>
                {getRoleLabel(user.role)}
              </Badge>
            </TableCell>
            <TableCell>
              {user.department_name ? (
                <div className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  <span>{user.department_name}</span>
                </div>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              {user.team_name ? (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{user.team_name}</span>
                </div>
              ) : (
                "-"
              )}
            </TableCell>
            <TableCell>
              {user.is_active ? (
                <Badge variant="outline" className="bg-green-100 text-green-800">نشط</Badge>
              ) : (
                <Badge variant="outline" className="bg-red-100 text-red-800">غير نشط</Badge>
              )}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onShowDetails(user.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    <span>عرض التفاصيل</span>
                  </DropdownMenuItem>
                  {user.is_active ? (
                    <DropdownMenuItem onClick={() => handleDeactivate(user.id)}>
                      <UserX className="h-4 w-4 mr-2" />
                      <span>تعطيل الحساب</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => handleActivate(user.id)}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      <span>تفعيل الحساب</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserList;
