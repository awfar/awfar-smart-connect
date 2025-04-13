
import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CatalogTabsProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

const CatalogTabs: React.FC<CatalogTabsProps> = ({
  selectedTab,
  onTabChange,
  children
}) => {
  return (
    <Tabs value={selectedTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid grid-cols-4 w-full max-w-md">
        <TabsTrigger value="products">المنتجات</TabsTrigger>
        <TabsTrigger value="subscriptions">الاشتراكات</TabsTrigger>
        <TabsTrigger value="packages">الباقات</TabsTrigger>
        <TabsTrigger value="categories">التصنيفات</TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="space-y-4">
        {children}
      </TabsContent>

      <TabsContent value="subscriptions">
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium">إدارة الاشتراكات</h3>
          <p className="text-gray-500 mt-2">يمكنك الانتقال إلى <Link to="/subscriptions" className="text-primary underline">صفحة إدارة الاشتراكات</Link> للتعامل مع الاشتراكات</p>
        </div>
      </TabsContent>

      <TabsContent value="packages">
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium">إدارة الباقات</h3>
          <p className="text-gray-500 mt-2">يمكنك الانتقال إلى <Link to="/packages" className="text-primary underline">صفحة إدارة الباقات</Link> للتعامل مع الباقات</p>
        </div>
      </TabsContent>

      <TabsContent value="categories">
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium">قسم إدارة التصنيفات</h3>
          <p className="text-gray-500 mt-2">سيتم تنفيذ إدارة التصنيفات قريباً</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default CatalogTabs;
