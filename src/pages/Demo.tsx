
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Send, Mic, Paperclip, Bot, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/components/ui/use-toast';

const Demo = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'مرحباً! أنا مساعد أوفر الذكي. كيف يمكنني مساعدتك اليوم؟',
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isInterested, setIsInterested] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, userMessage]);
    setInputMessage('');
    
    // Simulate bot thinking
    setLoading(true);
    
    setTimeout(() => {
      let botReply;
      const userText = inputMessage.toLowerCase();
      
      if (userText.includes('سعر') || userText.includes('تكلفة') || userText.includes('باقة')) {
        botReply = 'لدينا عدة باقات تبدأ من مجاناً للشركات الناشئة، وصولاً إلى الباقة الاحترافية بسعر 499 ريال شهرياً. هل ترغب بمعرفة المزيد عن مميزات كل باقة؟';
      } else if (userText.includes('تجربة') || userText.includes('اختبار')) {
        botReply = 'يمكننا أن نقدم لك فترة تجريبية مجانية لمدة 14 يوم مع كل مميزات النظام. هل تود تفعيل الفترة التجريبية؟';
        setIsInterested(true);
      } else if (userText.includes('مميزات') || userText.includes('خصائص')) {
        botReply = 'نظام أوفر يوفر العديد من المميزات منها: الرد التلقائي على استفسارات العملاء، التكامل مع أنظمة CRM، دعم جميع منصات التواصل الاجتماعي، تقارير وتحليلات متقدمة، وأكثر من ذلك بكثير!';
      } else if (userText.includes('اتصال') || userText.includes('تواصل') || userText.includes('مبيعات')) {
        botReply = 'هل تود التحدث مع أحد ممثلي المبيعات لدينا؟ يمكنني أخذ بياناتك وسيتواصل معك أحد المختصين قريباً.';
        setIsInterested(true);
      } else {
        botReply = 'شكراً لتواصلك معنا! هل يمكنني مساعدتك بمعلومات عن باقاتنا، مميزاتنا أو الحصول على عرض توضيحي شخصي؟';
      }

      const botMessage = {
        id: messages.length + 2,
        text: botReply,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleSubmitInfo = () => {
    if (!name || !email) {
      toast({
        title: "يرجى تعبئة كافة الحقول",
        description: "الاسم والبريد الإلكتروني مطلوبان",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate form submission
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "تم إرسال معلوماتك بنجاح",
        description: "سيقوم فريقنا بالتواصل معك قريباً",
      });
      
      setMessages([
        ...messages, 
        {
          id: messages.length + 1,
          text: `شكراً ${name}! تم استلام طلبك وسيتواصل معك فريق المبيعات قريباً على البريد ${email}`,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      
      setIsInterested(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold mb-4">جرب مساعد أوفر الذكي</h1>
              <p className="text-gray-600 max-w-xl mx-auto">
                اختبر قدرات الوكيل الذكي من أوفر في الرد على استفسارات العملاء، توفير المعلومات، والمساعدة في عمليات البيع
              </p>
            </div>
            
            <Card className="shadow-lg border-0">
              <div className="bg-gradient-to-r from-awfar-primary to-awfar-secondary p-4 rounded-t-lg">
                <div className="flex items-center gap-2 text-white">
                  <Bot size={20} />
                  <span className="font-medium">مساعد أوفر الذكي</span>
                </div>
              </div>
              
              <div className="p-4 h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'bot' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-awfar-primary text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === 'bot' ? (
                            <Bot size={16} className="text-awfar-secondary" />
                          ) : (
                            <User size={16} />
                          )}
                          <span className="font-medium text-sm">
                            {message.sender === 'bot' ? 'مساعد أوفر' : 'أنت'}
                          </span>
                          <span className="text-xs opacity-75">{message.time}</span>
                        </div>
                        <p>{message.text}</p>
                      </div>
                    </div>
                  ))}
                  
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {isInterested ? (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">يرجى تعبئة المعلومات للمتابعة</h3>
                    <div className="space-y-3">
                      <Input 
                        placeholder="الاسم الكامل" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <Input 
                        type="email" 
                        placeholder="البريد الإلكتروني" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div className="flex justify-between">
                        <Button onClick={() => setIsInterested(false)} variant="outline">
                          إلغاء
                        </Button>
                        <Button onClick={handleSubmitInfo} disabled={loading}>
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              جاري الإرسال...
                            </span>
                          ) : (
                            'إرسال المعلومات'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="اكتب رسالتك هنا..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={loading || !inputMessage.trim()} 
                        className="bg-awfar-primary hover:bg-awfar-primary/90"
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                    <div className="flex justify-between mt-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip size={18} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mic size={18} />
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        بالضغط على إرسال، فإنك توافق على <a href="#" className="text-awfar-primary">شروط الاستخدام</a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            <div className="mt-10 text-center">
              <h2 className="text-2xl font-bold mb-4">مزايا استخدام مساعد أوفر الذكي</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[
                  {
                    title: "تفاعل فوري",
                    description: "رد على استفسارات العملاء على مدار الساعة بدون تأخير"
                  },
                  {
                    title: "دقة عالية",
                    description: "فهم دقيق لاحتياجات العملاء وتقديم المعلومات الصحيحة"
                  },
                  {
                    title: "تحويل إلى مبيعات",
                    description: "مساعدة العملاء في اتخاذ قرار الشراء بفعالية"
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Demo;
