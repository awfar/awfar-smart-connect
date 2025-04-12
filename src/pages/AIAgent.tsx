
import React, { useState } from 'react';
import { toast } from "sonner";
import { Check, ArrowRight, Bot } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ai-agent/HeroSection";
import FeaturesSection from "@/components/ai-agent/FeaturesSection";
import AdvancedFeatures from "@/components/ai-agent/AdvancedFeatures";
import CallToAction from "@/components/ai-agent/CallToAction";
import AgentIndustryConfig from "@/components/ai-agent/AgentIndustryConfig";
import AgentRoleConfig from "@/components/ai-agent/AgentRoleConfig";
import ChatInterface from "@/components/ai-agent/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the industry and role types
interface Industry {
  id: string;
  name: string;
  description: string;
}

interface AgentRole {
  id: string;
  name: string;
  description: string;
}

// Sample industry data
const industries: Industry[] = [
  { 
    id: "ecommerce", 
    name: "التجارة الإلكترونية", 
    description: "مساعدة العملاء في التسوق، وإجراء عمليات الشراء، واستفسارات المنتجات"
  },
  { 
    id: "realestate", 
    name: "العقارات", 
    description: "مساعدة العملاء في البحث عن العقارات وحجز المعاينات"
  },
  { 
    id: "healthcare", 
    name: "الرعاية الصحية", 
    description: "حجز المواعيد والإجابة على الاستفسارات الطبية العامة"
  },
  { 
    id: "education", 
    name: "التعليم", 
    description: "دعم الطلاب والمدرسين والإجابة على الاستفسارات العامة"
  },
  { 
    id: "hospitality", 
    name: "الضيافة والفنادق", 
    description: "حجز الغرف والاستفسارات وخدمة العملاء"
  },
];

// Sample roles data
const agentRoles: AgentRole[] = [
  { 
    id: "sales", 
    name: "مندوب مبيعات", 
    description: "يساعد العملاء في اتخاذ قرارات الشراء ويقدم عروض وخصومات"
  },
  { 
    id: "support", 
    name: "خدمة العملاء", 
    description: "يقدم الدعم الفني ويحل مشكلات العملاء"
  },
  { 
    id: "advisor", 
    name: "مستشار", 
    description: "يقدم نصائح واستشارات متخصصة في مجال معين"
  },
  { 
    id: "assistant", 
    name: "مساعد شخصي", 
    description: "يساعد في إدارة المهام والمواعيد والتذكيرات"
  },
];

// Sample AI responses based on industry and role
const getInitialMessage = (industry: string, role: string): string => {
  const industryData = industries.find(i => i.id === industry);
  const roleData = agentRoles.find(r => r.id === role);
  
  if (industry === "ecommerce" && role === "sales") {
    return `مرحبًا! أنا مساعدك الافتراضي المتخصص في ${industryData?.name}. بصفتي ${roleData?.name}، يمكنني مساعدتك في العثور على المنتجات المناسبة، وتقديم العروض والخصومات، والإجابة على أسئلتك حول منتجاتنا. كيف يمكنني مساعدتك اليوم؟`;
  } 
  else if (industry === "realestate" && role === "advisor") {
    return `مرحبًا! أنا مستشارك العقاري. يمكنني مساعدتك في البحث عن العقارات المناسبة، وتحديد موعد للمعاينة، وتقديم المشورة بشأن الاستثمار العقاري. ما هي متطلباتك العقارية؟`;
  } 
  else {
    return `مرحبًا! أنا المساعد الافتراضي المتخصص في ${industryData?.name}. بصفتي ${roleData?.name}، يمكنني مساعدتك في الإجابة على استفساراتك وتلبية احتياجاتك. كيف يمكنني خدمتك اليوم؟`;
  }
};

