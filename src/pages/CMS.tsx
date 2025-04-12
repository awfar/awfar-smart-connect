
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentManager from "@/components/cms/ContentManager";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardNav from "@/components/dashboard/DashboardNav";

const CMS = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 rtl">
      <DashboardHeader />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 lg:pt-0">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المحتوى</h1>
            </div>
          
            <Tabs defaultValue="pages">
              <TabsList className="mb-6">
                <TabsTrigger value="pages">محتوى الصفحات</TabsTrigger>
                <TabsTrigger value="media">مكتبة الوسائط</TabsTrigger>
                <TabsTrigger value="settings">الإعدادات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pages">
                <ContentManager />
              </TabsContent>
              
              <TabsContent value="media">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4">مكتبة الوسائط</h2>
                  <p className="text-gray-600">إدارة الصور وملفات الوسائط هنا.</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <img src="/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png" alt="Media" className="rounded-md border object-cover aspect-square" />
                    <img src="/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png" alt="Media" className="rounded-md border object-cover aspect-square" />
                    <img src="/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png" alt="Media" className="rounded-md border object-cover aspect-square" />
                    <img src="/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png" alt="Media" className="rounded-md border object-cover aspect-square" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4">إعدادات الموقع</h2>
                  <p className="text-gray-600">تكوين إعدادات الموقع العامة هنا.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CMS;
