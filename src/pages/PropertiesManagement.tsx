
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PropertyList from '@/components/properties/PropertyList';
import PropertyForm from '@/components/properties/PropertyForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const PropertiesManagement: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة الخصائص</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة خاصية
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogTitle>إضافة خاصية جديدة</DialogTitle>
              <PropertyForm />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>الخصائص</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PropertiesManagement;
