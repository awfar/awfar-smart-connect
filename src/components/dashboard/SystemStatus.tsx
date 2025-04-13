
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, AlertCircle, XCircle, Info, ServerCrash, Activity
} from 'lucide-react';
import { checkSystemHealth, SystemHealth } from '@/services/systemService';
import { checkModulesIntegration } from '@/services/integrationService';

const SystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState<{
    status: 'success' | 'warning' | 'error';
    message: string;
    details?: Record<string, any>;
  } | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsLoading(true);
        
        // Check system health
        const health = await checkSystemHealth();
        setSystemStatus(health);
        
        // Check integration status
        const integration = await checkModulesIntegration();
        setIntegrationStatus(integration);
      } catch (error) {
        console.error("Error checking system status:", error);
        setSystemStatus({
          status: 'error',
          message: 'فشل في الاتصال بالنظام'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkStatus();
    
    // Check status periodically
    const interval = setInterval(checkStatus, 60000); // every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusIcon = () => {
    if (isLoading) return <Activity className="h-4 w-4 animate-pulse" />;
    
    if (!systemStatus) return <Info className="h-4 w-4" />;
    
    switch (systemStatus.status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  
  const getStatusColor = () => {
    if (isLoading) return "bg-slate-100 text-slate-800";
    
    if (!systemStatus) return "bg-slate-100 text-slate-800";
    
    switch (systemStatus.status) {
      case 'healthy':
        return "bg-green-100 text-green-800";
      case 'warning':
        return "bg-amber-100 text-amber-800";
      case 'error':
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };
  
  const getStatusMessage = () => {
    if (isLoading) return "جاري التحقق...";
    
    if (!systemStatus) return "غير معروف";
    
    return systemStatus.message;
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Badge 
            variant="outline" 
            className={`flex gap-1.5 hover:${getStatusColor()} ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span className="text-xs font-medium">حالة النظام</span>
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h4 className="text-sm font-medium mb-1">حالة النظام</h4>
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm">{getStatusMessage()}</span>
            </div>
          </div>
          
          {integrationStatus && (
            <div className="border-b pb-2">
              <h4 className="text-sm font-medium mb-1">الوحدات</h4>
              <div className="flex items-center gap-2">
                {integrationStatus.status === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : integrationStatus.status === 'warning' ? (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">{integrationStatus.message}</span>
              </div>
              
              {integrationStatus.details && integrationStatus.details.inactiveModules && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {integrationStatus.details.inactiveModules.map((module: string, index: number) => (
                    <div key={index}>{module}</div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-1">آخر تحديث</h4>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleTimeString('ar-SA')}
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SystemStatus;
