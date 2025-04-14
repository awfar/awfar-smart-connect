
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getLeads, createLead, updateLead, deleteLead } from "@/services/leadsService";
import { fetchDeals, createDeal, updateDeal, deleteDeal } from "@/services/dealsService";
import { getCompanies, createCompany, updateCompany, deleteCompany } from "@/services/companiesService";
import { fetchTickets } from "@/services/tickets";

/**
 * خدمة اختبار شاملة للنظام
 * تقوم باختبار جميع الوظائف في النظام وإرجاع تقرير بالنتائج
 */
export class SystemTestingService {
  private testResults: TestResult[] = [];
  private isRunning = false;

  /**
   * بدء عملية الاختبار الشاملة
   */
  async runComprehensiveTest(): Promise<TestReport> {
    if (this.isRunning) {
      return { success: false, results: [], message: "الاختبار قيد التنفيذ بالفعل" };
    }

    this.isRunning = true;
    this.testResults = [];
    
    try {
      // اختبار الاتصال بقاعدة البيانات
      await this.testDatabaseConnection();

      // اختبار وحدات النظام المختلفة
      await this.testLeadsModule();
      await this.testDealsModule();
      await this.testCompaniesModule();
      await this.testTicketsModule();
      await this.testUsersAndPermissionsModule();

      return {
        success: !this.testResults.some(result => !result.success),
        results: this.testResults,
        message: "تم إكمال الاختبار الشامل للنظام"
      };
    } catch (error) {
      console.error("خطأ أثناء تنفيذ الاختبار:", error);
      return {
        success: false,
        results: this.testResults,
        message: `فشل الاختبار بسبب خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * اختبار الاتصال بقاعدة البيانات
   */
  private async testDatabaseConnection(): Promise<void> {
    try {
      const startTime = performance.now();
      const { data, error } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true });
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (error) {
        this.logTestResult({
          name: "اختبار الاتصال بقاعدة البيانات",
          success: false,
          details: `فشل الاتصال: ${error.message}`,
          component: "Database",
          responseTimeMs: responseTime
        });
        throw new Error(`فشل الاتصال بقاعدة البيانات: ${error.message}`);
      }

      this.logTestResult({
        name: "اختبار الاتصال بقاعدة البيانات",
        success: true,
        details: "تم الاتصال بقاعدة البيانات بنجاح",
        component: "Database",
        responseTimeMs: responseTime
      });
    } catch (error) {
      this.logTestResult({
        name: "اختبار الاتصال بقاعدة البيانات",
        success: false,
        details: `خطأ غير متوقع: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: "Database",
        responseTimeMs: 0
      });
      throw error;
    }
  }

  /**
   * اختبار وحدة إدارة العملاء المحتملين (الليدز)
   */
  private async testLeadsModule(): Promise<void> {
    try {
      // اختبار جلب قائمة العملاء المحتملين
      const startFetchTime = performance.now();
      const leads = await getLeads();
      const fetchTime = performance.now() - startFetchTime;
      
      this.logTestResult({
        name: "جلب قائمة العملاء المحتملين",
        success: Array.isArray(leads),
        details: `تم جلب ${leads.length} عميل محتمل`,
        component: "Leads",
        responseTimeMs: fetchTime
      });

      // إنشاء عميل محتمل جديد للاختبار
      const testLead = {
        first_name: "عميل",
        last_name: "اختبار",
        email: `test-${Date.now()}@example.com`,
        phone: "+966500000000",
        company: "شركة الاختبار",
        country: "السعودية",
        industry: "تكنولوجيا المعلومات",
        source: "اختبار النظام",
        stage: "جديد",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const startCreateTime = performance.now();
      const createdLead = await createLead(testLead);
      const createTime = performance.now() - startCreateTime;

      if (!createdLead || !createdLead.id) {
        this.logTestResult({
          name: "إنشاء عميل محتمل جديد",
          success: false,
          details: "فشل إنشاء عميل محتمل جديد",
          component: "Leads",
          responseTimeMs: createTime
        });
        return;
      }

      this.logTestResult({
        name: "إنشاء عميل محتمل جديد",
        success: true,
        details: `تم إنشاء عميل محتمل جديد بمعرف: ${createdLead.id}`,
        component: "Leads",
        responseTimeMs: createTime
      });

      // تحديث العميل المحتمل
      const updateData = {
        ...createdLead,
        stage: "مؤهل",
        notes: "تم تحديث بيانات العميل خلال الاختبار"
      };

      const startUpdateTime = performance.now();
      const updatedLead = await updateLead(updateData);
      const updateTime = performance.now() - startUpdateTime;

      this.logTestResult({
        name: "تحديث بيانات عميل محتمل",
        success: updatedLead !== null && updatedLead.stage === "مؤهل",
        details: updatedLead ? "تم تحديث البيانات بنجاح" : "فشل تحديث البيانات",
        component: "Leads",
        responseTimeMs: updateTime
      });

      // حذف العميل المحتمل بعد الاختبار
      const startDeleteTime = performance.now();
      const deleted = await deleteLead(createdLead.id);
      const deleteTime = performance.now() - startDeleteTime;

      this.logTestResult({
        name: "حذف عميل محتمل",
        success: deleted,
        details: deleted ? "تم حذف العميل المحتمل بنجاح" : "فشل حذف العميل المحتمل",
        component: "Leads",
        responseTimeMs: deleteTime
      });

    } catch (error) {
      this.logTestResult({
        name: "اختبار وحدة العملاء المحتملين",
        success: false,
        details: `حدث خطأ أثناء اختبار وحدة العملاء المحتملين: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: "Leads",
        responseTimeMs: 0
      });
    }
  }

  /**
   * اختبار وحدة إدارة الصفقات
   */
  private async testDealsModule(): Promise<void> {
    try {
      // اختبار جلب قائمة الصفقات
      const startFetchTime = performance.now();
      const deals = await fetchDeals();
      const fetchTime = performance.now() - startFetchTime;
      
      this.logTestResult({
        name: "جلب قائمة الصفقات",
        success: Array.isArray(deals),
        details: `تم جلب ${deals.length} صفقة`,
        component: "Deals",
        responseTimeMs: fetchTime
      });

      // إنشاء صفقة جديدة للاختبار
      const testDeal = {
        name: "صفقة اختبار",
        value: 50000,
        stage: "جديدة",
        status: "active",
        description: "صفقة تم إنشاؤها للاختبار",
        expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        // إضافة الحقول المطلوبة المفقودة
        company_id: null,
        contact_id: null,
        owner_id: null
      };

      const startCreateTime = performance.now();
      const createdDeal = await createDeal(testDeal);
      const createTime = performance.now() - startCreateTime;

      if (!createdDeal || !createdDeal.id) {
        this.logTestResult({
          name: "إنشاء صفقة جديدة",
          success: false,
          details: "فشل إنشاء صفقة جديدة",
          component: "Deals",
          responseTimeMs: createTime
        });
        return;
      }

      this.logTestResult({
        name: "إنشاء صفقة جديدة",
        success: true,
        details: `تم إنشاء صفقة جديدة بمعرف: ${createdDeal.id}`,
        component: "Deals",
        responseTimeMs: createTime
      });

      // تحديث الصفقة
      const updateData = {
        ...createdDeal,
        stage: "تفاوض",
        value: 55000
      };

      const startUpdateTime = performance.now();
      const updatedDeal = await updateDeal(updateData);
      const updateTime = performance.now() - startUpdateTime;

      this.logTestResult({
        name: "تحديث بيانات صفقة",
        success: updatedDeal !== null && updatedDeal.stage === "تفاوض",
        details: updatedDeal ? "تم تحديث بيانات الصفقة بنجاح" : "فشل تحديث بيانات الصفقة",
        component: "Deals",
        responseTimeMs: updateTime
      });

      // حذف الصفقة بعد الاختبار
      const startDeleteTime = performance.now();
      const deleted = await deleteDeal(createdDeal.id);
      const deleteTime = performance.now() - startDeleteTime;

      this.logTestResult({
        name: "حذف صفقة",
        success: deleted,
        details: deleted ? "تم حذف الصفقة بنجاح" : "فشل حذف الصفقة",
        component: "Deals",
        responseTimeMs: deleteTime
      });

    } catch (error) {
      this.logTestResult({
        name: "اختبار وحدة الصفقات",
        success: false,
        details: `حدث خطأ أثناء اختبار وحدة الصفقات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: "Deals",
        responseTimeMs: 0
      });
    }
  }

  /**
   * اختبار وحدة إدارة الشركات
   */
  private async testCompaniesModule(): Promise<void> {
    try {
      // اختبار جلب قائمة الشركات
      const startFetchTime = performance.now();
      const companies = await getCompanies();
      const fetchTime = performance.now() - startFetchTime;
      
      this.logTestResult({
        name: "جلب قائمة الشركات",
        success: Array.isArray(companies),
        details: `تم جلب ${companies.length} شركة`,
        component: "Companies",
        responseTimeMs: fetchTime
      });

      // إنشاء شركة جديدة للاختبار
      const testCompany = {
        name: "شركة اختبار",
        industry: "tech",
        type: "customer",
        country: "sa",
        phone: "+966550000000",
        website: "www.test-company.com",
        address: "الرياض، السعودية",
        // إضافة الحقل المطلوب المفقود
        status: "نشط",
        contacts: []
      };

      const startCreateTime = performance.now();
      const createdCompany = await createCompany(testCompany);
      const createTime = performance.now() - startCreateTime;

      if (!createdCompany || !createdCompany.id) {
        this.logTestResult({
          name: "إنشاء شركة جديدة",
          success: false,
          details: "فشل إنشاء شركة جديدة",
          component: "Companies",
          responseTimeMs: createTime
        });
        return;
      }

      this.logTestResult({
        name: "إنشاء شركة جديدة",
        success: true,
        details: `تم إنشاء شركة جديدة بمعرف: ${createdCompany.id}`,
        component: "Companies",
        responseTimeMs: createTime
      });

      // تحديث الشركة
      const updatedCompanyData = {
        ...createdCompany,
        industry: "healthcare",
        address: "جدة، السعودية"
      };

      const startUpdateTime = performance.now();
      const updatedCompany = await updateCompany(updatedCompanyData);
      const updateTime = performance.now() - startUpdateTime;

      this.logTestResult({
        name: "تحديث بيانات شركة",
        success: updatedCompany !== null && updatedCompany.industry === "healthcare",
        details: updatedCompany ? "تم تحديث بيانات الشركة بنجاح" : "فشل تحديث بيانات الشركة",
        component: "Companies",
        responseTimeMs: updateTime
      });

      // حذف الشركة بعد الاختبار
      const startDeleteTime = performance.now();
      const deleted = await deleteCompany(createdCompany.id);
      const deleteTime = performance.now() - startDeleteTime;

      this.logTestResult({
        name: "حذف شركة",
        success: deleted,
        details: deleted ? "تم حذف الشركة بنجاح" : "فشل حذف الشركة",
        component: "Companies",
        responseTimeMs: deleteTime
      });

    } catch (error) {
      this.logTestResult({
        name: "اختبار وحدة الشركات",
        success: false,
        details: `حدث خطأ أثناء اختبار وحدة الشركات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: "Companies",
        responseTimeMs: 0
      });
    }
  }

  /**
   * اختبار وحدة إدارة التذاكر
   */
  private async testTicketsModule(): Promise<void> {
    try {
      // اختبار جلب قائمة التذاكر
      const startFetchTime = performance.now();
      const tickets = await fetchTickets();
      const fetchTime = performance.now() - startFetchTime;

      this.logTestResult({
        name: "جلب قائمة التذاكر",
        success: Array.isArray(tickets),
        details: `تم جلب ${tickets.length} تذكرة`,
        component: "Tickets",
        responseTimeMs: fetchTime
      });

      // اختبار جلب التذاكر مع فلترة
      const startFilteredFetchTime = performance.now();
      const filteredTickets = await fetchTickets('open', 'high');
      const filteredFetchTime = performance.now() - startFilteredFetchTime;

      this.logTestResult({
        name: "جلب قائمة التذاكر مع فلترة",
        success: Array.isArray(filteredTickets),
        details: `تم جلب ${filteredTickets.length} تذكرة بعد الفلترة`,
        component: "Tickets",
        responseTimeMs: filteredFetchTime
      });

    } catch (error) {
      this.logTestResult({
        name: "اختبار وحدة التذاكر",
        success: false,
        details: `حدث خطأ أثناء اختبار وحدة التذاكر: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: "Tickets",
        responseTimeMs: 0
      });
    }
  }

  /**
   * اختبار وحدة إدارة المستخدمين والصلاحيات
   */
  private async testUsersAndPermissionsModule(): Promise<void> {
    try {
      // اختبار قراءة الصلاحيات الحالية
      const startFetchTime = performance.now();
      const { data: permissions, error } = await supabase
        .from('permissions')
        .select('*')
        .limit(10);
      const fetchTime = performance.now() - startFetchTime;

      if (error) {
        this.logTestResult({
          name: "قراءة قائمة الصلاحيات",
          success: false,
          details: `فشل في جلب الصلاحيات: ${error.message}`,
          component: "Permissions",
          responseTimeMs: fetchTime
        });
        return;
      }

      this.logTestResult({
        name: "قراءة قائمة الصلاحيات",
        success: true,
        details: `تم جلب ${permissions?.length || 0} صلاحية`,
        component: "Permissions",
        responseTimeMs: fetchTime
      });

    } catch (error) {
      this.logTestResult({
        name: "اختبار وحدة المستخدمين والصلاحيات",
        success: false,
        details: `حدث خطأ أثناء اختبار وحدة المستخدمين والصلاحيات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: "Permissions",
        responseTimeMs: 0
      });
    }
  }

  /**
   * تسجيل نتيجة اختبار
   */
  private logTestResult(result: TestResult): void {
    this.testResults.push(result);
    console.log(`[TEST] ${result.success ? '✅' : '❌'} ${result.name}: ${result.details} (${result.responseTimeMs.toFixed(2)}ms)`);
  }

  /**
   * الحصول على تقرير الاختبار الكامل
   */
  getTestReport(): TestReport {
    return {
      success: !this.testResults.some(result => !result.success),
      results: this.testResults,
      message: `تم اكتمال اختبار النظام مع ${this.testResults.filter(r => r.success).length} اختبار ناجح و ${this.testResults.filter(r => !r.success).length} اختبار فاشل`
    };
  }
}

export interface TestResult {
  name: string;
  success: boolean;
  details: string;
  component: string;
  responseTimeMs: number;
  error?: any;
}

export interface TestReport {
  success: boolean;
  results: TestResult[];
  message: string;
}
