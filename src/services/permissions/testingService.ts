
import { supabase } from "@/integrations/supabase/client";
import { TestResult } from "@/types/leads";

export class TestService {
  async runBasicTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    const startTime = performance.now();
    
    // Test database connection
    try {
      const { data, error } = await supabase.from('leads').select('count').limit(1);
      const endTime = performance.now();
      
      if (error) {
        results.push({
          id: 'database-connection',
          name: 'اختبار الاتصال بقاعدة البيانات',
          success: false,
          details: `فشل الاتصال: ${error.message}`,
          component: 'Database',
          responseTimeMs: endTime - startTime
        });
      } else {
        results.push({
          id: 'database-connection',
          name: 'اختبار الاتصال بقاعدة البيانات',
          success: true,
          details: 'تم الاتصال بقاعدة البيانات بنجاح',
          component: 'Database',
          responseTimeMs: endTime - startTime
        });
      }
    } catch (error) {
      results.push({
        id: 'database-connection',
        name: 'اختبار الاتصال بقاعدة البيانات',
        success: false,
        details: `خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: 'Database',
        responseTimeMs: performance.now() - startTime
      });
    }
    
    // Test authentication
    try {
      const authStartTime = performance.now();
      const { data } = await supabase.auth.getSession();
      const authEndTime = performance.now();
      
      results.push({
        id: 'auth-check',
        name: 'اختبار المصادقة',
        success: true,
        details: data.session ? 'المستخدم مسجل الدخول' : 'المستخدم غير مسجل الدخول',
        component: 'Authentication',
        responseTimeMs: authEndTime - authStartTime
      });
    } catch (error) {
      results.push({
        id: 'auth-check',
        name: 'اختبار المصادقة',
        success: false,
        details: `خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: 'Authentication',
        responseTimeMs: 0
      });
    }
    
    // Add more basic tests as needed
    
    return results;
  }
  
  async runPermissionTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test read permissions
    try {
      const startTime = performance.now();
      const { data, error } = await supabase.from('leads').select('*').limit(1);
      const endTime = performance.now();
      
      if (error) {
        results.push({
          id: 'read-permission',
          name: 'صلاحية القراءة',
          success: false,
          details: `فشل في قراءة البيانات: ${error.message}`,
          component: 'Permissions',
          responseTimeMs: endTime - startTime
        });
      } else {
        results.push({
          id: 'read-permission',
          name: 'صلاحية القراءة',
          success: true,
          details: 'تم التأكد من صلاحية القراءة بنجاح',
          component: 'Permissions',
          responseTimeMs: endTime - startTime
        });
      }
    } catch (error) {
      results.push({
        id: 'read-permission',
        name: 'صلاحية القراءة',
        success: false,
        details: `خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: 'Permissions',
        responseTimeMs: 0
      });
    }
    
    // Add more permission tests as needed
    
    return results;
  }
  
  async runIntegrationTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test leads and activities integration
    try {
      const startTime = performance.now();
      const { data: leads, error: leadsError } = await supabase.from('leads').select('id').limit(1);
      
      if (leadsError || !leads || leads.length === 0) {
        results.push({
          id: 'leads-activities-integration',
          name: 'تكامل العملاء المحتملين والأنشطة',
          success: false,
          details: leadsError ? `فشل في الوصول إلى العملاء: ${leadsError.message}` : 'لا توجد بيانات للاختبار',
          component: 'Integration',
          responseTimeMs: performance.now() - startTime
        });
      } else {
        const leadId = leads[0].id;
        const { error: activitiesError } = await supabase.from('lead_activities')
          .select('count')
          .eq('lead_id', leadId)
          .limit(1);
        
        const endTime = performance.now();
        
        results.push({
          id: 'leads-activities-integration',
          name: 'تكامل العملاء المحتملين والأنشطة',
          success: !activitiesError,
          details: !activitiesError ? 'تم اختبار التكامل بين العملاء والأنشطة بنجاح' : `خطأ: ${activitiesError.message}`,
          component: 'Integration',
          responseTimeMs: endTime - startTime
        });
      }
    } catch (error) {
      results.push({
        id: 'leads-activities-integration',
        name: 'تكامل العملاء المحتملين والأنشطة',
        success: false,
        details: `خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: 'Integration',
        responseTimeMs: 0
      });
    }
    
    return results;
  }
  
  async runPerformanceTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test leads query performance
    try {
      const startTime = performance.now();
      const { data, error } = await supabase.from('leads').select('*').limit(10);
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      results.push({
        id: 'leads-query-performance',
        name: 'أداء استعلام العملاء المحتملين',
        success: !error && queryTime < 2000, // Less than 2 seconds is considered good
        details: !error 
          ? `تم استعلام ${data?.length || 0} سجلات في ${queryTime.toFixed(2)} مللي ثانية`
          : `فشل الاستعلام: ${error.message}`,
        component: 'Performance',
        responseTimeMs: queryTime
      });
    } catch (error) {
      results.push({
        id: 'leads-query-performance',
        name: 'أداء استعلام العملاء المحتملين',
        success: false,
        details: `خطأ: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
        component: 'Performance',
        responseTimeMs: 0
      });
    }
    
    return results;
  }
}
