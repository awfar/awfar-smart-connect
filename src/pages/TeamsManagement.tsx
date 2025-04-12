import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UsersRound, Plus, Edit, Trash2, Users, UserCheck } from "lucide-react";
import { Team, fetchTeams, createTeam, updateTeam, deleteTeam, getTeamMembers } from "@/services/teamsService";
import { fetchDepartments } from "@/services/departmentsService";
import TeamForm from "@/components/users/TeamForm";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";

const TeamsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showTeamMembers, setShowTeamMembers] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);

  const { data: teams = [], isLoading, refetch } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
  });

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || team.department_id === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDepartment = (departmentId: string | null) => {
    setFilterDepartment(departmentId);
  };

  const handleAddTeam = async (data: { name: string; department_id: string; manager_id?: string }) => {
    const newTeam = await createTeam(data);
    if (newTeam) {
      setShowAddTeam(false);
      refetch();
    }
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowEditTeam(true);
  };

  const handleSaveEdit = async (data: { name: string; department_id: string; manager_id?: string }) => {
    if (!selectedTeam) return;
    
    const updated = await updateTeam({
      id: selectedTeam.id,
      name: data.name,
      department_id: data.department_id,
      manager_id: data.manager_id
    });
    
    if (updated) {
      setShowEditTeam(false);
      refetch();
    }
  };

  const handleDeletePrompt = (team: Team) => {
    setSelectedTeam(team);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeam) return;
    
    const success = await deleteTeam(selectedTeam.id);
    if (success) {
      setShowDeleteDialog(false);
      refetch();
    }
  };

  const handleViewTeamMembers = async (team: Team) => {
    setSelectedTeam(team);
    
    try {
      const members = await getTeamMembers(team.id);
      setTeamMembers(members);
      setShowTeamMembers(true);
    } catch (error) {
      toast.error("فشل في جلب أعضاء الفريق");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">إدارة الفرق</h1>
            <p className="text-gray-500">إنشاء وتعديل وحذف الفرق في المنظمة</p>
          </div>
          
          <Button onClick={() => setShowAddTeam(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>إضافة فريق</span>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="بحث عن فريق..."
              className="w-full md:w-80 pr-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">فلترة حسب القسم:</span>
            <select 
              className="border rounded p-2 text-sm"
              value={filterDepartment || ""}
              onChange={(e) => handleFilterDepartment(e.target.value || null)}
            >
              <option value="">جميع الأقسام</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>قائمة الفرق</CardTitle>
                <CardDescription>
                  إجمالي الفرق: {filteredTeams.length}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">جاري تحميل البيانات...</div>
            ) : filteredTeams.length === 0 ? (
              <div className="text-center py-10">
                <UsersRound className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">لا توجد فرق</h3>
                <p className="text-gray-500 mt-1">أضف فرقاً جديدة لتنظيم المستخدمين</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الفريق</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>مدير الفريق</TableHead>
                    <TableHead>عدد الأعضاء</TableHead>
                    <TableHead>تاريخ الإنشاء</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>{team.department_name || "-"}</TableCell>
                      <TableCell>
                        {team.manager_name ? (
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-4 w-4" />
                            <span>{team.manager_name}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">
                            غير معين
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{team.member_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(team.created_at).toLocaleDateString('ar-SA')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewTeamMembers(team)}
                            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTeam(team)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeletePrompt(team)}
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
      
      <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
        <DialogContent className="sm:max-w-md rtl">
          <DialogHeader>
            <DialogTitle>إضافة فريق جديد</DialogTitle>
            <DialogDescription>أدخل بيانات الفريق الجديد</DialogDescription>
          </DialogHeader>
          <TeamForm onSave={handleAddTeam} onCancel={() => setShowAddTeam(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditTeam} onOpenChange={setShowEditTeam}>
        <DialogContent className="sm:max-w-md rtl">
          <DialogHeader>
            <DialogTitle>تعديل فريق</DialogTitle>
            <DialogDescription>تعديل بيانات الفريق</DialogDescription>
          </DialogHeader>
          <TeamForm 
            team={selectedTeam} 
            onSave={handleSaveEdit} 
            onCancel={() => setShowEditTeam(false)} 
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
              هل أنت متأكد من رغبتك في حذف فريق "{selectedTeam?.name}"؟
            </p>
            <p className="text-sm text-amber-600">
              ملاحظة: لا يمكن حذف الفريق إذا كان يحتوي على أعضاء.
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
      
      <Sheet open={showTeamMembers} onOpenChange={setShowTeamMembers}>
        <SheetContent className="rtl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>أعضاء فريق {selectedTeam?.name}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {teamMembers.length === 0 ? (
              <div className="text-center py-10">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">لا يوجد أعضاء</h3>
                <p className="text-gray-500 mt-1">هذا الفريق لا يحتوي على أعضاء حاليا</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>البريد الإلكتروني</TableHead>
                    <TableHead>الدور</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        {member.first_name} {member.last_name}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-100">
                          {member.role === 'super_admin' ? 'مدير النظام' :
                           member.role === 'team_manager' ? 'مدير فريق' :
                           member.role === 'sales' ? 'مبيعات' :
                           member.role === 'customer_service' ? 'خدمة عملاء' :
                           member.role === 'technical_support' ? 'دعم فني' : 'غير محدد'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default TeamsManagement;
