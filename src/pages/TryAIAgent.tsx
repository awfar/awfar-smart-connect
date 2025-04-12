
import React, { useState } from 'react';
import { toast } from "sonner";
import { Check, Send, ArrowRight, Bot, Buildings, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define the industry and role types
interface Industry {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

interface AgentRole {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
}

// Sample industry data
const industries: Industry[] = [
  { 
    id: "ecommerce", 
    name: "التجارة الإلكترونية", 
    description: "مساعدة العملاء في التسوق، وإجراء عمليات الشراء، واستفسارات المنتجات",
    icon: <Buildings className="h-5 w-5" />
  },
  { 
    id: "realestate", 
    name: "العقارات", 
    description: "مساعدة العملاء في البحث عن العقارات وحجز المعاينات",
    icon: <Buildings className="h-5 w-5" />
  },
  { 
    id: "healthcare", 
    name: "الرعاية الصحية", 
    description: "حجز المواعيد والإجابة على الاستفسارات الطبية العامة",
    icon: <Buildings className="h-5 w-5" />
  },
  { 
    id: "education", 
    name: "التعليم", 
    description: "دعم الطلاب والمدرسين والإجابة على الاستفسارات العامة",
    icon: <Buildings className="h-5 w-5" />
  },
  { 
    id: "hospitality", 
    name: "الضيافة والفنادق", 
    description: "حجز الغرف والاستفسارات وخدمة العملاء",
    icon: <Buildings className="h-5 w-5" />
  },
];

// Sample roles data
const agentRoles: AgentRole[] = [
  { 
    id: "sales", 
    name: "مندوب مبيعات", 
    description: "يساعد العملاء في اتخاذ قرارات الشراء ويقدم عروض وخصومات",
    icon: <User className="h-5 w-5" />
  },
  { 
    id: "support", 
    name: "خدمة العملاء", 
    description: "يقدم الدعم الفني ويحل مشكلات العملاء",
    icon: <User className="h-5 w-5" />
  },
  { 
    id: "advisor", 
    name: "مستشار", 
    description: "يقدم نصائح واستشارات متخصصة في مجال معين",
    icon: <User className="h-5 w-5" />
  },
  { 
    id: "assistant", 
    name: "مساعد شخصي", 
    description: "يساعد في إدارة المهام والمواعيد والتذكيرات",
    icon: <User className="h-5 w-5" />
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

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const TryAIAgent: React.FC = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [chatStarted, setChatStarted] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStartChat = () => {
    if (!selectedIndustry || !selectedRole) {
      toast.error("يرجى اختيار القطاع ودور الوكيل قبل بدء المحادثة");
      return;
    }

    const initialMessage = getInitialMessage(selectedIndustry, selectedRole);
    setMessages([
      {
        id: Date.now().toString(),
        role: 'ai',
        content: initialMessage,
        timestamp: new Date()
      }
    ]);
    setChatStarted(true);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    // Simulate AI response with delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, selectedIndustry, selectedRole);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getIndustryName = (id: string) => {
    return industries.find(i => i.id === id)?.name || id;
  };

  const getRoleName = (id: string) => {
    return agentRoles.find(r => r.id === id)?.name || id;
  };

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-blue-50 to-white py-12">
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
                        <Card 
                          key={industry.id}
                          className={`cursor-pointer transition-all ${
                            selectedIndustry === industry.id 
                              ? 'border-2 border-primary shadow-md' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedIndustry(industry.id)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                              {industry.icon}
                              <h3 className="font-medium">{industry.name}</h3>
                              {selectedIndustry === industry.id && (
                                <Check className="h-5 w-5 text-primary ml-auto" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{industry.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">اختر دور الوكيل</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {agentRoles.map((role) => (
                        <Card 
                          key={role.id}
                          className={`cursor-pointer transition-all ${
                            selectedRole === role.id 
                              ? 'border-2 border-primary shadow-md' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setSelectedRole(role.id)}
                        >
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-2">
                              {role.icon}
                              <h3 className="font-medium">{role.name}</h3>
                              {selectedRole === role.id && (
                                <Check className="h-5 w-5 text-primary ml-auto" />
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{role.description}</p>
                          </CardContent>
                        </Card>
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
                <div className="h-[600px] flex flex-col">
                  <div className="bg-muted/20 p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getIndustryName(selectedIndustry).substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{getRoleName(selectedRole)}</h3>
                        <p className="text-sm text-gray-500">{getIndustryName(selectedIndustry)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setChatStarted(false);
                        setMessages([]);
                      }}
                    >
                      العودة للاختيار
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center gap-2">
                          <span className="animate-pulse">•</span>
                          <span className="animate-pulse delay-75">•</span>
                          <span className="animate-pulse delay-150">•</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="اكتب رسالتك هنا..."
                        className="resize-none"
                        rows={2}
                      />
                      <Button 
                        onClick={handleSendMessage}
                        size="icon" 
                        className="h-full aspect-square"
                        disabled={!message.trim() || loading}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">عزز أعمالك مع وكيل الذكاء الاصطناعي المخصص</h2>
              <p className="text-gray-600 mb-6">
                الوكيل الذكي من أوفر مصمم خصيصًا لتلبية احتياجات قطاعك. يمكنه التعامل مع استفسارات العملاء وحجز المواعيد وإجراء عمليات البيع - على مدار الساعة طوال أيام الأسبوع!
              </p>
              <Button asChild size="lg" className="gap-2">
                <a href="/pricing">
                  سجل الآن للحصول على الإصدار الكامل <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TryAIAgent;
