
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layout, 
  Grid3X3, 
  Rows, 
  SplitSquareHorizontal, 
  AlignHorizontalSpaceBetween,
  MessageSquareText,
  Files,
  ImagesIcon,
  Video,
  FileVideo,
  Quote,
  FormInput,
  Table,
  BarChart,
  Users,
  Map,
  Plus,
  Search,
  FileQuestion,
  CalendarDays,
  Layers
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface SectionTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  group: string;
  previewImage?: string;
}

const sectionTemplates: SectionTemplate[] = [
  {
    id: "hero",
    title: "قسم رئيسي (Hero)",
    description: "قسم استعراضي رئيسي مع صورة ونص وزر دعوة للعمل",
    icon: <Layout className="w-5 h-5" />,
    group: "أساسية",
    previewImage: "/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png"
  },
  {
    id: "features",
    title: "ميزات",
    description: "عرض ميزات أو خدمات في شبكة مع أيقونات",
    icon: <Grid3X3 className="w-5 h-5" />,
    group: "أساسية",
    previewImage: "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png"
  },
  {
    id: "textColumns",
    title: "أعمدة نصية",
    description: "نص في أعمدة متعددة",
    icon: <Rows className="w-5 h-5" />,
    group: "نص",
    previewImage: "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png"
  },
  {
    id: "textWithImage",
    title: "نص مع صورة",
    description: "نص مع صورة جانبية",
    icon: <SplitSquareHorizontal className="w-5 h-5" />,
    group: "نص",
    previewImage: "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png"
  },
  {
    id: "cta",
    title: "دعوة للعمل",
    description: "قسم مع نص ودعوة للعمل واضحة",
    icon: <AlignHorizontalSpaceBetween className="w-5 h-5" />,
    group: "أساسية",
    previewImage: "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png"
  },
  {
    id: "testimonials",
    title: "آراء العملاء",
    description: "عرض شهادات وآراء العملاء",
    icon: <MessageSquareText className="w-5 h-5" />,
    group: "محتوى",
    previewImage: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png"
  },
  {
    id: "gallery",
    title: "معرض صور",
    description: "معرض صور في شبكة",
    icon: <ImagesIcon className="w-5 h-5" />,
    group: "وسائط",
    previewImage: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png"
  },
  {
    id: "video",
    title: "فيديو",
    description: "مقطع فيديو مضمن",
    icon: <Video className="w-5 h-5" />,
    group: "وسائط",
    previewImage: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png"
  },
  {
    id: "fileDownloads",
    title: "تنزيل ملفات",
    description: "قسم لتنزيل الملفات",
    icon: <Files className="w-5 h-5" />,
    group: "وسائط",
    previewImage: "/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png"
  },
  {
    id: "videoBackground",
    title: "فيديو خلفية",
    description: "قسم بخلفية فيديو",
    icon: <FileVideo className="w-5 h-5" />,
    group: "وسائط",
    previewImage: "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png"
  },
  {
    id: "quote",
    title: "اقتباس",
    description: "اقتباس مميز بتصميم جذاب",
    icon: <Quote className="w-5 h-5" />,
    group: "نص",
    previewImage: "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png"
  },
  {
    id: "contactForm",
    title: "نموذج اتصال",
    description: "نموذج اتصال للزوار",
    icon: <FormInput className="w-5 h-5" />,
    group: "نماذج",
    previewImage: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png"
  },
  {
    id: "pricingTable",
    title: "جدول أسعار",
    description: "عرض خطط الأسعار في جدول",
    icon: <Table className="w-5 h-5" />,
    group: "محتوى",
    previewImage: "/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png"
  },
  {
    id: "stats",
    title: "إحصائيات",
    description: "عرض إحصائيات وأرقام مهمة",
    icon: <BarChart className="w-5 h-5" />,
    group: "محتوى",
    previewImage: "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png"
  },
  {
    id: "team",
    title: "فريق العمل",
    description: "عرض أعضاء الفريق مع صور ومعلومات",
    icon: <Users className="w-5 h-5" />,
    group: "محتوى",
    previewImage: "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png"
  },
  {
    id: "map",
    title: "خريطة",
    description: "خريطة تفاعلية مع معلومات الموقع",
    icon: <Map className="w-5 h-5" />,
    group: "محتوى",
    previewImage: "/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png"
  },
  {
    id: "faq",
    title: "أسئلة شائعة",
    description: "أسئلة وأجوبة متكررة",
    icon: <FileQuestion className="w-5 h-5" />,
    group: "محتوى",
    previewImage: "/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png"
  },
  {
    id: "events",
    title: "أحداث وفعاليات",
    description: "عرض أحداث وفعاليات قادمة",
    icon: <CalendarDays className="w-5 h-5" />,
    group: "محتوى",
    previewImage: "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png"
  },
  {
    id: "layers",
    title: "طبقات متداخلة",
    description: "تصميم بطبقات متداخلة للعناصر",
    icon: <Layers className="w-5 h-5" />,
    group: "تصميم",
    previewImage: "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png"
  }
];

const SectionManager = () => {
  const [activeGroup, setActiveGroup] = useState("أساسية");
  const [searchQuery, setSearchQuery] = useState("");
  const [customSectionDialogOpen, setCustomSectionDialogOpen] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    description: ""
  });

  const filteredTemplates = searchQuery 
    ? sectionTemplates.filter(
        template => 
          template.title.includes(searchQuery) || 
          template.description.includes(searchQuery)
      )
    : sectionTemplates.filter(template => template.group === activeGroup);

  const handleAddCustomSection = () => {
    toast.success("تم إضافة القسم المخصص بنجاح");
    setCustomSectionDialogOpen(false);
    setNewSection({
      title: "",
      description: ""
    });
  };

  const handleAddSection = (template: SectionTemplate) => {
    toast.success(`تم إضافة قسم ${template.title} بنجاح`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-medium">إضافة مقاطع للصفحات</h2>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن مقطع..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Dialog open={customSectionDialogOpen} onOpenChange={setCustomSectionDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" /> مقطع مخصص
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة مقطع مخصص</DialogTitle>
                <DialogDescription>
                  أنشئ قسمًا مخصصًا من البداية حسب احتياجاتك.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان المقطع</Label>
                  <Input 
                    id="title"
                    placeholder="قسم الخدمات المميزة"
                    value={newSection.title}
                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">وصف المقطع</Label>
                  <Textarea 
                    id="description"
                    placeholder="وصف مختصر للمقطع المخصص"
                    value={newSection.description}
                    onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCustomSectionDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleAddCustomSection}>إضافة المقطع</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {!searchQuery && (
        <Tabs defaultValue="أساسية" className="w-full" onValueChange={setActiveGroup}>
          <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-6 gap-2">
            <TabsTrigger value="أساسية">أساسية</TabsTrigger>
            <TabsTrigger value="نص">نص</TabsTrigger>
            <TabsTrigger value="وسائط">وسائط</TabsTrigger>
            <TabsTrigger value="محتوى">محتوى</TabsTrigger>
            <TabsTrigger value="نماذج">نماذج</TabsTrigger>
            <TabsTrigger value="تصميم">تصميم</TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            {template.previewImage && (
              <div className="h-40 overflow-hidden">
                <img 
                  src={template.previewImage} 
                  alt={template.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className={!template.previewImage ? "pt-6" : "pt-4"}>
              <CardTitle className="flex items-center gap-2">
                {template.icon}
                <span>{template.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleAddSection(template)}
              >
                <Plus className="mr-2 h-4 w-4" /> إضافة المقطع
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectionManager;
