
import React, { useState } from 'react';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, MessageSquare, Send, User } from "lucide-react";
import { toast } from "sonner";

const Demo = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [industry, setIndustry] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [demoChats, setDemoChats] = useState<Array<{sender: string, content: string, time: string}>>([
    { sender: "bot", content: "مرحباً بك في خدمة عملاء أوفر. كيف يمكنني مساعدتك اليوم؟", time: "12:01" },
  ]);
  const [userInput, setUserInput] = useState<string>("");

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      toast.success("تم تسجيل طلب التجربة المجانية بنجاح!");
    }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user message
    const newUserMessage = {
      sender: "user",
      content: userInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setDemoChats(prev => [...prev, newUserMessage]);
    setUserInput("");
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse;
      
      if (userInput.toLowerCase().includes("سعر") || userInput.toLowerCase().includes("تكلفة") || userInput.toLowerCase().includes("price")) {
        botResponse = {
          sender: "bot",
          content: "أسعار الخدمة تبدأ من 199 ريال شهرياً للباقة الأساسية، ويمكنك الاطلاع على جميع الباقات من صفحة الأسعار. هل ترغب في معرفة المزيد عن ميزات كل باقة؟",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (userInput.toLowerCase().includes("خدمات") || userInput.toLowerCase().includes("ميزات") || userInput.toLowerCase().includes("features")) {
        botResponse = {
          sender: "bot",
          content: "نقدم العديد من الخدمات المتميزة مثل الرد التلقائي على العملاء على مدار 24 ساعة عبر جميع منصات التواصل، تحليل بيانات العملاء، إدارة المبيعات، وتكامل مع أنظمة الشركات. أي من هذه الخدمات تود معرفة المزيد عنها؟",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else if (userInput.toLowerCase().includes("شكرا") || userInput.toLowerCase().includes("thanks")) {
        botResponse = {
          sender: "bot",
          content: "شكراً لك! يسعدنا دائماً خدمتك. هل هناك أي استفسارات أخرى يمكنني مساعدتك بها؟",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        botResponse = {
          sender: "bot",
          content: "شكراً لتواصلك معنا. سأقوم بتوجيه استفسارك إلى الفريق المختص وسيتم التواصل معك قريباً. هل يمكنني مساعدتك في أي شيء آخر؟",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      
      setDemoChats(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="py-16 bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">جرب موظف أوفر الذكي</h1>
            <p className="text-xl max-w-2xl mx-auto">اختبر قوة الذكاء الاصطناعي في التفاعل مع عملائك وزيادة مبيعاتك</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-awfar-primary mb-6">تجربة مجانية لمدة 14 يوم</h2>
                <p className="text-gray-600 mb-8">
                  احصل على تجربة مجانية كاملة لمدة 14 يوم واكتشف كيف يمكن للموظف الذكي من أوفر أن يحدث ثورة في طريقة تفاعلك مع عملائك.
                </p>
                
                {step === 1 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>طلب تجربة مجانية</CardTitle>
                      <CardDescription>أدخل بياناتك للحصول على فترة تجريبية مجانية</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4" onSubmit={handleSubmitForm}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">الاسم الكامل</Label>
                            <Input 
                              id="name" 
                              placeholder="أدخل اسمك الكامل" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">البريد الإلكتروني</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="name@example.com" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company">اسم الشركة</Label>
                            <Input 
                              id="company" 
                              placeholder="أدخل اسم شركتك" 
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">رقم الهاتف</Label>
                            <Input 
                              id="phone" 
                              placeholder="+966 55 123 4567" 
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="industry">القطاع</Label>
                          <Select 
                            value={industry} 
                            onValueChange={setIndustry}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="اختر قطاع عملك" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="retail">تجارة التجزئة</SelectItem>
                              <SelectItem value="ecommerce">التجارة الإلكترونية</SelectItem>
                              <SelectItem value="healthcare">الرعاية الصحية</SelectItem>
                              <SelectItem value="finance">المالية والمصرفية</SelectItem>
                              <SelectItem value="education">التعليم</SelectItem>
                              <SelectItem value="technology">التكنولوجيا</SelectItem>
                              <SelectItem value="other">أخرى</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="message">كيف يمكننا مساعدتك؟</Label>
                          <Textarea 
                            id="message" 
                            placeholder="أخبرنا المزيد عن احتياجات شركتك..." 
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-awfar-primary hover:bg-awfar-primary/90"
                          disabled={loading}
                        >
                          {loading ? "جاري الإرسال..." : "ابدأ التجربة المجانية"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600">تم تسجيل طلبك بنجاح!</CardTitle>
                      <CardDescription>شكراً لك على اهتمامك بتجربة موظف أوفر الذكي</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Check className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800">تم استلام طلبك</h4>
                            <p className="text-green-700 text-sm">
                              سيقوم فريقنا بالتواصل معك قريباً لإعداد حسابك التجريبي
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">الخطوات القادمة:</h4>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                          <li>سيتصل بك مدير الحساب خلال 24 ساعة</li>
                          <li>إعداد حسابك وتكوين الموظف الذكي</li>
                          <li>تدريب سريع على استخدام المنصة</li>
                          <li>بدء التجربة المجانية لمدة 14 يوم</li>
                        </ol>
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          className="w-full bg-awfar-primary hover:bg-awfar-primary/90"
                          onClick={() => setStep(3)}
                        >
                          جرب المحادثة مع الموظف الذكي
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className={step === 3 ? "col-span-2" : ""}>
                {step < 3 ? (
                  <div className="bg-gray-50 p-6 rounded-xl border shadow-sm">
                    <h3 className="text-2xl font-bold text-awfar-primary mb-4">ما الذي يميزنا؟</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">متاح 24/7</h4>
                          <p className="text-gray-600">الموظف الذكي يعمل بدون توقف على مدار الساعة طوال أيام الأسبوع.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">متعدد اللغات</h4>
                          <p className="text-gray-600">يتحدث بكل اللغات واللهجات المحلية مما يضمن تفاعل أفضل مع عملائك.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">ذكاء اصطناعي متقدم</h4>
                          <p className="text-gray-600">مدرب على فهم احتياجات العملاء وتقديم حلول فعالة وشخصية.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">تكامل سلس</h4>
                          <p className="text-gray-600">يتكامل مع أنظمة CRM الحالية وقنوات التواصل الخاصة بك.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">تحسين المبيعات</h4>
                          <p className="text-gray-600">يحول المحادثات إلى فرص بيع ويزيد من معدل التحويل.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-6">
                      <blockquote className="italic text-gray-600">
                        "بفضل موظف أوفر الذكي، تمكنا من زيادة المبيعات بنسبة 35% وتحسين رضا العملاء بشكل كبير."
                        <footer className="text-gray-500 mt-2 not-italic">- أحمد محمد، المدير التنفيذي لشركة تقنية</footer>
                      </blockquote>
                    </div>
                  </div>
                ) : (
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>جرب المحادثة مع الموظف الذكي</CardTitle>
                      <CardDescription>هذه محادثة توضيحية لإمكانيات الموظف الذكي</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="chat">
                        <TabsList className="mb-4">
                          <TabsTrigger value="chat">المحادثة</TabsTrigger>
                          <TabsTrigger value="info">معلومات الموظف الذكي</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="chat" className="space-y-4">
                          <div 
                            className="h-[400px] overflow-y-auto border rounded-lg p-4 bg-gray-50"
                            style={{ scrollBehavior: 'smooth' }}
                          >
                            {demoChats.map((chat, index) => (
                              <div 
                                key={index} 
                                className={`mb-4 flex ${chat.sender === 'user' ? 'justify-end' : ''}`}
                              >
                                <div 
                                  className={`flex gap-3 max-w-[80%] ${chat.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                  <div 
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      chat.sender === 'user' ? 'bg-awfar-primary' : 'bg-green-500'
                                    }`}
                                  >
                                    {chat.sender === 'user' ? 
                                      <User className="h-4 w-4 text-white" /> : 
                                      <MessageSquare className="h-4 w-4 text-white" />
                                    }
                                  </div>
                                  <div>
                                    <div 
                                      className={`rounded-lg p-3 ${
                                        chat.sender === 'user' 
                                          ? 'bg-awfar-primary text-white' 
                                          : 'bg-white border text-gray-800'
                                      }`}
                                    >
                                      <p>{chat.content}</p>
                                    </div>
                                    <div 
                                      className={`text-xs text-gray-500 mt-1 ${
                                        chat.sender === 'user' ? 'text-left' : 'text-right'
                                      }`}
                                    >
                                      {chat.time}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <form className="flex gap-2" onSubmit={handleSendMessage}>
                            <Input 
                              placeholder="اكتب رسالتك هنا..." 
                              value={userInput}
                              onChange={(e) => setUserInput(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="submit" className="bg-awfar-primary">
                              <Send className="h-4 w-4" />
                            </Button>
                          </form>
                        </TabsContent>
                        
                        <TabsContent value="info">
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">مواصفات الموظف الذكي:</h4>
                              <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>مدرب على المنتجات والخدمات الخاصة بعملك</li>
                                <li>قدرات لغوية متقدمة تشمل العربية واللهجات المحلية</li>
                                <li>فهم سياق المحادثة والرد بشكل طبيعي</li>
                                <li>القدرة على إكمال عمليات البيع والإجابة على الأسئلة الشائعة</li>
                                <li>تحويل المحادثات إلى موظفين بشريين عند الحاجة</li>
                                <li>تحليل سلوك المستخدم وتقديم توصيات للتحسين</li>
                              </ul>
                            </div>
                            
                            <div className="bg-awfar-primary/10 p-4 rounded-lg">
                              <h4 className="font-medium text-awfar-primary mb-2">استخدامات شائعة:</h4>
                              <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>الرد على استفسارات العملاء على مدار الساعة</li>
                                <li>معالجة طلبات المبيعات وتحويلها</li>
                                <li>تقديم الدعم الفني والمساعدة</li>
                                <li>جدولة المواعيد والاجتماعات</li>
                                <li>متابعة الطلبات ومعالجة الشكاوى</li>
                                <li>تقديم توصيات للمنتجات والخدمات</li>
                              </ul>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {step < 3 && (
          <section className="py-12 bg-gray-50 border-t">
            <div className="container mx-auto text-center">
              <h2 className="text-2xl font-bold text-awfar-primary mb-6">عملاء يثقون بنا</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-70">
                <img src="/lovable-uploads/18411ffb-259b-4ff4-b30a-dd6dcdcc63e5.png" alt="Client Logo" className="max-h-12 w-auto mx-auto" />
                <img src="/lovable-uploads/193f53ad-1a0c-4c7b-9d7d-bdda35106e9f.png" alt="Client Logo" className="max-h-12 w-auto mx-auto" />
                <img src="/lovable-uploads/d0e8da8f-bc27-437d-9d5e-681870721ef9.png" alt="Client Logo" className="max-h-12 w-auto mx-auto" />
                <img src="/lovable-uploads/af225455-5aeb-41ac-b7e2-0fc4447b4063.png" alt="Client Logo" className="max-h-12 w-auto mx-auto" />
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
