import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, AlertCircle, PlayCircle, ArrowRight } from 'lucide-react';
import { TestService } from '@/services/permissions/testingService';
import { TestResult } from '@/types/leads';

const SystemTestRunner: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('basic');

  const runTests = async (testType: string) => {
    setIsRunning(true);
    setResults([]);
    
    try {
      const testService = new TestService();
      let testResults: TestResult[] = [];
      
      switch (testType) {
        case 'basic':
          testResults = await testService.runBasicTests();
          break;
        case 'permissions':
          testResults = await testService.runPermissionTests();
          break;
        case 'integration':
          testResults = await testService.runIntegrationTests();
          break;
        case 'performance':
          testResults = await testService.runPerformanceTests();
          break;
        default:
          testResults = await testService.runBasicTests();
      }
      
      setResults(testResults);
    } catch (error) {
      console.error("خطأ في تنفيذ الاختبارات:", error);
      setResults([{
        id: 'error',
        name: 'خطأ في تنفيذ الاختبارات',
        success: false,
        details: error instanceof Error ? error.message : 'خطأ غير معروف',
        component: 'System',
        responseTimeMs: 0
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const getResultIcon = (success: boolean) => {
    return success 
      ? <CheckCircle2 className="h-5 w-5 text-green-500" /> 
      : <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full md:w-fit">
          <TabsTrigger value="basic">اختبارات أساسية</TabsTrigger>
          <TabsTrigger value="permissions">اختبارات الصلاحيات</TabsTrigger>
          <TabsTrigger value="integration">اختبارات التكامل</TabsTrigger>
          <TabsTrigger value="performance">اختبارات الأداء</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <TabsContent value="basic" className="mt-0">
            <p className="mb-4">اختبار الوظائف الأساسية للنظام مثل الاتصال بقاعدة البيانات، المصادقة، والواجهة.</p>
          </TabsContent>
          <TabsContent value="permissions" className="mt-0">
            <p className="mb-4">اختبار صلاحيات المستخدمين وصلاحيات الوصول الى البيانات.</p>
          </TabsContent>
          <TabsContent value="integration" className="mt-0">
            <p className="mb-4">اختبار التكامل بين الوحدات المختلفة مثل العملاء المحتملين والصفقات.</p>
          </TabsContent>
          <TabsContent value="performance" className="mt-0">
            <p className="mb-4">اختبار أداء النظام مثل سرعة التحميل وزمن ا��استجابة.</p>
          </TabsContent>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={() => runTests(activeTab)}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                جاري التنفيذ...
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" />
                تشغيل الاختبارات
              </>
            )}
          </Button>
        </div>
      </Tabs>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">نتائج الاختبارات</h2>
          
          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={result.id || index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getResultIcon(result.success)}
                      <div>
                        <h3 className="font-medium">{result.name}</h3>
                        <div className="text-sm text-muted-foreground">{result.component}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.responseTimeMs.toFixed(2)} ms
                    </div>
                  </div>
                  
                  {result.details && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm max-h-24 overflow-y-auto">
                      {result.success ? (
                        <span>{result.details}</span>
                      ) : (
                        <div className="flex items-start gap-2 text-red-600">
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{result.details}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemTestRunner;
