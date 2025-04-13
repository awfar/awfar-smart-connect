
import React, { useState } from 'react';
import { toast } from "sonner";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Send, Phone, Mail, Building, User } from 'lucide-react';

const Demo = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'bot', text: 'مرحباً! أنا الوكيل الذكي من Awfar. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory([...chatHistory, { sender: 'user', text: message }]);
    setMessage('');
    setIsSubmitting(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'شكراً على تواصلك معنا! يسعدني مساعدتك في التعرف على خدماتنا.',
        'يمكنني مساعدتك في اختيار الباقة المناسبة لاحتياجات عملك.',
        'لدينا حلول متكاملة لإدارة تفاعلات العملاء عبر جميع منصات التواصل.',
        'هل ترغب في معرفة المزيد عن كيفية تحسين تجربة عملائك؟',
        'يمكنني تزويدك بمعلومات عن أسعارنا وكيفية البدء بالاستخدام.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, { sender: 'bot', text: randomResponse }]);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تم استلام طلبك بنجاح! سيقوم فريقنا بالتواصل معك في أقرب وقت.");
    setContactForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block mb-3 px-3 py-1 bg-awfar-primary/10 rounded-full text-awfar-primary font-medium">
                تجربة حية
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">جرب الوكيل الذكي من Awfar</h1>
              <p className="text-xl text-gray-600 mb-8">
                اختبر قدرات الوكيل الذكي بنفسك وتعرف على كيفية مساعدته في تحسين تفاعلك مع العملاء
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <Card className="shadow-lg border-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-awfar-primary to-awfar-secondary p-4 flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">الوكيل الذكي من Awfar</h3>
                  </div>
                  
                  <CardContent className="p-0">
                    <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                      {chatHistory.map((msg, index) => (
                        <div
                          key={index}
                          className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === 'user'
                                ? 'bg-awfar-primary text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                          >
                            <p>{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      {isSubmitting && (
                        <div className="flex justify-start mb-4">
                          <div className="bg-white text-gray-800 rounded-lg p-3 border border-gray-200">
                            <div className="flex gap-1">
                              <span className="animate-bounce">·</span>
                              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>·</span>
                              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>·</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          placeholder="اكتب رسالتك هنا..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="flex-grow"
                        />
                        <Button type="submit" size="icon">
                          <Send className="h-5 w-5" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500 mb-2">هذه نسخة توضيحية فقط. النسخة الكاملة تتضمن مميزات أكثر تخصيصاً لعملك</p>
                </div>
              </div>
              
              <div>
                <Card className="shadow-lg border-0">
                  <div className="bg-gradient-to-r from-awfar-secondary to-awfar-accent p-4">
                    <h3 className="text-xl font-bold text-white text-center">طلب عرض توضيحي مخصص</h3>
                  </div>
                  
                  <CardContent className="p-6">
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">الاسم الكامل</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm text-sm rounded-r-md">
                            <User className="h-4 w-4" />
                          </span>
                          <Input
                            id="name"
                            name="name"
                            placeholder="أدخل اسمك الكامل"
                            value={contactForm.name}
                            onChange={handleContactFormChange}
                            className="rounded-r-none"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="company">اسم الشركة</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm text-sm rounded-r-md">
                            <Building className="h-4 w-4" />
                          </span>
                          <Input
                            id="company"
                            name="company"
                            placeholder="أدخل اسم الشركة"
                            value={contactForm.company}
                            onChange={handleContactFormChange}
                            className="rounded-r-none"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">البريد الإلكتروني</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm text-sm rounded-r-md">
                              <Mail className="h-4 w-4" />
                            </span>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="example@example.com"
                              value={contactForm.email}
                              onChange={handleContactFormChange}
                              className="rounded-r-none"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm text-sm rounded-r-md">
                              <Phone className="h-4 w-4" />
                            </span>
                            <Input
                              id="phone"
                              name="phone"
                              placeholder="+966 5X XXX XXXX"
                              value={contactForm.phone}
                              onChange={handleContactFormChange}
                              className="rounded-r-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">رسالتك</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="أخبرنا أكثر عن احتياجات عملك..."
                          rows={4}
                          value={contactForm.message}
                          onChange={handleContactFormChange}
                          required
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-awfar-primary to-awfar-secondary"
                      >
                        طلب عرض توضيحي مخصص
                      </Button>
                      
                      <p className="text-xs text-gray-500 text-center">
                        بالضغط على زر الإرسال، أنت توافق على سياسة الخصوصية الخاصة بنا وشروط الخدمة.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">ماذا سيقدم لك العرض التوضيحي المخصص؟</h2>
              <p className="text-lg text-gray-600">
                نقدم عرضاً توضيحياً متكاملاً مخصصاً لاحتياجات عملك، يتضمن:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
                <div className="bg-awfar-primary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                  <Bot className="h-8 w-8 text-awfar-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">وكيل ذكي مخصص</h3>
                <p className="text-gray-600">
                  وكيل ذكي مدرب خصيصاً على بيانات شركتك ومتوافق مع احتياجات عملك الفريدة
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
                <div className="bg-awfar-secondary/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                  <Phone className="h-8 w-8 text-awfar-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-4">شرح تفصيلي للميزات</h3>
                <p className="text-gray-600">
                  جلسة تفصيلية لشرح كافة ميزات المنصة وكيفية الاستفادة منها بالشكل الأمثل
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 text-center">
                <div className="bg-awfar-accent/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6">
                  <Building className="h-8 w-8 text-awfar-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4">خطة تنفيذ مقترحة</h3>
                <p className="text-gray-600">
                  خطة مخصصة لتنفيذ الحلول في شركتك مع تقدير للتكلفة والوقت اللازم للتنفيذ
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Demo;
