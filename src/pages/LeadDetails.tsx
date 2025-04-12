
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Check, Clock, List, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";
import { fetchLeadById, Lead } from "@/services/leadsService";
import ActivityForm from "@/components/leads/ActivityForm";
import { LeadActivity } from "@/services/types/leadTypes";

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("info");
  const [showActivityForm, setShowActivityForm] = useState<boolean>(false);
  const [activities, setActivities] = useState<LeadActivity[]>([
    {
      id: "1",
      lead_id: id || "",
      type: "note",
      description: "تم الاتصال بالعميل لمناقشة احتياجاته",
      scheduled_at: "2023-05-15",
      completed: true,
      created_at: "2023-05-14",
      created_by: "أحمد محمد"
    },
    {
      id: "2",
      lead_id: id || "",
      type: "call",
      description: "مكالمة متابعة للتحقق من رضا العميل",
      scheduled_at: "2023-05-20",
      completed: false,
      created_at: "2023-05-14",
      created_by: "سارة أحمد"
    }
  ]);

  useEffect(() => {
    const loadLead = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await fetchLeadById(id);
        if (data) {
          setLead(data);
        } else {
          toast.error("لم يتم العثور على العميل المحتمل");
          navigate("/dashboard/leads");
        }
      } catch (error) {
        console.error("Error fetching lead:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات العميل المحتمل");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLead();
  }, [id, navigate]);

  const handleAddActivity = () => {
    setShowActivityForm(true);
  };

  const handleActivitySuccess = (activity: LeadActivity) => {
    setActivities(prev => [activity, ...prev]);
    setShowActivityForm(false);
    toast.success("تم إضافة النشاط بنجاح");
  };

  const handleCompleteActivity = (activityId: string) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, completed: true }
          : activity
      )
    );
    toast.success("تم إكمال النشاط بنجاح");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/dashboard/leads")}
                >
                  <ArrowLeft className="h-4 w-4 ml-1" />
                  العودة
                </Button>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {isLoading ? "جاري التحميل..." : lead?.first_name + " " + lead?.last_name}
                </h1>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">تحرير</Button>
                <Button>إنشاء فرصة</Button>
              </div>
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            ) : lead ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="md:col-span-3">
                    <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>بيانات العميل المحتمل</CardTitle>
                            <CardDescription>المعلومات الأساسية والتاريخ</CardDescription>
                          </div>
                          <TabsList>
                            <TabsTrigger value="info">المعلومات</TabsTrigger>
                            <TabsTrigger value="activities">الأنشطة</TabsTrigger>
                            <TabsTrigger value="notes">الملاحظات</TabsTrigger>
                          </TabsList>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <TabsContent value="info" className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">المعلومات الشخصية</h3>
                                
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="flex items-start gap-2">
                                    <User className="h-4 w-4 text-gray-400 mt-1" />
                                    <div>
                                      <div className="text-sm font-medium">{lead.first_name} {lead.last_name}</div>
                                      <div className="text-xs text-gray-500">{lead.position || "غير محدد"}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 text-gray-400 mt-1" />
                                    <div>
                                      <div className="text-sm">{lead.email || "غير محدد"}</div>
                                      <div className="text-xs text-gray-500">البريد الإلكتروني</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-gray-400 mt-1" />
                                    <div>
                                      <div className="text-sm">{lead.phone || "غير محدد"}</div>
                                      <div className="text-xs text-gray-500">رقم الهاتف</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">معلومات الشركة</h3>
                                
                                <div className="grid gap-4">
                                  <div>
                                    <div className="text-sm font-medium">{lead.company || "غير محدد"}</div>
                                    <div className="text-xs text-gray-500">الشركة</div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm">{lead.industry || "غير محدد"}</div>
                                    <div className="text-xs text-gray-500">القطاع</div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm">{lead.country || "غير محدد"}</div>
                                    <div className="text-xs text-gray-500">الدولة</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">معلومات الفرصة</h3>
                                
                                <div className="grid gap-4">
                                  <div>
                                    <div className="inline-flex px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      {lead.stage || "جديد"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">المرحلة</div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm">{lead.source || "غير محدد"}</div>
                                    <div className="text-xs text-gray-500">المصدر</div>
                                  </div>
                                  
                                  <div>
                                    <div className="text-sm">{lead.owner?.name || "غير مخصص"}</div>
                                    <div className="text-xs text-gray-500">المسؤول</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">معلومات إضافية</h3>
                                
                                <div>
                                  <div className="text-sm whitespace-pre-line">
                                    {lead.notes || "لا توجد ملاحظات مضافة حتى الآن."}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">الملاحظات</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="activities">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">الأنشطة</h3>
                              {!showActivityForm && (
                                <Button size="sm" onClick={handleAddActivity}>إضافة نشاط</Button>
                              )}
                            </div>
                            
                            {showActivityForm && (
                              <div className="mb-6">
                                <ActivityForm 
                                  onClose={() => setShowActivityForm(false)} 
                                  onSuccess={handleActivitySuccess} 
                                  leadId={id || ""}
                                  title="إضافة نشاط جديد"
                                />
                              </div>
                            )}
                            
                            <div className="space-y-3">
                              {activities.length > 0 ? (
                                activities.map((activity) => (
                                  <div 
                                    key={activity.id} 
                                    className="border rounded-lg p-4 bg-white"
                                  >
                                    <div className="flex justify-between">
                                      <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full ${
                                          activity.type === 'call' ? 'bg-blue-100' : 
                                          activity.type === 'meeting' ? 'bg-purple-100' : 
                                          activity.type === 'email' ? 'bg-yellow-100' : 
                                          activity.type === 'task' ? 'bg-green-100' : 'bg-gray-100'
                                        }`}>
                                          {activity.type === 'call' ? (
                                            <Phone className="h-4 w-4 text-blue-700" />
                                          ) : activity.type === 'meeting' ? (
                                            <User className="h-4 w-4 text-purple-700" />
                                          ) : activity.type === 'email' ? (
                                            <Mail className="h-4 w-4 text-yellow-700" />
                                          ) : activity.type === 'task' ? (
                                            <Check className="h-4 w-4 text-green-700" />
                                          ) : (
                                            <List className="h-4 w-4 text-gray-700" />
                                          )}
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">
                                              {activity.type === 'call' ? 'مكالمة' : 
                                               activity.type === 'meeting' ? 'اجتماع' : 
                                               activity.type === 'email' ? 'بريد إلكتروني' : 
                                               activity.type === 'task' ? 'مهمة' : 'ملاحظة'}
                                            </span>
                                            <span className="text-xs text-gray-500">{activity.created_at}</span>
                                          </div>
                                          <p className="text-sm mt-1">{activity.description}</p>
                                          <div className="flex items-center gap-2 mt-2">
                                            <Clock className="h-3 w-3 text-gray-400" />
                                            <span className="text-xs text-gray-500">{activity.scheduled_at}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {!activity.completed && (
                                        <Button 
                                          size="sm" 
                                          variant="ghost"
                                          onClick={() => handleCompleteActivity(activity.id)}
                                        >
                                          إكمال
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  لا توجد أنشطة مسجلة حتى الآن
                                </div>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="notes">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">الملاحظات</h3>
                              <Button size="sm">إضافة ملاحظة</Button>
                            </div>
                            
                            <div className="bg-gray-50 border rounded-lg p-6 text-center">
                              <p className="text-gray-500">لا توجد ملاحظات مضافة حتى الآن</p>
                            </div>
                          </div>
                        </TabsContent>
                      </CardContent>
                    </Tabs>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>تفاصيل سريعة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium">المرحلة الحالية</div>
                          <div className="inline-flex px-2 py-1 mt-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {lead.stage || "جديد"}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">المسؤول</div>
                          {lead.owner ? (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                {lead.owner.initials}
                              </div>
                              <span className="text-sm">{lead.owner.name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">غير مخصص</span>
                          )}
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">تاريخ الإضافة</div>
                          <div className="text-sm mt-1">{new Date(lead.created_at).toLocaleDateString()}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">آخر تحديث</div>
                          <div className="text-sm mt-1">{new Date(lead.updated_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">لم يتم العثور على العميل المحتمل</p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate("/dashboard/leads")}
                  >
                    العودة إلى قائمة العملاء المحتملين
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadDetails;
