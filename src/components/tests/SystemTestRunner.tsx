
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SystemTestingService, TestReport, TestResult } from "@/services/permissions/testingService";
import { Download, CheckCircle2, XCircle, AlertCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import TestSelectionTable, { TestModule, SelectedTests } from "./TestSelectionTable";

/**
 * مكون واجهة المستخدم لتشغيل الاختبارات وعرض النتائج
 */
const SystemTestRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testReport, setTestReport] = useState<TestReport | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const testingService = new SystemTestingService();
  const [selectedTests, setSelectedTests] = useState<SelectedTests>({});
  
  // قائمة وحدات النظام للاختبار
  const testModules: TestModule[] = [
    {
      id: "leads",
      name: "العملاء المحتملين",
      description: "اختبار وظائف إدارة العملاء المحتملين",
      actions: [
        {
          id: "create",
          name: "إنشاء عميل محتمل",
          description: "إنشاء عميل محتمل جديد في النظام",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل البيانات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المدخلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "update",
          name: "تعديل عميل محتمل",
          description: "تحديث بيانات عميل محتمل موجود",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل التعديلات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات المعدلة في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المعدلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "delete",
          name: "حذف عميل محتمل",
          description: "حذف عميل محتمل من النظام",
          validations: [
            { id: "database", name: "حذف من قاعدة البيانات", description: "التأكد من حذف البيانات من قاعدة البيانات" },
            { id: "display", name: "تحديث الواجهة", description: "التأكد من تحديث واجهة المستخدم بعد الحذف" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        }
      ]
    },
    {
      id: "deals",
      name: "الصفقات",
      description: "اختبار وظائف إدارة الصفقات",
      actions: [
        {
          id: "create",
          name: "إنشاء صفقة",
          description: "إنشاء صفقة جديدة في النظام",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل البيانات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المدخلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "update",
          name: "تعديل صفقة",
          description: "تحديث بيانات صفقة موجودة",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل التعديلات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات المعدلة في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المعدلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "delete",
          name: "حذف صفقة",
          description: "حذف صفقة من النظام",
          validations: [
            { id: "database", name: "حذف من قاعدة البيانات", description: "التأكد من حذف البيانات من قاعدة البيانات" },
            { id: "display", name: "تحديث الواجهة", description: "التأكد من تحديث واجهة المستخدم بعد الحذف" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        }
      ]
    },
    {
      id: "companies",
      name: "الشركات",
      description: "اختبار وظائف إدارة الشركات",
      actions: [
        {
          id: "create",
          name: "إنشاء شركة",
          description: "إنشاء شركة جديدة في النظام",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل البيانات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المدخلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "update",
          name: "تعديل شركة",
          description: "تحديث بيانات شركة موجودة",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل التعديلات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات المعدلة في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المعدلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "delete",
          name: "حذف شركة",
          description: "حذف شركة من النظام",
          validations: [
            { id: "database", name: "حذف من قاعدة البيانات", description: "التأكد من حذف البيانات من قاعدة البيانات" },
            { id: "display", name: "تحديث الواجهة", description: "التأكد من تحديث واجهة المستخدم بعد الحذف" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        }
      ]
    },
    {
      id: "tickets",
      name: "التذاكر",
      description: "اختبار وظائف إدارة التذاكر",
      actions: [
        {
          id: "create",
          name: "إنشاء تذكرة",
          description: "إنشاء تذكرة جديدة في النظام",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل البيانات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المدخلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "update",
          name: "تعديل تذكرة",
          description: "تحديث بيانات تذكرة موجودة",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل التعديلات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات المعدلة في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المعدلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "delete",
          name: "حذف تذكرة",
          description: "حذف تذكرة من النظام",
          validations: [
            { id: "database", name: "حذف من قاعدة البيانات", description: "التأكد من حذف البيانات من قاعدة البيانات" },
            { id: "display", name: "تحديث الواجهة", description: "التأكد من تحديث واجهة المستخدم بعد الحذف" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        }
      ]
    },
    {
      id: "permissions",
      name: "الصلاحيات",
      description: "اختبار وظائف إدارة الصلاحيات",
      actions: [
        {
          id: "create",
          name: "إنشاء دور",
          description: "إنشاء دور جديد في النظام",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل البيانات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المدخلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "update",
          name: "تعديل دور",
          description: "تحديث بيانات دور موجود",
          validations: [
            { id: "database", name: "تسجيل في قاعدة البيانات", description: "التأكد من تسجيل التعديلات في قاعدة البيانات" },
            { id: "display", name: "ظهور في الواجهة", description: "التأكد من ظهور البيانات المعدلة في واجهة المستخدم" },
            { id: "validation", name: "التحقق من البيانات", description: "التأكد من صحة البيانات المعدلة" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        },
        {
          id: "delete",
          name: "حذف دور",
          description: "حذف دور من النظام",
          validations: [
            { id: "database", name: "حذف من قاعدة البيانات", description: "التأكد من حذف البيانات من قاعدة البيانات" },
            { id: "display", name: "تحديث الواجهة", description: "التأكد من تحديث واجهة المستخدم بعد الحذف" },
            { id: "notification", name: "الإشعارات", description: "التأكد من إرسال الإشعارات المناسبة" },
            { id: "performance", name: "الأداء", description: "قياس زمن الاستجابة وأداء العملية" },
            { id: "security", name: "الأمان", description: "التحقق من تطبيق قواعد الأمان" }
          ]
        }
      ]
    }
  ];

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
   * تصدير نتائج الاختبار كملف PDF (سيتم تنفيذه لاحقاً)
   */
  const exportAsPdf = () => {
    toast.info("جاري تطوير هذه الميزة...");
  };

  /**
   * الحصول على تقرير شامل للأخطاء واقتراحات التصحيح
   */
  const generateErrorReport = () => {
    if (!testReport || !testReport.results) return null;
    
    // جمع الأخطاء
    const errors = testReport.results.filter(result => !result.success);
    
    if (errors.length === 0) {
      return (
        <div className="p-4 bg-green-50 text-green-700 rounded-md">
          <p className="font-bold">لم يتم العثور على أخطاء!</p>
          <p>تم اجتياز جميع الاختبارات بنجاح.</p>
        </div>
      );
    }
    
    // تصنيف الأخطاء حسب المكونات
    const errorsByComponent: Record<string, TestResult[]> = {};
    errors.forEach(error => {
      if (!errorsByComponent[error.component]) {
        errorsByComponent[error.component] = [];
      }
      errorsByComponent[error.component].push(error);
    });
    
    return (
      <div className="space-y-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p className="font-bold">ملخص الأخطاء</p>
          <p>تم العثور على {errors.length} خطأ في الاختبار.</p>
        </div>
        
        {Object.entries(errorsByComponent).map(([component, componentErrors]) => (
          <div key={component} className="border rounded-md p-4">
            <h3 className="font-bold text-lg mb-2">أخطاء في {component}</h3>
            <ul className="list-disc list-inside space-y-2">
              {componentErrors.map((error, index) => (
                <li key={index} className="text-red-600">
                  <span className="font-semibold">{error.name}:</span> {error.details}
                  {error.error && (
                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      {typeof error.error === 'object' ? JSON.stringify(error.error, null, 2) : error.error}
                    </pre>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
              <p className="font-bold">اقتراحات للتصحيح:</p>
              <ul className="list-decimal list-inside">
                {component === "Database" && (
                  <>
                    <li>تحقق من اتصال قاعدة البيانات والإعدادات.</li>
                    <li>تأكد من وجود الجداول المطلوبة وصحة بنيتها.</li>
                    <li>راجع صلاحيات المستخدم للوصول إلى قاعدة البيانات.</li>
                  </>
                )}
                {component === "Leads" && (
                  <>
                    <li>تأكد من تعبئة جميع الحقول المطلوبة في نموذج إنشاء العميل المحتمل.</li>
                    <li>تحقق من صحة تنسيق البيانات المدخلة (البريد الإلكتروني، رقم الهاتف، إلخ).</li>
                    <li>راجع العلاقات بين الجداول في قاعدة البيانات.</li>
                  </>
                )}
                {component === "Deals" && (
                  <>
                    <li>تأكد من ربط الصفقة بعميل محتمل صحيح.</li>
                    <li>تحقق من إدخال قيمة الصفقة بالتنسيق الصحيح.</li>
                    <li>راجع تواريخ الصفقة للتأكد من صحتها.</li>
                  </>
                )}
                {component === "Companies" && (
                  <>
                    <li>تأكد من إدخال اسم الشركة بشكل صحيح.</li>
                    <li>تحقق من صحة بيانات الاتصال (البريد الإلكتروني، الهاتف، العنوان).</li>
                    <li>راجع إعدادات الصناعة ونوع الشركة.</li>
                  </>
                )}
                {component === "Tickets" && (
                  <>
                    <li>تأكد من إدخال عنوان التذكرة بشكل صحيح.</li>
                    <li>تحقق من اختيار الأولوية والتصنيف المناسب.</li>
                    <li>راجع إسناد التذكرة إلى المستخدم المناسب.</li>
                  </>
                )}
                {component === "Permissions" && (
                  <>
                    <li>تأكد من تعريف الأدوار والصلاحيات بشكل صحيح.</li>
                    <li>تحقق من إسناد الصلاحيات للمستخدمين بشكل صحيح.</li>
                    <li>راجع قواعد الوصول وسياسات الأمان.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    );
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

  /**
   * التعامل مع تغيير اختيارات الاختبار
   */
  const handleSelectionChange = (selected: SelectedTests) => {
    setSelectedTests(selected);
  };

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
            
            <Tabs defaultValue="selection">
              <TabsList className="mb-4">
                <TabsTrigger value="selection">اختيار الاختبارات</TabsTrigger>
                {testReport && <TabsTrigger value="results">عرض النتائج</TabsTrigger>}
                {testReport && <TabsTrigger value="report">تقرير الأخطاء</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="selection" className="space-y-6">
                <TestSelectionTable 
                  modules={testModules}
                  onSelectionChange={handleSelectionChange}
                />
                
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
                </div>
              </TabsContent>
              
              {testReport && (
                <TabsContent value="results">
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
                      
                      <div className="mt-6 flex flex-wrap gap-2">
                        <Button variant="outline" onClick={exportResults} className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          تصدير كـ JSON
                        </Button>
                        <Button variant="outline" onClick={exportAsPdf} className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          تصدير كـ PDF
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
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
                </TabsContent>
              )}
              
              {testReport && (
                <TabsContent value="report">
                  <Card>
                    <CardHeader>
                      <CardTitle>تقرير تحليل الأخطاء واقتراحات التصحيح</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {generateErrorReport()}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemTestRunner;
