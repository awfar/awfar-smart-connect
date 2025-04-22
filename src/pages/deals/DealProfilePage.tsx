import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDealById, getDealActivities } from "@/services/dealsService";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft, Building, Calendar, Clock, DollarSign, Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DealForm from "@/components/deals/DealForm";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  getDealStageBadgeColor, 
  getDealStatusName, 
  getDealStageName,
  calculateDealProgress
} from "@/services/deals/utils";
import DealActivityTimeline from "@/components/deals/DealActivityTimeline";
import DealTasksSection from "@/components/deals/DealTasksSection";
import DealInvoices from "@/components/deals/DealInvoices";
import DealFilesSection from "@/components/deals/DealFilesSection";
import { Skeleton } from "@/components/ui/skeleton";

const DealProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: deal, isLoading: isDealLoading, error } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => getDealById(id || ''),
    enabled: !!id
  });
  
  const { data: activities, isLoading: isActivitiesLoading } = useQuery({
    queryKey: ['deal-activities', id],
    queryFn: () => getDealActivities(id || ''),
    enabled: !!id
  });
  
  if (isDealLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-40 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !deal) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="space-y-4">
            <Button variant="outline" onClick={() => navigate('/dashboard/deals')}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة إلى قائمة الصفقات
            </Button>
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-2">لا يمكن تحميل بيانات الصفقة</h2>
              <p className="text-muted-foreground mb-6">
                حدث خطأ في تحميل بيانات الصفقة أو أن الصفقة غير موجودة
              </p>
              <Button onClick={() => window.location.reload()}>
                إعادة المحاولة
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const handleSaveChanges = () => {
    setIsEditing(false);
    queryClient.invalidateQueries({ queryKey: ['deal', id] });
    toast.success("تم حفظ التغييرات بنجاح");
  };
  
  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "-";
    try {
      return format(parseISO(dateStr), "d MMMM yyyy", { locale: ar });
    } catch (e) {
      return dateStr;
    }
  };
  
  const formatCurrency = (value: number | undefined | null) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(value);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <Button variant="outline" onClick={() => navigate('/dashboard/deals')}>
              <ArrowLeft className="ml-2 h-4 w-4" />
              العودة إلى قائمة الصفقات
            </Button>
          </div>
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="ml-2 h-4 w-4" />
            تحرير الصفقة
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <Badge className="mb-2">
                  {getDealStatusName(deal.status)}
                </Badge>
                <CardTitle className="text-2xl md:text-3xl">{deal.name}</CardTitle>
                <CardDescription className="mt-2">
                  تم إنشاءها في {formatDate(deal.created_at)}
                </CardDescription>
              </div>
              <div className="text-center md:text-left md:min-w-[180px]">
                <div className="text-3xl font-bold">{formatCurrency(deal.value)}</div>
                <CardDescription>قيمة الصفقة</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                <Badge 
                  variant="outline" 
                  className={`${getDealStageBadgeColor(deal.stage)} text-sm py-1 px-3`}
                >
                  {getDealStageName(deal.stage)}
                </Badge>
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span>التقدم</span>
                    <span>{calculateDealProgress(deal.stage)}%</span>
                  </div>
                  <Progress value={calculateDealProgress(deal.stage)} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">الشركة</span>
                  </div>
                  {deal.company_id ? (
                    <Button 
                      variant="link" 
                      onClick={() => navigate(`/dashboard/companies/${deal.company_id}`)} 
                      className="p-0 h-auto mt-1 text-base font-medium"
                    >
                      {deal.company_name}
                    </Button>
                  ) : (
                    <p className="mt-1">لا توجد شركة مرتبطة</p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">جهة الاتصال</span>
                  </div>
                  {deal.lead_id && deal.lead ? (
                    <Button 
                      variant="link" 
                      onClick={() => navigate(`/dashboard/leads/${deal.lead_id}`)} 
                      className="p-0 h-auto mt-1 text-base font-medium"
                    >
                      {deal.lead.first_name && deal.lead.last_name ? 
                        `${deal.lead.first_name} ${deal.lead.last_name}` : 
                        deal.lead.email}
                    </Button>
                  ) : deal.contact_name ? (
                    <p className="mt-1 font-medium">{deal.contact_name}</p>
                  ) : (
                    <p className="mt-1">لا توجد جهة اتصال مرتبطة</p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">تاريخ الإغلاق المتوقع</span>
                  </div>
                  <p className="mt-1 font-medium">
                    {formatDate(deal.expected_close_date)}
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">المسؤول</span>
                  </div>
                  {deal.owner ? (
                    <div className="mt-1 flex items-center">
                      <Avatar className="h-6 w-6 text-xs ml-2">
                        {deal.owner.initials}
                      </Avatar>
                      <span className="font-medium">{deal.owner.name}</span>
                    </div>
                  ) : (
                    <p className="mt-1">غير معين</p>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-muted-foreground">تاريخ الإنشاء</span>
                  </div>
                  <p className="mt-1 font-medium">
                    {formatDate(deal.created_at)}
                  </p>
                </div>
              </div>
              
              {deal.description && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">الوصف</h3>
                  <p className="text-sm whitespace-pre-wrap">{deal.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="timeline">التسلسل الزمني</TabsTrigger>
            <TabsTrigger value="tasks">المهام</TabsTrigger>
            <TabsTrigger value="invoices">الفواتير</TabsTrigger>
            <TabsTrigger value="files">الملفات</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>ملخص الصفقة</CardTitle>
                  <CardDescription>تفاصيل الصفقة والتقدم</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-muted-foreground text-center py-10">
                      سيتم إضافة المزيد من التحليلات والإحصائيات هنا قريباً.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline">
              <DealActivityTimeline 
                dealId={deal.id} 
                activities={activities || []} 
                isLoading={isActivitiesLoading}
                onActivityAdded={() => {
                  queryClient.invalidateQueries({ queryKey: ['deal-activities', id] });
                }}
              />
            </TabsContent>
            
            <TabsContent value="tasks">
              <DealTasksSection dealId={deal.id} />
            </TabsContent>
            
            <TabsContent value="invoices">
              <DealInvoices dealId={deal.id} />
            </TabsContent>
            
            <TabsContent value="files">
              <DealFilesSection dealId={deal.id} />
            </TabsContent>
          </div>
        </Tabs>
        
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>تعديل الصفقة</DialogTitle>
            </DialogHeader>
            <DealForm 
              onCancel={() => setIsEditing(false)}
              onSave={handleSaveChanges}
              dealId={deal.id}
              initialData={deal}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default DealProfilePage;
