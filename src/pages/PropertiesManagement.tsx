
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const PropertiesManagement: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-6 rtl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">إدارة الخصائص</h1>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة خاصية جديدة
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-dashed border-2 flex flex-col justify-center items-center p-6 h-full">
            <Plus className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2 text-center">إضافة خاصية جديدة</h3>
            <p className="text-gray-500 text-center mb-4">أنشئ خاصية جديدة للمنتجات والخدمات</p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              خاصية جديدة
            </Button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PropertiesManagement;
