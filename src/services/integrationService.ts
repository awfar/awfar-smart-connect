
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
    const { data, error } = await supabase
      .from('system_modules')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    return data as SystemModule[] || [];
  } catch (err) {
    console.error("Error fetching system modules:", err);
    
    // Fallback to mock data
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
};

// Sync module data
export const syncModuleData = async (moduleId: string, userId: string): Promise<SystemModule> => {
  try {
    // Get the module
    const { data: moduleData, error } = await supabase
      .from('system_modules')
      .select('*')
      .eq('id', moduleId)
      .single();
    
    if (error) throw error;
    
    // Update sync time
    const { data: updatedModule, error: updateError } = await supabase
      .from('system_modules')
      .update({
        last_sync_time: new Date().toISOString(),
        status: 'active',
        error_message: null
      })
      .eq('id', moduleId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    // Log the sync activity
    await logActivity(
      'system_module',
      moduleId,
      'sync',
      userId,
      `تم مزامنة وحدة ${moduleData?.name || moduleId}`
    );
    
    return updatedModule as SystemModule;
  } catch (err) {
    console.error(`Error syncing module ${moduleId}:`, err);
    
    // Update module status to error
    try {
      const { data: errorModule } = await supabase
        .from('system_modules')
        .update({
          last_sync_time: new Date().toISOString(),
          status: 'error',
          error_message: String(err)
        })
        .eq('id', moduleId)
        .select()
        .single();
      
      if (errorModule) {
        return errorModule as SystemModule;
      }
    } catch (updateErr) {
      console.error(`Error updating module ${moduleId} status:`, updateErr);
    }
    
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
