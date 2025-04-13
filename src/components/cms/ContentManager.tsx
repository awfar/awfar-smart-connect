
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentEditor from "./ContentEditor";
import { useContentManager } from "@/hooks/use-content-manager";
import PageManager from "./PageManager";
import SectionManager from "./SectionManager";
import FormManager from "./FormManager";
import { Button } from "@/components/ui/button";
import MediaLibrary from "./MediaLibrary";

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState("pages");
  
  const initialSections = [
    {
      id: "hero",
      title: "Hero Section",
      description: "The main hero section of the landing page",
      content: {
        heading: "تأخرك في الرد يُفقدك 66% من عملائك المحتملين!",
        subheading: "بطء الاستجابة يؤدي لخسارتك يومياً لأكثر من 10 فرص بيع",
        description: "الموظف الذكي من Awfar Chat Commerce يتعامل معك مع عملائك 24 ساعة بكل اللغات واللهجات!",
        primaryButtonText: "قم بتجربة الموظف الذكي",
        secondaryButtonText: "تعرف على خدماتنا",
        image: "/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png",
        backgroundColor: "#ffffff",
        textColor: "#333333",
        buttonStyle: "rounded"
      }
    },
    {
      id: "aiEmployee",
      title: "AI Employee Section",
      description: "Section describing the AI employee features",
      content: {
        heading: "الموظف الذكي = فريق كامل لخدمة العملاء",
        subheading: "يتعامل منظام Awfar Chat Commerce الذكي مع كل مهام فريق خدمة العملاء",
        features: [
          "يتعامل على مدار 24 ساعـــــة على منصات التواصل مع المحتملين",
          "يعمل على كل منصات التواصل (واتساب | ماسنجر | إنستجرام | تطبيقات الشركات)",
          "يتكامل مع أنظمة CRM الحالية لكم ويمكنه الوصول لقاعدة البيانات"
        ],
        buttonText: "ابني موظفك الذكي المتخصص مجاناً!",
        image: "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png",
        layout: "imageRight",
        backgroundColor: "#f5f5f5",
        textColor: "#333333"
      }
    },
    {
      id: "caseStudy",
      title: "Case Study Section",
      description: "Success story of a customer",
      content: {
        heading: "كيف غيَّر Awfar Chat Commerce تجربة عملاء شركة حمادة؟",
        subheading: "من 10 دقائق إلى 10 ثوان!",
        statistics: [
          { label: "تحسين تجربة العملاء", value: 98 },
          { label: "بدون تأخير", value: 100 },
          { label: "رسائل يومية", value: 1550 }
        ],
        buttonText: "تعرف على المزيد من قصص النجاح",
        image: "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png",
        style: "gradient",
        backgroundColor: "#e6f7ff",
        textColor: "#003366"
      }
    },
    {
      id: "pricingPlans",
      title: "Pricing Plans",
      description: "Pricing plans section of the pricing page",
      content: {
        heading: "خطط أسعار بسيطة وشفافة",
        subheading: "اختر الخطة المناسبة لاحتياجات عملك",
        plansHeading: "باقات أوفر",
        plansSubheading: "اختر الباقة المناسبة لعملك",
        customSolutionsHeading: "تحتاج إلى حل مخصص؟",
        customSolutionsText: "نقدم حلولًا مخصصة للشركات الكبيرة مع متطلبات فريدة. تواصل مع فريق المبيعات لمعرفة كيف يمكننا مساعدتك.",
        customSolutionsButtonText: "تواصل مع فريق المبيعات",
        backgroundColor: "#ffffff",
        textColor: "#333333"
      }
    }
  ];

  const {
    sections,
    currentSection,
    selectSection,
    handleSave,
    handleChange,
    handleArrayChange,
    handleImageChange,
    handleStyleChange
  } = useContentManager(initialSections);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">إدارة المحتوى</h1>
      
      <Tabs defaultValue="content" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="content">محتوى الصفحة الرئيسية</TabsTrigger>
          <TabsTrigger value="pages">إدارة الصفحات</TabsTrigger>
          <TabsTrigger value="sections">إضافة مقاطع</TabsTrigger>
          <TabsTrigger value="forms">النماذج</TabsTrigger>
          <TabsTrigger value="media">مكتبة الوسائط</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">تعديل محتوى الأقسام</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">معاينة</Button>
              <Button variant="outline" size="sm">تفعيل/إيقاف</Button>
            </div>
          </div>

          <Tabs defaultValue={sections[0]?.id} onValueChange={selectSection}>
            <TabsList className="mb-6">
              {sections.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {sections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <ContentEditor
                  section={currentSection}
                  onSave={handleSave}
                  onChange={handleChange}
                  onArrayChange={handleArrayChange}
                  onImageChange={handleImageChange}
                  onStyleChange={handleStyleChange}
                />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
        
        <TabsContent value="pages">
          <PageManager />
        </TabsContent>
        
        <TabsContent value="sections">
          <SectionManager />
        </TabsContent>
        
        <TabsContent value="forms">
          <FormManager />
        </TabsContent>
        
        <TabsContent value="media">
          <MediaLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentManager;
