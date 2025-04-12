
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { fetchUsers } from "@/services/users";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import UserManagementHeader from "@/components/users/management/UserManagementHeader";
import UserManagementSearch from "@/components/users/management/UserManagementSearch";
import UserManagementTabs from "@/components/users/management/UserManagementTabs";
import UserForm from "@/components/users/UserForm";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [filterTeam, setFilterTeam] = useState<string | null>(null);
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilter = (role: string | null, department: string | null, team: string | null) => {
    setFilterRole(role);
    setFilterDepartment(department);
    setFilterTeam(team);
    setShowFilters(false);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleShowUserDetails = (userId: string) => {
    setSelectedUser(userId);
    setShowUserDetails(true);
  };

  const handleUserUpdated = () => {
    refetch();
    setShowUserDetails(false);
  };

  const handleUserAdded = () => {
    refetch();
    setShowAddUser(false);
    toast.success("تم إضافة المستخدم بنجاح");
  };

  const handleAddUser = () => {
    setShowAddUser(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <UserManagementHeader onAddUser={handleAddUser} />
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
          <UserManagementSearch 
            searchTerm={searchTerm}
            onSearch={handleSearch}
            showFilters={showFilters}
            onToggleFilters={handleToggleFilters}
          />
          
          <UserManagementTabs 
            activeTab={activeTab}
            users={users || []}
            isLoading={isLoading}
            searchTerm={searchTerm}
            filterRole={filterRole}
            filterDepartment={filterDepartment}
            filterTeam={filterTeam}
            showFilters={showFilters}
            onFilter={handleFilter}
            onShowUserDetails={handleShowUserDetails}
            onRefresh={refetch}
          />
        </Tabs>
      </div>
      
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-2xl rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <UserForm onSave={handleUserAdded} />
        </DialogContent>
      </Dialog>
      
      <Sheet open={showUserDetails} onOpenChange={setShowUserDetails}>
        <SheetContent className="w-full md:max-w-xl rtl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>تفاصيل المستخدم</SheetTitle>
          </SheetHeader>
          {selectedUser && (
            <UserForm 
              userId={selectedUser} 
              isEditing={true}
              onSave={handleUserUpdated}
            />
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default UserManagement;
