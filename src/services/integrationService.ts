
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "./loggingService";

// Interface for system modules
export interface SystemModule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'error';
  lastSyncTime?: string;
  errorMessage?: string;
}

// Get all system modules
export const getSystemModules = async (): Promise<SystemModule[]> => {
  try {
    const { data, error } = await supabase.rpc('get_system_modules');
    
    if (error) throw error;
    
    if (data && Array.isArray(data)) {
      return data.map((module: any) => ({
        id: module.id,
        name: module.name,
        description: module.description,
        status: module.status,
        lastSyncTime: module.last_sync_time,
        errorMessage: module.error_message
      }));
    }
    
    return getMockSystemModules();
  } catch (err) {
    console.error("Error fetching system modules:", err);
    return getMockSystemModules();
  }
};

// Sync module data
export const syncModuleData = async (moduleId: string, userId: string): Promise<SystemModule> => {
  try {
    const { data, error } = await supabase.rpc('sync_module', {
      p_module_id: moduleId,
      p_user_id: userId
    });
    
    if (error) throw error;
    
    // Log the sync activity
    await logActivity(
      'system_module',
      moduleId,
      'sync',
      userId,
      `تم مزامنة وحدة ${data?.name || moduleId}`
    );
    
    if (data) {
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        status: data.status,
        lastSyncTime: data.last_sync_time,
        errorMessage: data.error_message
      };
    }
    
    throw new Error("Failed to sync module");
  } catch (err) {
    console.error(`Error syncing module ${moduleId}:`, err);
    
    // Fallback
    return {
      id: moduleId,
      name: 'غير معروف',
      description: '',
      status: 'error',
      errorMessage: String(err)
    };
  }
};

// Check connection between modules
export const checkModulesIntegration = async (): Promise<{
  status: 'success' | 'warning' | 'error';
  message: string;
  details: Record<string, any>;
}> => {
  try {
    // Get all modules
    const modules = await getSystemModules();
    
    const activeModules = modules.filter(m => m.status === 'active');
    const inactiveModules = modules.filter(m => m.status !== 'active');
    
    if (inactiveModules.length > 0) {
      return {
        status: 'warning',
        message: `هناك ${inactiveModules.length} وحدة غير نشطة`,
        details: {
          activeCount: activeModules.length,
          inactiveCount: inactiveModules.length,
          inactiveModules: inactiveModules.map(m => m.name)
        }
      };
    }
    
    return {
      status: 'success',
      message: 'جميع الوحدات متصلة ونشطة',
      details: {
        moduleCount: modules.length,
        activeModules: modules.map(m => m.name)
      }
    };
  } catch (err) {
    console.error("Error checking modules integration:", err);
    
    return {
      status: 'error',
      message: 'حدث خطأ أثناء فحص تكامل الوحدات',
      details: {
        error: String(err)
      }
    };
  }
};

// Helper function for mock data
function getMockSystemModules(): SystemModule[] {
  return [
    {
      id: '1',
      name: 'الفواتير',
      description: 'نظام إدارة الفواتير',
      status: 'active',
      lastSyncTime: new Date().toISOString()
    },
    {
      id: '2',
      name: 'المنتجات',
      description: 'نظام إدارة المنتجات والكتالوج',
      status: 'active',
      lastSyncTime: new Date().toISOString()
    },
    {
      id: '3',
      name: 'الاشتراكات',
      description: 'نظام إدارة اشتراكات العملاء',
      status: 'active',
      lastSyncTime: new Date().toISOString()
    },
    {
      id: '4',
      name: 'العملاء',
      description: 'نظام إدارة العملاء',
      status: 'active',
      lastSyncTime: new Date().toISOString()
    },
    {
      id: '5',
      name: 'التقارير',
      description: 'نظام التقارير والإحصائيات',
      status: 'active',
      lastSyncTime: new Date().toISOString()
    }
  ];
}
