import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getLeads, createLead, updateLead, deleteLead } from "@/services/leadsService";
import { fetchDeals, createDeal, updateDeal, deleteDeal } from "@/services/dealsService";
import { getCompanies, createCompany, updateCompany, deleteCompany } from "@/services/companiesService";
import { fetchTickets } from "@/services/tickets";
import { logActivity } from "@/services/loggingService";

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
  async runComprehensiveTest(selectedTests: any = null): Promise<TestReport> {
    if (this.isRunning) {
      return { success: false, results: [], message: "الاختبار قيد التنفيذ بالفعل" };
    }

    this.isRunning = true;
    this.testResults = [];

    try {
      // تسجيل بدء الاختبار
      await logActivity("system", "test", "بدء اختبار", "system", "بدء اختبار شامل للنظام");

      // اختبار الاتصال بقاعدة البيانات
      await this.testDatabaseConnection();

      if (!selectedTests || selectedTests.leads?.selected) {
        await this.testLeadsModule(selectedTests?.leads?.actions);
      }

      if (!selectedTests || selectedTests.deals?.selected) {
        await this.testDealsModule(selectedTests?.deals?.actions);
      }

      if (!selectedTests || selectedTests.companies?.selected) {
        await this.testCompaniesModule(selectedTests?.companies?.actions);
      }

      if (!selectedTests || selectedTests.tickets?.selected) {
        await this.testTicketsModule(selectedTests?.tickets?.actions);
      }

      if (!selectedTests || selectedTests.permissions?.selected) {
        await this.testUsersAndPermissionsModule(selectedTests?.permissions?.actions);
      }

      // تسجيل انتهاء الاختبار
      await logActivity("system", "test", "اكتمال اختبار", "system", 
        `اكتمال الاختبار مع ${this.testResults.filter(r => r.success).length} اختبار ناجح و ${this.testResults.filter(r => !r.success).length} اختبار فاشل`);

      return {
        success: !this.testResults.some(result => !result.success),
        results: this.testResults,
        message: "تم إكمال الاختبار الشامل للنظام"
      };
    } catch (error) {
      console.error("خطأ أثناء تنفيذ الاختبار:", error);
      
      // تسجيل فشل الاختبار
      await logActivity("system", "test", "فشل اختبار", "system", 
        `فشل الاختبار بسبب: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
      
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
      
      // استخدم جدول activity_logs لأنه موجود بالفعل بدلاً من profiles
      const { data, error } = await supabase
        .from('activity_logs')
        .select('count')
        .limit(1)
        .maybeSingle();
      
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      if (error) {
        this.logTestResult({
          name: "ا��تبار الاتصال بقاعدة البيانات",
          success: false,
          details: `فشل الاتصال: ${error.message}`,
          component: "Database",
          responseTimeMs: responseTime
        });
        console.error("خطأ في اختبار الاتصال بقاعدة البيانات:", error);
        return;
      }

      this.logTestResult({
        name: "اختبار الاتصال بقاعدة البيانات",
        success: true,
        details: "تم الاتصال بقاعدة البيانات بنجاح",
        component: "Database",
        responseTimeMs: responseTime
      });
    } catch (error) {
      console.error("خطأ غير متوقع في اختبار الاتصال بقاعدة البيانات:", error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      
      this.logTestResult({
        name: "اختبار الاتصال بقاعدة البيانات",
        success: false,
        details: `خطأ غير متوقع: ${errorMessage}`,
        component: "Database",
        responseTimeMs: 0,
        error
      });
    }
  }

  /**
   * اختبار وحدة إدارة العملاء المحتملين (الليدز)
   */
  private async testLeadsModule(actionFilters: any = null): Promise<void> {
    try {
      // اختبار جلب قائمة العملاء المحتملين
      if (!actionFilters || actionFilters.read?.selected) {
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
      }

      // إنشاء عميل محتمل جديد للاختبار
      if (!actionFilters || actionFilters.create?.selected) {
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
        if (!actionFilters || actionFilters.update?.selected) {
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
        }

        // حذف العميل المحتمل بعد الاختبار
        if (!actionFilters || actionFilters.delete?.selected) {
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
        }
      }

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
  private async testDealsModule(actionFilters: any = null): Promise<void> {
    try {
      // اختبار جلب قائمة الصفقات
      if (!actionFilters || actionFilters.read?.selected) {
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
      }

      // إنشاء صفقة جديدة للاختبار
      if (!actionFilters || actionFilters.create?.selected) {
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
        if (!actionFilters || actionFilters.update?.selected) {
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
        }

        // حذف الصفقة بعد الاختبار
        if (!actionFilters || actionFilters.delete?.selected) {
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
        }
      }

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
  private async testCompaniesModule(actionFilters: any = null): Promise<void> {
    try {
      // اختبار جلب قائمة الشركات
      if (!actionFilters || actionFilters.read?.selected) {
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
      }

      // إنشاء شركة جديدة للاختبار
      if (!actionFilters || actionFilters.create?.selected) {
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
        if (!actionFilters || actionFilters.update?.selected) {
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
        }

        // حذف الشركة بعد الاختبار
        if (!actionFilters || actionFilters.delete?.selected) {
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
        }
      }

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
  private async testTicketsModule(actionFilters: any = null): Promise<void> {
    try {
      // اختبار جلب قائمة التذاكر
      if (!actionFilters || actionFilters.read?.selected) {
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
      }

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
  private async testUsersAndPermissionsModule(actionFilters: any = null): Promise<void> {
    try {
      // اختبار قراءة الصلاحيات الحالية
      if (!actionFilters || actionFilters.read?.selected) {
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
      }

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
    
    // تسجيل نتيجة الاختبار في جدول activity_logs بدلاً من system_test_results
    this.saveTestResultToActivityLogs(result).catch(err => {
      console.error("فشل في تسجيل نتيجة الاختبار:", err);
    });
  }

  /**
   * حفظ نتيجة الاختبار في جدول activity_logs
   */
  private async saveTestResultToActivityLogs(result: TestResult): Promise<void> {
    try {
      // استخدام جدول activity_logs الموجود بالفعل
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          entity_type: "system_test",
          entity_id: result.component,
          action: result.name,
          user_id: "system",
          details: JSON.stringify({
            success: result.success,
            details: result.details,
            responseTimeMs: result.responseTimeMs,
            error: result.error ? JSON.stringify(result.error) : null
          })
        });

      if (error) {
        console.error("فشل في حفظ نتيجة الاختبار:", error);
      }
    } catch (err) {
      console.error("خطأ أثناء محاولة حفظ نتيجة الاختبار:", err);
    }
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

  /**
   * توليد تقرير شامل للأخطاء مع توصيات للتصحيح
   */
  generateErrorSummaryPrompt(): string {
    const errors = this.testResults.filter(r => !r.success);
    
    if (errors.length === 0) {
      return "لم يتم العثور على أخطاء في الاختبار. جميع الاختبارات تمت بنجاح!";
    }
    
    // تجميع الأخطاء حسب المكونات
    const errorsByComponent: Record<string, TestResult[]> = {};
    
    errors.forEach(error => {
      if (!errorsByComponent[error.component]) {
        errorsByComponent[error.component] = [];
      }
      errorsByComponent[error.component].push(error);
    });
    
    // بناء البرومبت
    let prompt = `# تقرير أخطاء اختبار النظام\n\n`;
    prompt += `تم اكتشاف ${errors.length} خطأ خلال اختبار النظام. إليك تحليلاً للأخطاء واقتراحات للإصلاح:\n\n`;
    
    Object.entries(errorsByComponent).forEach(([component, componentErrors]) => {
      prompt += `## أخطاء في وحدة ${component}\n\n`;
      
      componentErrors.forEach((error, index) => {
        prompt += `### ${index + 1}. ${error.name}\n`;
        prompt += `- **الخطأ:** ${error.details}\n`;
        prompt += `- **زمن الاستجابة:** ${error.responseTimeMs.toFixed(2)}ms\n`;
        
        // إضافة اقتراحات للإصلاح حسب نوع المكون والخطأ
        prompt += `- **اق��راحات للإصلاح:**\n`;
        
        if (component === "Database") {
          prompt += `  - تحقق من اتصال قاعدة البيانات والإعدادات.\n`;
          prompt += `  - تأكد من وجود الجداول المطلوبة وصحة بنيتها.\n`;
          prompt += `  - راجع صلاحيات المستخدم للوصول إلى قاعدة البيانات.\n`;
        } 
        else if (component === "Leads" || component === "Deals" || component === "Companies" || component === "Tickets") {
          if (error.name.includes("إنشاء")) {
            prompt += `  - تحقق من إرسال جميع الحقول المطلوبة في نموذج الإنشاء.\n`;
            prompt += `  - تأكد من صحة تنسيق البيانات المرسلة.\n`;
            prompt += `  - راجع سياسات RLS في قاعدة البيانات للتأكد من أن المستخدم لديه صلاحية الإنشاء.\n`;
          } 
          else if (error.name.includes("تحديث")) {
            prompt += `  - تأكد من وجود المعرف (ID) الصحيح للعنصر المراد تحديثه.\n`;
            prompt += `  - تحقق من سياسات RLS للتأكد من أن المستخدم لديه صلاحية التحديث.\n`;
            prompt += `  - راجع البيانات المرسلة للتحديث للتأكد من صحة تنسيقها.\n`;
          } 
          else if (error.name.includes("حذف")) {
            prompt += `  - تأكد من وجود المعرف (ID) الصحيح للعنصر المراد حذفه.\n`;
            prompt += `  - تحقق من سياسات RLS للتأكد من أن المستخدم لديه صلاحية الحذف.\n`;
            prompt += `  - راجع وجود علاقات مرتبطة بالعنصر قد تمنع حذفه.\n`;
          }
          else {
            prompt += `  - تحقق من صحة الباراميترات المستخدمة في الاستعلام.\n`;
            prompt += `  - تأكد من توفر البيانات المطلوبة في قاعدة البيانات.\n`;
            prompt += `  - راجع الاتصال بقاعدة البيانات والصلاحيات.\n`;
          }
        } 
        else if (component === "Permissions") {
          prompt += `  - تأكد من تعريف الأدوار والصلاحيات بشكل صحيح.\n`;
          prompt += `  - تحقق من إسناد الصلاحيات للمستخدمين بشكل صحيح.\n`;
          prompt += `  - راجع قواعد الوصول وسياسات الأمان.\n`;
        }
        
        prompt += `\n`;
      });
      
      prompt += `\n`;
    });
    
    // إضافة خطوات عامة للتصحيح
    prompt += `## خطوات عامة للتصحيح\n\n`;
    prompt += `1. راجع سجلات الخطأ (logs) للحصول على تفاصيل أكثر عن الأخطاء.\n`;
    prompt += `2. تحقق من صلاحيات المستخدم واتصال قاعدة البيانات.\n`;
    prompt += `3. قم بتنفيذ الاختبارات الفردية للمكونات التي بها مشاكل.\n`;
    prompt += `4. بعد الإصلاح، أعد تشغيل الاختبار الشامل للتأكد من حل المشاكل.\n`;
    
    return prompt;
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

/**
 * أنواع الاختبارات حسب المكونات والإجراءات
 */
export const TestTypes = {
  components: ["Leads", "Deals", "Companies", "Tickets", "Permissions", "Users"],
  actions: ["Create", "Read", "Update", "Delete"],
  validations: ["DatabaseSave", "UIDisplay", "Validation", "Performance", "Security"]
};
