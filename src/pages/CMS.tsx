
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentManager from "@/components/cms/ContentManager";

const CMS = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-6 bg-white border-b">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-awfar-primary">Awfar CMS</h1>
          <p className="text-gray-600">Manage your website content</p>
        </div>
      </div>
      
      <div className="container mx-auto py-8">
        <Tabs defaultValue="pages">
          <TabsList className="mb-6">
            <TabsTrigger value="pages">Page Content</TabsTrigger>
            <TabsTrigger value="media">Media Library</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pages">
            <ContentManager />
          </TabsContent>
          
          <TabsContent value="media">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4">Media Library</h2>
              <p className="text-gray-600">Manage your images and media files here.</p>
              
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
              <h2 className="text-xl font-bold mb-4">Site Settings</h2>
              <p className="text-gray-600">Configure global website settings here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CMS;
