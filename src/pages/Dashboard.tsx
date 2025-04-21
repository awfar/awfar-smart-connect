
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>العملاء المحتملين</CardTitle>
            </CardHeader>
            <CardContent>
              <p>إجمالي العملاء المحتملين: 0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>الشركات</CardTitle>
            </CardHeader>
            <CardContent>
              <p>إجمالي الشركات: 0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>الصفقات</CardTitle>
            </CardHeader>
            <CardContent>
              <p>إجمالي الصفقات: 0</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
