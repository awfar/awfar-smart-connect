
import { supabase } from "@/integrations/supabase/client";

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
}

// Check system health (database connection, etc.)
export const checkSystemHealth = async (): Promise<SystemHealth> => {
  try {
    // Test database connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      return {
        status: 'error',
        message: 'قاعدة البيانات غير متصلة',
        details: { error: error.message }
      };
    }
    
    return {
      status: 'healthy',
      message: 'النظام يعمل بشكل طبيعي'
    };
  } catch (err) {
    console.error("Error checking system health:", err);
    return {
      status: 'error',
      message: 'حدث خطأ أثناء فحص النظام',
      details: { error: String(err) }
    };
  }
};

// Get system statistics
export const getSystemStatistics = async (): Promise<{
  tableStats: { table: string; count: number }[];
  lastUpdated: string;
}> => {
  const tables = [
    'invoices',
    'products',
    'subscriptions',
    'packages',
    'leads',
    'companies',
    'activity_logs'
  ];
  
  const tableStats = [];
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        tableStats.push({
          table,
          count: count || 0
        });
      }
    } catch (err) {
      console.error(`Error getting count for table ${table}:`, err);
      tableStats.push({
        table,
        count: 0
      });
    }
  }
  
  return {
    tableStats,
    lastUpdated: new Date().toISOString()
  };
};

// Integration check
export const checkIntegrations = async (): Promise<{
  database: boolean;
  auth: boolean;
  storage: boolean;
}> => {
  let database = false;
  let auth = false;
  let storage = false;
  
  try {
    // Check database
    const { data: dbData, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    database = !dbError;
    
    // Check auth
    const { data: authData, error: authError } = await supabase.auth.getUser();
    auth = !authError;
    
    // Check storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .getBucket('default');
    
    storage = !storageError;
  } catch (err) {
    console.error("Error checking integrations:", err);
  }
  
  return {
    database,
    auth,
    storage
  };
};
