
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  RefreshCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { checkSystemHealth, getSystemStatistics, checkIntegrations } from '@/services/systemService';

const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState<'healthy' | 'warning' | 'error' | 'loading'>('loading');
  const [message, setMessage] = useState<string>('جاري فحص حالة النظام...');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [integrations, setIntegrations] = useState<{
    database: boolean;
    auth: boolean;
    storage: boolean;
  }>({ database: false, auth: false, storage: false });
  
  const checkStatus = async () => {
    setStatus('loading');
    setMessage('جاري فحص حالة النظام...');
    
    try {
      // Check health
      const health = await checkSystemHealth();
      setStatus(health.status);
      setMessage(health.message);
      
      // Get statistics
      const stats = await getSystemStatistics();
      setDetails(stats);
      
      // Check integrations
      const integrationStatus = await checkIntegrations();
      setIntegrations(integrationStatus);
      
    } catch (err) {
      console.error('Error checking system status:', err);
      setStatus('error');
      setMessage('تعذر فحص حالة النظام');
    }
  };
  
  useEffect(() => {
    checkStatus();
    
    // Set up a refresh interval
    const interval = setInterval(() => {
      checkStatus();
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  const handleRefresh = () => {
    toast.promise(checkStatus(), {
      loading: 'جاري فحص النظام...',
      success: 'تم تحديث حالة النظام',
      error: 'تعذر تحديث حالة النظام'
    });
  };
  
  const statusIcon = {
    healthy: <CheckCircle className="w-4 h-4 text-green-500" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    loading: <RefreshCcw className="w-4 h-4 animate-spin" />
  };
  
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0" onClick={() => setIsDialogOpen(true)}>
                {statusIcon[status]}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{message}</p>
            </TooltipContent>
          </Tooltip>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حالة النظام</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {statusIcon[status]}
                <span>{message}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCcw className="w-4 h-4 mr-2" />
                تحديث
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">التكاملات</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className={`p-2 rounded-md border ${integrations.database ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center">
                    {integrations.database ? 
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2" /> : 
                      <AlertCircle className="w-4 h-4 text-red-500 ml-2" />}
                    <span className="text-sm">قاعدة البيانات</span>
                  </div>
                </div>
                
                <div className={`p-2 rounded-md border ${integrations.auth ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center">
                    {integrations.auth ? 
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2" /> : 
                      <AlertCircle className="w-4 h-4 text-red-500 ml-2" />}
                    <span className="text-sm">المصادقة</span>
                  </div>
                </div>
                
                <div className={`p-2 rounded-md border ${integrations.storage ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center">
                    {integrations.storage ? 
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2" /> : 
                      <AlertCircle className="w-4 h-4 text-red-500 ml-2" />}
                    <span className="text-sm">التخزين</span>
                  </div>
                </div>
              </div>
            </div>
            
            {details && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">إحصائيات النظام</h3>
                <ul className="space-y-1">
                  {details.tableStats.map((stat: any) => (
                    <li key={stat.table} className="flex justify-between text-sm">
                      <span>{stat.table}</span>
                      <span className="font-medium">{stat.count}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground">
                  آخر تحديث: {new Date(details.lastUpdated).toLocaleString('ar-SA')}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SystemStatus;
