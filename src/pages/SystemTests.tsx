
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import SystemTestRunner from '@/components/tests/SystemTestRunner';

const SystemTests: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">اختبار النظام الشامل</h1>
        <div className="text-muted-foreground">
          <p className="mb-2">
            استخدم هذه الصفحة لإجراء اختبارات شاملة للنظام والتحقق من سلامة الوظائف والتكامل بين الوحدات المختلفة.
          </p>
          <p>
            يمكنك اختيار الوحدات والعمليات التي ترغب في اختبارها والحصول على تقرير مفصل بالنتائج واقتراحات للتصحيح.
          </p>
          <p className="mt-2 text-amber-600">
            ملاحظة: يتم تسجيل نتائج الاختبارات في جدول سجل النشاطات (activity_logs).
          </p>
        </div>
        <SystemTestRunner />
      </div>
    </DashboardLayout>
  );
};

export default SystemTests;
