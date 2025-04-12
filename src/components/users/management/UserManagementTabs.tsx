
import { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "@/services/users/types";
import UserFilters from "@/components/users/UserFilters";
import UserList from "@/components/users/UserList";

interface UserManagementTabsProps {
  activeTab: string;
  users: User[];
  isLoading: boolean;
  searchTerm: string;
  filterRole: string | null;
  filterDepartment: string | null;
  filterTeam: string | null;
  showFilters: boolean;
  onFilter: (role: string | null, department: string | null, team: string | null) => void;
  onShowUserDetails: (userId: string) => void;
  onRefresh: () => void;
}

const UserManagementTabs = ({
  activeTab,
  users,
  isLoading,
  searchTerm,
  filterRole,
  filterDepartment,
  filterTeam,
  showFilters,
  onFilter,
  onShowUserDetails,
  onRefresh
}: UserManagementTabsProps) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (users) {
      let filtered = [...users];
      
      if (activeTab === "active") {
        filtered = filtered.filter(user => user.is_active);
      } else if (activeTab === "inactive") {
        filtered = filtered.filter(user => !user.is_active);
      }
      
      if (filterRole) {
        filtered = filtered.filter(user => user.role === filterRole);
      }
      
      if (filterDepartment) {
        filtered = filtered.filter(user => user.department_id === filterDepartment);
      }
      
      if (filterTeam) {
        filtered = filtered.filter(user => user.team_id === filterTeam);
      }
      
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

  const getTabTitle = () => {
    switch (activeTab) {
      case "active": return "المستخدمين النشطين";
      case "inactive": return "المستخدمين غير النشطين";
      default: return "جميع المستخدمين";
    }
  };

  return (
    <>
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <UserFilters onApplyFilters={onFilter} />
          </CardContent>
        </Card>
      )}
      
      <TabsContent value={activeTab} className="mt-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{getTabTitle()}</CardTitle>
            <CardDescription>
              إجمالي {activeTab === "active" ? "المستخدمين النشطين" : 
                     activeTab === "inactive" ? "المستخدمين غير النشطين" : 
                     "المستخدمين"}: {filteredUsers.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserList 
              users={filteredUsers}
              isLoading={isLoading}
              onShowDetails={onShowUserDetails}
              onRefresh={onRefresh}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};

export default UserManagementTabs;
