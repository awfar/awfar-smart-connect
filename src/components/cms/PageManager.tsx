
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Plus, Edit, Trash2, Copy, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  isPublished: boolean;
  lastUpdated: string;
}

const PageManager = () => {
  const [pages, setPages] = useState<Page[]>([
    {
      id: "home",
      title: "الصفحة الرئيسية",
      slug: "/",
      description: "الصفحة الرئيسية للموقع",
      isPublished: true,
      lastUpdated: "2023-05-15"
    },
    {
      id: "about",
      title: "من نحن",
      slug: "/about",
      description: "معلومات عن الشركة",
      isPublished: true,
      lastUpdated: "2023-04-20"
    },
    {
      id: "services",
      title: "خدماتنا",
      slug: "/services",
      description: "الخدمات التي نقدمها",
      isPublished: true,
      lastUpdated: "2023-06-10"
    },
    {
      id: "contact",
      title: "اتصل بنا",
      slug: "/contact",
      description: "بيانات الاتصال وخريطة الموقع",
      isPublished: false,
      lastUpdated: "2023-03-05"
    }
  ]);
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    description: ""
  });

  const handleCreatePage = () => {
    const pageId = newPage.slug.replace(/^\//, '').replace(/\//g, '-') || 'page-' + Date.now();
    
    setPages([
      ...pages,
      {
        id: pageId,
        title: newPage.title,
        slug: newPage.slug.startsWith('/') ? newPage.slug : `/${newPage.slug}`,
        description: newPage.description,
        isPublished: false,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    ]);
    
    setNewPage({
      title: "",
      slug: "",
      description: ""
    });
    
    setIsCreateDialogOpen(false);
    toast.success("تم إنشاء الصفحة بنجاح");
  };

  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter(page => page.id !== pageId));
    toast.success("تم حذف الصفحة بنجاح");
  };

  const handleDuplicatePage = (page: Page) => {
    const newPageId = `${page.id}-copy-${Date.now()}`;
    const newPageSlug = `${page.slug}-copy`;
    
    setPages([
      ...pages,
      {
        ...page,
        id: newPageId,
        title: `${page.title} (نسخة)`,
        slug: newPageSlug,
        isPublished: false,
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    ]);
    
    toast.success("تم نسخ الصفحة بنجاح");
  };

  const handlePublishToggle = (pageId: string, isPublished: boolean) => {
    setPages(pages.map(page => 
      page.id === pageId 
        ? { ...page, isPublished, lastUpdated: new Date().toISOString().split('T')[0] } 
        : page
    ));
    
    toast.success(`تم ${isPublished ? 'نشر' : 'إلغاء نشر'} الصفحة بنجاح`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">إدارة الصفحات</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>صفحة جديدة</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>إنشاء صفحة جديدة</DialogTitle>
              <DialogDescription>
                أدخل بيانات الصفحة الجديدة. ستظهر كمسودة حتى تقوم بنشرها.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">عنوان الصفحة</Label>
                <Input 
                  id="title" 
                  placeholder="الصفحة الرئيسية"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">رابط الصفحة (Slug)</Label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-gray-500">/</span>
                  <Input 
                    id="slug" 
                    placeholder="home"
                    value={newPage.slug.replace(/^\//, '')}
                    onChange={(e) => setNewPage({ ...newPage, slug: `/${e.target.value}` })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">وصف الصفحة</Label>
                <Input 
                  id="description" 
                  placeholder="وصف مختصر للصفحة"
                  value={newPage.description}
                  onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>إلغاء</Button>
              <Button 
                onClick={handleCreatePage}
                disabled={!newPage.title || !newPage.slug}
              >
                إنشاء الصفحة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-4">
          <TabsTrigger value="all">جميع الصفحات</TabsTrigger>
          <TabsTrigger value="published">المنشورة</TabsTrigger>
          <TabsTrigger value="drafts">المسودات</TabsTrigger>
          <TabsTrigger value="templates">القوالب</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان الصفحة</TableHead>
                    <TableHead>الرابط</TableHead>
                    <TableHead>آخر تحديث</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe size={14} />
                          <span className="text-sm">{page.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>{page.lastUpdated}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={page.isPublished} 
                          onCheckedChange={(checked) => handlePublishToggle(page.id, checked)} 
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost">
                            <Edit size={16} />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Eye size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handleDuplicatePage(page)}
                          >
                            <Copy size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeletePage(page.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="published">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان الصفحة</TableHead>
                    <TableHead>الرابط</TableHead>
                    <TableHead>آخر تحديث</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.filter(page => page.isPublished).map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe size={14} />
                          <span className="text-sm">{page.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>{page.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost">
                            <Edit size={16} />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Eye size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handlePublishToggle(page.id, false)}
                          >
                            <FileText size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drafts">
          {/* Draft pages content - similar to all pages but filtered */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>عنوان الصفحة</TableHead>
                    <TableHead>الرابط</TableHead>
                    <TableHead>آخر تحديث</TableHead>
                    <TableHead>الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.filter(page => !page.isPublished).map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe size={14} />
                          <span className="text-sm">{page.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>{page.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="ghost">
                            <Edit size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => handlePublishToggle(page.id, true)}
                          >
                            <FileText size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:border-primary transition-all">
              <CardHeader>
                <CardTitle>صفحة هبوط</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">صفحة هبوط لمنتج أو خدمة معينة</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-all">
              <CardHeader>
                <CardTitle>صفحة تواصل</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">صفحة بنموذج تواصل ومعلومات اتصال</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-all">
              <CardHeader>
                <CardTitle>صفحة منتج</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">صفحة لعرض منتج مع صور وتفاصيل ومراجعات</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-all">
              <CardHeader>
                <CardTitle>صفحة خدمات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">صفحة لعرض الخدمات المقدمة</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-all">
              <CardHeader>
                <CardTitle>صفحة "من نحن"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">صفحة تعريفية عن الشركة وفريق العمل</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PageManager;
