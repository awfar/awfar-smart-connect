
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "./ImageUpload";

interface ContentSection {
  id: string;
  title: string;
  description: string;
  content: any;
}

const ContentManager = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<ContentSection[]>([
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
    }
  ]);

  const [currentSection, setCurrentSection] = useState<ContentSection>(sections[0]);

  const handleSave = () => {
    const updatedSections = sections.map((section) => 
      section.id === currentSection.id ? currentSection : section
    );
    
    setSections(updatedSections);
    
    toast({
      title: "Content saved",
      description: `${currentSection.title} has been updated successfully.`,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setCurrentSection({
      ...currentSection,
      content: {
        ...currentSection.content,
        [name]: value
      }
    });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const features = [...currentSection.content.features];
    features[index] = value;
    
    setCurrentSection({
      ...currentSection,
      content: {
        ...currentSection.content,
        features
      }
    });
  };

  const handleImageChange = (url: string) => {
    setCurrentSection({
      ...currentSection,
      content: {
        ...currentSection.content,
        image: url
      }
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Content Management System</h1>
      
      <Tabs defaultValue="hero" onValueChange={(value) => {
        const selectedSection = sections.find(section => section.id === value);
        if (selectedSection) {
          setCurrentSection(selectedSection);
        }
      }}>
        <TabsList className="mb-6">
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id}>
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="heading">Heading</Label>
                    <Input
                      id="heading"
                      name="heading"
                      value={currentSection.content.heading}
                      onChange={handleChange}
                    />
                  </div>
                  
                  {currentSection.content.subheading !== undefined && (
                    <div>
                      <Label htmlFor="subheading">Subheading</Label>
                      <Input
                        id="subheading"
                        name="subheading"
                        value={currentSection.content.subheading}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  
                  {currentSection.content.description !== undefined && (
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={currentSection.content.description}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  
                  {currentSection.content.primaryButtonText !== undefined && (
                    <div>
                      <Label htmlFor="primaryButtonText">Primary Button Text</Label>
                      <Input
                        id="primaryButtonText"
                        name="primaryButtonText"
                        value={currentSection.content.primaryButtonText}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  
                  {currentSection.content.secondaryButtonText !== undefined && (
                    <div>
                      <Label htmlFor="secondaryButtonText">Secondary Button Text</Label>
                      <Input
                        id="secondaryButtonText"
                        name="secondaryButtonText"
                        value={currentSection.content.secondaryButtonText}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  
                  {currentSection.content.buttonText !== undefined && (
                    <div>
                      <Label htmlFor="buttonText">Button Text</Label>
                      <Input
                        id="buttonText"
                        name="buttonText"
                        value={currentSection.content.buttonText}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                  
                  {currentSection.content.features !== undefined && (
                    <div className="space-y-3">
                      <Label>Features</Label>
                      {currentSection.content.features.map((feature: string, index: number) => (
                        <Input
                          key={index}
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {currentSection.content.image !== undefined && (
                  <div>
                    <Label className="block mb-2">Image</Label>
                    <div className="mb-4">
                      <img 
                        src={currentSection.content.image} 
                        alt="Current" 
                        className="w-40 h-auto rounded-md border object-cover"
                      />
                    </div>
                    <ImageUpload onImageUploaded={handleImageChange} />
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                <Button onClick={handleSave} className="w-full">Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ContentManager;
