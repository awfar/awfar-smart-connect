
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MessageCircle, Send, ThumbsUp, Bot } from 'lucide-react';

const Demo = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([
    {
      sender: 'bot',
      text: 'مرحبًا! أنا الموظف الذكي من Awfar. كيف يمكنني مساعدتك اليوم؟',
      timestamp: new Date().toISOString(),
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to conversation
    setConversation(prev => [...prev, {
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    }]);
    
    // Simulate loading
    setLoading(true);
    
    // Simulate bot response after delay
    setTimeout(() => {
      setConversation(prev => [...prev, {
        sender: 'bot',
        text: getSimulatedResponse(message),
        timestamp: new Date().toISOString(),
      }]);
      setLoading(false);
    }, 1500);
    
    setMessage('');
  };
  
  const getSimulatedResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('سعر') || lowerMessage.includes('تكلفة')) {
      return 'نقدم خطة مجانية للبدء، والخطة الاحترافية تبدأ من 199 ريال شهريًا. هل ترغب في معرفة المزيد عن ميزات كل خطة؟';
    } else if (lowerMessage.includes('خدمات') || lowerMessage.includes('ميزات')) {
      return 'نقدم خدمات متعددة مثل الرد الآلي على العملاء، إدارة المبيعات من خلال المحادثات، تكامل مع أنظمة الشركة الحالية، وتحليلات متقدمة للمحادثات. أي من هذه الخدمات تود معرفة المزيد عنها؟';
    } else if (lowerMessage.includes('تسجيل') || lowerMessage.includes('اشتراك')) {
      return 'يمكنك التسجيل بسهولة عبر موقعنا الإلكتروني. هل ترغب في البدء بالخطة المجانية أم الخطة المدفوعة؟';
    } else if (lowerMessage.includes('كيف') || lowerMessage.includes('طريقة')) {
      return 'يمكنني مساعدتك خطوة بخطوة. هل تحتاج إلى مساعدة في إعداد الحساب أو استخدام الميزات أو ربط قنوات التواصل الاجتماعي؟';
    } else {
      return 'شكراً لتواصلك معنا. يمكنني مساعدتك في جميع استفساراتك حول منصة Awfar. هل ترغب في معرفة المزيد عن خدماتنا أو الأسعار أو كيفية البدء؟';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-gradient-to-b from-awfar-primary to-awfar-secondary py-12 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">جرب الموظف الذكي من أوفر</h1>
          <p className="max-w-2xl mx-auto">
            اختبر قوة المحادثات الذكية مع موظفنا الافتراضي. يمكنه الرد على الاستفسارات، وإتمام المبيعات، وحل المشكلات!
          </p>
        </div>
      </section>
      
      <section className="flex-1 py-10 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-awfar-primary text-white flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h2 className="font-semibold">محادثة مع الموظف الذكي</h2>
            </div>
            
            <div className="h-[500px] overflow-y-auto p-4 bg-gray-50">
              {conversation.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] p-4 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-awfar-primary text-white rounded-bl-xl rounded-tl-xl rounded-tr-none' 
                      : 'bg-white border border-gray-200 rounded-br-xl rounded-tr-xl rounded-tl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 block text-right mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 p-4 rounded-lg rounded-bl-none">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
              <Input
                placeholder="اكتب رسالتك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 text-right"
              />
              <Button 
                type="submit" 
                disabled={loading || !message.trim()} 
                className="bg-awfar-primary hover:bg-awfar-primary/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">هل وجدت تجربة المحادثة مفيدة؟</p>
            <Button variant="outline" className="mx-2" onClick={() => toast({
              title: "شكراً لك!",
              description: "نحن سعداء بأن تجربتك كانت إيجابية",
            })}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              نعم، كانت مفيدة
            </Button>
            <Button variant="link" className="mx-2" onClick={() => {
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            }}>
              <MessageCircle className="h-4 w-4 mr-2" />
              تحدث مع فريق المبيعات
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Demo;
