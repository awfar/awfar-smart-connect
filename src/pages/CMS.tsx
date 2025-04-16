
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentManager from "@/components/cms/ContentManager";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Settings, Plus, LayoutDashboard } from "lucide-react";

const CMS = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المحتوى</h1>
            <p className="text-muted-foreground mt-1">إنشاء وتحرير محتوى الموقع بشكل سهل ومرن</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              الإعدادات
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              إضافة محتوى جديد
            </Button>
          </div>
        </div>
      
        <Tabs defaultValue="content">
          <TabsList className="mb-6">
            <TabsTrigger value="content" className="flex items-center gap-1">
              <LayoutDashboard className="h-4 w-4" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="website">محتوى الموقع</TabsTrigger>
            <TabsTrigger value="blog">المدونة</TabsTrigger>
            <TabsTrigger value="landing">صفحات الهبوط</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <ContentManager />
          </TabsContent>
          
          <TabsContent value="website">
            <ContentManager />
          </TabsContent>
          
          <TabsContent value="blog">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">إدارة المدونة</h2>
              <p className="text-gray-600">قم بإنشاء وتحرير مقالات المدونة هنا.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="landing">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">صفحات الهبوط</h2>
              <p className="text-gray-600">قم بإنشاء وإدارة صفحات الهبوط المخصصة هنا.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CMS;
