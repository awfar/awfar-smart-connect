
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentEditor from "./ContentEditor";
import { useContentManager } from "@/hooks/use-content-manager";

const ContentManager = () => {
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
        image: "/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png"
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
        image: "/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png"
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
        image: "/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png"
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
        customSolutionsButtonText: "تواصل مع فريق المبيعات"
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
    handleImageChange
  } = useContentManager(initialSections);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content Management System</h1>
      
      <Tabs defaultValue="hero" onValueChange={selectSection}>
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
              onImageChange={(fieldName, url) => handleImageChange(fieldName, url)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManager;
