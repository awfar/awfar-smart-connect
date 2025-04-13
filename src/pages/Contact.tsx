
import React from 'react';
import { toast } from "sonner";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Building, User } from 'lucide-react';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("تم استلام رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت ممكن.");
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block mb-3 px-3 py-1 bg-awfar-primary/10 rounded-full text-awfar-primary font-medium">
                تواصل معنا
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">نحن هنا لمساعدتك</h1>
              <p className="text-xl text-gray-600 mb-8">
                تواصل معنا لأي استفسار أو للحصول على المزيد من المعلومات حول خدماتنا
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-8">معلومات التواصل</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-awfar-primary/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-awfar-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">العنوان</h3>
                      <p className="text-gray-600">
                        الرياض، المملكة العربية السعودية<br />
                        طريق الملك فهد، برج المملكة، الطابق 20
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-awfar-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-awfar-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">البريد الإلكتروني</h3>
                      <p className="text-gray-600">
                        info@awfar.com<br />
                        support@awfar.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-awfar-primary/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-awfar-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">الهاتف</h3>
                      <p className="text-gray-600">
                        +966 11 123 4567<br />
                        +966 50 123 4567
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-awfar-primary/10 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-awfar-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">ساعات العمل</h3>
                      <p className="text-gray-600">
                        الأحد - الخميس: 9:00 ص - 5:00 م<br />
                        الجمعة - السبت: مغلق
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10">
                  <h3 className="font-bold text-lg mb-4">تابعنا على</h3>
                  <div className="flex space-x-4 rtl:space-x-reverse">
                    <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-700">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-700">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-700">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-700">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                              className="rounded-r-none"
                              required
                            />
                          </div>
                        </div>
                        
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
                              className="rounded-r-none"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                              className="rounded-r-none"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="company">الشركة</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm text-sm rounded-r-md">
                              <Building className="h-4 w-4" />
                            </span>
                            <Input
                              id="company"
                              name="company"
                              placeholder="اسم الشركة"
                              className="rounded-r-none"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject">الموضوع</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 shadow-sm text-sm rounded-r-md">
                            <MessageSquare className="h-4 w-4" />
                          </span>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="موضوع رسالتك"
                            className="rounded-r-none"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">الرسالة</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="اكتب رسالتك هنا..."
                          rows={5}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full gap-2">
                        <Send className="h-5 w-5" />
                        إرسال الرسالة
                      </Button>
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
              <h2 className="text-3xl font-bold mb-6">أين تجدنا</h2>
              <p className="text-gray-600">
                مقرنا الرئيسي في الرياض، مع مكاتب فرعية في جدة والدمام
              </p>
            </div>
            
            <div className="bg-gray-200 rounded-xl overflow-hidden h-96 shadow-lg">
              {/* Placeholder for map - would be replaced with actual map component */}
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <p className="text-gray-600 text-lg">خريطة موقع الشركة</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
