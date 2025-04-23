
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AvailabilitySettings from '@/components/appointments/AvailabilitySettings';
import BookingPage from '@/components/appointments/BookingPage';

const AppointmentSettings: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إعدادات المواعيد</h1>
      </div>

      <Tabs defaultValue="availability" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="availability">أوقات التوافر</TabsTrigger>
          <TabsTrigger value="preview">معاينة صفحة الحجز</TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability">
          <AvailabilitySettings />
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>معاينة صفحة الحجز</CardTitle>
              <CardDescription>
                هكذا سيظهر رابط الحجز الخاص بك للزوار والعملاء
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4">
                <BookingPage userSlug="your-name" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentSettings;
