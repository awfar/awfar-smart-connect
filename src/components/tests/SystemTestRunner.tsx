
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemTestingService, TestReport, TestResult } from "@/services/permissions/testingService";
import { Download, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

/**
 * مكون واجهة المستخدم لتشغيل الاختبارات وعرض النتائج
 */
const SystemTestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testReport, setTestReport] = useState<TestReport | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const testingService = new SystemTestingService();

  /**
   * تشغيل الاختبارات الشاملة للنظام
   */
  const runTests = async () => {
    setIsRunning(true);
    toast.info("جاري تنفيذ الاختبارات الشاملة للنظام...");
    
    try {
      const report = await testingService.runComprehensiveTest();
      setTestReport(report);
      
      if (report.success) {
        toast.success("تم اكتمال الاختبارات بنجاح");
      } else {
        toast.error("انتهت الاختبارات مع وجود أخطاء");
      }
    } catch (error) {
      console.error("خطأ في تنفيذ الاختبارات:", error);
      toast.error("حدث خطأ أثناء تنفيذ الاختبارات");
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * تصدير نتائج الاختبار كملف JSON
   */
  const exportResults = () => {
    if (!testReport) return;
    
    const dataStr = JSON.stringify(testReport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `system-test-report-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  /**
   * تصفية النتائج بناءً على التبويب النشط
   */
  const getFilteredResults = (): TestResult[] => {
    if (!testReport) return [];
    
    switch (activeTab) {
      case "success":
        return testReport.results.filter(result => result.success);
      case "failed":
        return testReport.results.filter(result => !result.success);
      case "leads":
        return testReport.results.filter(result => result.component === "Leads");
      case "deals":
        return testReport.results.filter(result => result.component === "Deals");
      case "companies":
        return testReport.results.filter(result => result.component === "Companies");
      case "tickets":
        return testReport.results.filter(result => result.component === "Tickets");
      case "permissions":
        return testReport.results.filter(result => result.component === "Permissions");
      default:
        return testReport.results;
    }
  };

  const filteredResults = getFilteredResults();
  
  /**
   * حساب الإحصائيات الخاصة بالاختبارات
   */
  const getStats = () => {
    if (!testReport) return { total: 0, success: 0, failed: 0, avgResponseTime: 0 };
    
    const results = testReport.results;
    const total = results.length;
    const success = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    const avgResponseTime = results.reduce((sum, r) => sum + r.responseTimeMs, 0) / total;
    
    return { total, success, failed, avgResponseTime };
  };
  
  const stats = getStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">أداة اختبار النظام الشاملة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              هذه الأداة تقوم باختبار جميع وظائف النظام والتحقق من صحة عملها وترابطها مع بعضها البعض.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex-1"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    جاري تنفيذ الاختبارات...
                  </>
                ) : (
                  <>تشغيل الاختبارات الشاملة</>
                )}
              </Button>
              
              {testReport && (
                <Button 
                  variant="outline" 
                  onClick={exportResults}
                  size="lg"
                >
                  <Download className="mr-2 h-4 w-4" />
                  تصدير النتائج
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {testReport && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>ملخص نتائج الاختبارات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الاختبارات</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-green-600">الاختبارات الناجحة</p>
                  <p className="text-3xl font-bold text-green-700">{stats.success}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-red-600">الاختبارات الفاشلة</p>
                  <p className="text-3xl font-bold text-red-700">{stats.failed}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-blue-600">متوسط زمن الاستجابة</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.avgResponseTime.toFixed(2)} ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل نتائج الاختبارات</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="success">الناجحة</TabsTrigger>
                  <TabsTrigger value="failed">الفاشلة</TabsTrigger>
                  <TabsTrigger value="leads">الليدز</TabsTrigger>
                  <TabsTrigger value="deals">الصفقات</TabsTrigger>
                  <TabsTrigger value="companies">الشركات</TabsTrigger>
                  <TabsTrigger value="tickets">التذاكر</TabsTrigger>
                  <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">النتيجة</TableHead>
                          <TableHead>اسم الاختبار</TableHead>
                          <TableHead>الوحدة</TableHead>
                          <TableHead className="hidden md:table-cell">التفاصيل</TableHead>
                          <TableHead className="text-right">زمن الاستجابة</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                              لا توجد نتائج للعرض
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {result.success ? (
                                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                                ) : (
                                  <XCircle className="h-6 w-6 text-red-500" />
                                )}
                              </TableCell>
                              <TableCell className="font-medium">{result.name}</TableCell>
                              <TableCell>{result.component}</TableCell>
                              <TableCell className="hidden md:table-cell">
                                <span 
                                  className={`${
                                    result.success ? 'text-green-600' : 'text-red-600'
                                  } text-sm`}
                                >
                                  {result.details}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <span className="text-muted-foreground">
                                  {result.responseTimeMs.toFixed(2)} ms
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SystemTestRunner;
