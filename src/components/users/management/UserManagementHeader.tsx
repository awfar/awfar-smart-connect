
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserManagementHeaderProps {
  onAddUser: () => void;
}

const UserManagementHeader = ({ onAddUser }: UserManagementHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">إدارة المستخدمين</h1>
        <p className="text-gray-500">إدارة المستخدمين، تعيين الأدوار والصلاحيات</p>
      </div>
      
      <Button onClick={onAddUser} className="flex items-center gap-2">
        <UserPlus className="h-4 w-4" />
        <span>إضافة مستخدم</span>
      </Button>
    </div>
  );
};

export default UserManagementHeader;
