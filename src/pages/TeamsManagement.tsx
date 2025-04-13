
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Building2, Edit, MoreVertical, Trash2, Users, UserCog } from "lucide-react";
import { fetchTeams, deleteTeam, Team, updateTeam, createTeam } from "@/services/teamsService";
import { fetchDepartments } from "@/services/departmentsService";
import { fetchUsers } from "@/services/users";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MobileOptimizedContainer from "@/components/ui/mobile-optimized-container";

interface TeamFormProps {
  team?: Team;
  isEditing: boolean;
  onSave: () => void;
}

const TeamForm = ({ team, isEditing, onSave }: TeamFormProps) => {
  const [name, setName] = useState(team?.name || "");
  const [departmentId, setDepartmentId] = useState(team?.department_id || "");
  const [managerId, setManagerId] = useState(team?.manager_id || "");
  const [loading, setLoading] = useState(false);

  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: () => fetchDepartments(),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetchUsers(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditing && team) {
        await updateTeam({
          id: team.id,
          name,
          department_id: departmentId || null,
          manager_id: managerId || null,
        });
      } else {
        await createTeam({
          name,
          department_id: departmentId,
          manager_id: managerId || undefined,
        });
      }
      
      onSave();
    } catch (error: any) {
      console.error("خطأ في إضافة/تعديل الفريق:", error);
      toast.error(error.message || "حدث خطأ أثناء حفظ الفريق");
    } finally {
      setLoading(false);
    }
  };

  // منسقي الفريق فقط هم المستخدمين الذين لديهم دور team_manager
  const managers = users.filter(user => user.role === 'team_manager');

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="team_name">اسم الفريق</Label>
          <Input 
            id="team_name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="مثال: فريق المبيعات، فريق الدعم"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team_department">القسم</Label>
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger id="team_department">
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">لا ينتمي لأي قسم</SelectItem>
              {departments.map(department => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="team_manager">مدير الفريق</Label>
          <Select value={managerId} onValueChange={setManagerId}>
            <SelectTrigger id="team_manager">
              <SelectValue placeholder="اختر مدير الفريق" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون مدير</SelectItem>
              {managers.map(manager => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.first_name} {manager.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onSave}>
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري الحفظ..." : isEditing ? "حفظ التغييرات" : "إضافة الفريق"}
        </Button>
      </div>
    </form>
  );
};

const TeamsManagement = () => {
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const { data: teams, isLoading, refetch } = useQuery({
    queryKey: ['teams'],
    queryFn: () => fetchTeams(),
  });

  const handleTeamAdded = () => {
    refetch();
    setShowTeamForm(false);
    toast.success("تم إضافة الفريق بنجاح");
  };

  const handleTeamUpdated = () => {
    refetch();
    setShowTeamForm(false);
    toast.success("تم تحديث الفريق بنجاح");
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setShowTeamForm(true);
  };

  const handleDeleteClick = (team: Team) => {
    setSelectedTeam(team);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTeam) return;
    
    try {
      await deleteTeam(selectedTeam.id);
      refetch();
    } catch (error) {
      console.error("خطأ في حذف الفريق:", error);
    }
    
    setDeleteDialogOpen(false);
    setSelectedTeam(null);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">إدارة الفرق</h1>
            <p className="text-gray-500">إدارة فرق العمل وتوزيع المستخدمين</p>
          </div>
          
          <Button onClick={() => {setSelectedTeam(null); setShowTeamForm(true)}} className="flex items-center gap-2">
            <span>إضافة فريق جديد</span>
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>قائمة الفرق</CardTitle>
            <CardDescription>
              الفرق المتاحة في النظام ومديري الفرق وعدد الأعضاء
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-10">جاري تحميل البيانات...</div>
            ) : !teams || teams.length === 0 ? (
              <div className="text-center py-10">
                <UserCog className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">لا توجد فرق</h3>
                <p className="text-gray-500 mt-1">لم يتم إضافة أي فرق بعد</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>مدير الفريق</TableHead>
                    <TableHead>عدد الأعضاء</TableHead>
                    <TableHead>إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>
                        {team.department_name ? (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            <span>{team.department_name}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {team.manager_name ? (
                          <div className="flex items-center gap-1">
                            <UserCog className="h-3 w-3" />
                            <span>{team.manager_name}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{team.member_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                              <Edit className="h-4 w-4 mr-2" />
                              <span>تعديل</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(team)}>
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
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={showTeamForm} onOpenChange={setShowTeamForm}>
        <DialogContent className="max-w-2xl rtl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTeam ? "تعديل الفريق" : "إضافة فريق جديد"}</DialogTitle>
          </DialogHeader>
          <MobileOptimizedContainer>
            <TeamForm 
              team={selectedTeam || undefined} 
              isEditing={!!selectedTeam}
              onSave={selectedTeam ? handleTeamUpdated : handleTeamAdded} 
            />
          </MobileOptimizedContainer>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الفريق؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الفريق بشكل نهائي. لا يمكنك حذف فريق يحتوي على أعضاء.
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
    </DashboardLayout>
  );
};

export default TeamsManagement;