// Mock AI response generator
const generateAIResponse = (message: string, industry: string, role: string): string => {
  if (message.includes("سعر") || message.includes("تكلفة")) {
    return "يمكنني مساعدتك بمعلومات عن الأسعار. لدينا مجموعة متنوعة من الخيارات لتناسب ميزانيتك. هل تبحث عن فئة سعرية معينة؟";
  } else if (message.includes("موعد") || message.includes("حجز")) {
    return "بالطبع يمكنني مساعدتك في حجز موعد. ما هو اليوم والوقت المناسب لك؟ سأتحقق من الجدول المتاح وأؤكد لك.";
  } else if (message.includes("شكرا") || message.includes("شكراً")) {
    return "العفو! سعيد بمساعدتك. هل هناك أي شيء آخر يمكنني مساعدتك به اليوم؟";
  } else if (message.includes("خصم") || message.includes("عرض")) {
    return "نعم، لدينا عدة عروض وخصومات متاحة حاليًا. يمكنني تقديم خصم 10٪ على طلبك الأول عند استخدام الرمز WELCOME10. هل ترغب في الاستفادة من هذا العرض؟";
  } else {
    return "شكرًا على رسالتك. بصفتي مساعدك المتخصص، يمكنني مساعدتك في جميع استفساراتك المتعلقة بمجالنا. هل يمكنك تقديم المزيد من التفاصيل حول ما تبحث عنه تحديدًا؟";
  }
};

const AIAgent = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showDemo, setShowDemo] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const handleStartDemo = () => {
    setShowDemo(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartChat = () => {
    if (!selectedIndustry || !selectedRole) {
      toast.error("يرجى اختيار القطاع ودور الوكيل قبل بدء المحادثة");
      return;
    }
    setChatStarted(true);
  };

  const resetDemo = () => {
    setSelectedIndustry("");
    setSelectedRole("");
    setChatStarted(false);
  };

  const handleSendMessage = async (message: string) => {
    // Simulate API call with delay
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(generateAIResponse(message, selectedIndustry, selectedRole));
      }, 1000);
    });
  };

  const getIndustryName = (id: string) => {
    return industries.find(i => i.id === id)?.name || id;
  };

  const getRoleName = (id: string) => {
    return agentRoles.find(r => r.id === role)?.name || id;
  };

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        {showDemo ? (
          <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto mb-8">
                <h1 className="text-3xl font-bold mb-4">جرّب الوكيل الذكي من أوفر</h1>
                <p className="text-gray-600 mb-6">
                  اختر القطاع ودور الوكيل الذي تريد تجربته وابدأ المحادثة مباشرة
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
                {!chatStarted ? (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">اختر القطاع</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {industries.map((industry) => (
                          <AgentIndustryConfig
                            key={industry.id}
                            industry={industry}
                            selected={selectedIndustry === industry.id}
                            onSelect={setSelectedIndustry}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">اختر دور الوكيل</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {agentRoles.map((role) => (
                          <AgentRoleConfig
                            key={role.id}
                            role={role}
                            selected={selectedRole === role.id}
                            onSelect={setSelectedRole}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-center pt-4">
                      <Button 
                        onClick={handleStartChat}
                        size="lg" 
                        disabled={!selectedIndustry || !selectedRole}
                        className="gap-2"
                      >
                        ابدأ المحادثة <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ChatInterface
                    agentName={getRoleName(selectedRole)}
                    industryName={getIndustryName(selectedIndustry)}
                    initialMessage={getInitialMessage(selectedIndustry, selectedRole)}
                    onSendMessage={handleSendMessage}
                    onBack={resetDemo}
                  />
                )}
              </div>

              <div className="mt-12 text-center">
                <Button 
                  variant="outline"
                  onClick={() => {
                    resetDemo();
                    setShowDemo(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  عرض صفحة الوكيل الذكي
                </Button>
              </div>
            </div>
          </section>
        ) : (
          <>
            <HeroSection onTryDemo={handleStartDemo} />
            <FeaturesSection />
            
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4">جرّب الوكيل الذكي الآن</h2>
                  <p className="text-gray-600 mb-8">
                    اختبر قدرات الوكيل الذكي من أوفر بنفسك - اختر قطاعك ودور الوكيل وابدأ المحادثة
                  </p>
                  <Button 
                    className="gap-2 bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90"
                    size="lg"
                    onClick={handleStartDemo}
                  >
                    <Bot className="h-5 w-5" /> 
                    جرّب الوكيل الذكي الآن
                  </Button>
                </div>
              </div>
            </section>
            
            <AdvancedFeatures />
            <CallToAction />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AIAgent;
