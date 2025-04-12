
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Search, Users, UserPlus, Filter } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { fetchUsers } from "@/services/usersService";
import UserForm from "@/components/users/UserForm";
import UserList from "@/components/users/UserList";
import UserFilters from "@/components/users/UserFilters";
import { toast } from "sonner";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [filterTeam, setFilterTeam] = useState<string | null>(null);
  
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });

  useEffect(() => {
    if (users) {
      let filtered = [...users];
      
      // فلترة حسب التاب النشط
      if (activeTab === "active") {
        filtered = filtered.filter(user => user.is_active);
      } else if (activeTab === "inactive") {
        filtered = filtered.filter(user => !user.is_active);
      }
      
      // فلترة حسب الدور
      if (filterRole) {
        filtered = filtered.filter(user => user.role === filterRole);
      }
      
      // فلترة حسب القسم
      if (filterDepartment) {
        filtered = filtered.filter(user => user.department_id === filterDepartment);
      }
      
      // فلترة حسب الفريق
      if (filterTeam) {
        filtered = filtered.filter(user => user.team_id === filterTeam);
      }
      
      // فلترة حسب البحث
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(user => 
          (user.first_name && user.first_name.toLowerCase().includes(term)) || 
          (user.last_name && user.last_name.toLowerCase().includes(term)) ||
          (user.email && user.email.toLowerCase().includes(term))
        );
      }
      
      setFilteredUsers(filtered);
    }
  }, [users, activeTab, filterRole, filterDepartment, filterTeam, searchTerm]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = (role: string | null, department: string | null, team: string | null) => {
    setFilterRole(role);
    setFilterDepartment(department);
    setFilterTeam(team);
    setShowFilters(false);
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

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">إدارة المستخدمين</h1>
                <p className="text-gray-500">إدارة المستخدمين، تعيين الأدوار والصلاحيات</p>
              </div>
              
              <Button onClick={() => setShowAddUser(true)} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>إضافة مستخدم</span>
              </Button>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <TabsList className="mb-4 md:mb-0">
                  <TabsTrigger value="all">جميع المستخدمين</TabsTrigger>
                  <TabsTrigger value="active">المستخدمين النشطين</TabsTrigger>
                  <TabsTrigger value="inactive">المستخدمين غير النشطين</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="بحث عن مستخدم..."
                      className="w-full md:w-80 pr-10"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    <span>فلترة</span>
                  </Button>
                </div>
              </div>
              
              {showFilters && (
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <UserFilters onApplyFilters={handleFilter} />
                  </CardContent>
                </Card>
              )}
              
              <TabsContent value="all" className="mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>جميع المستخدمين</CardTitle>
                    <CardDescription>
                      إجمالي المستخدمين: {filteredUsers.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserList 
                      users={filteredUsers}
                      isLoading={isLoading}
                      onShowDetails={handleShowUserDetails}
                      onRefresh={refetch}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="active" className="mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>المستخدمين النشطين</CardTitle>
                    <CardDescription>
                      إجمالي المستخدمين النشطين: {filteredUsers.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserList 
                      users={filteredUsers}
                      isLoading={isLoading}
                      onShowDetails={handleShowUserDetails}
                      onRefresh={refetch}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="inactive" className="mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>المستخدمين غير النشطين</CardTitle>
                    <CardDescription>
                      إجمالي المستخدمين غير النشطين: {filteredUsers.length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserList 
                      users={filteredUsers}
                      isLoading={isLoading}
                      onShowDetails={handleShowUserDetails}
                      onRefresh={refetch}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      {/* إضافة مستخدم جديد */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent className="max-w-2xl rtl">
          <DialogHeader>
            <DialogTitle>إضافة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <UserForm onSave={handleUserAdded} />
        </DialogContent>
      </Dialog>
      
      {/* عرض تفاصيل المستخدم */}
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
    </div>
  );
};

export default UserManagement;
