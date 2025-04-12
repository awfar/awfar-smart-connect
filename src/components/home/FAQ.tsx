
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FAQ = () => {
  const questions = [
    {
      question: "كيف نتعامل مع بياناتك؟ لا تخاف شماليتنا",
      answer: "تتمتع بيانات منشأتك بحماية كاملة وآمنة. جميع البيانات محمية ومشفرة وتخضع لسيرفرات دول السحابية بنسبة 100%."
    },
    {
      question: "هل يمكن الإستفادة من خدمة Awfar Chat Commerce بدون الإشتراك في باقات الموظف الذكي؟",
      answer: "نعم، يمكنك الاستفادة من خدمات Awfar Chat Commerce الأساسية بدون الاشتراك في باقات الموظف الذكي، لكن للحصول على كامل المميزات المتقدمة ننصح بالاشتراك في إحدى باقاتنا."
    },
    {
      question: "هل يمكن ربط موظف Awfar Chat Commerce الذكي بأي نظام داخلي في المنشأة؟",
      answer: "نعم، يمكن ربط الموظف الذكي بأنظمتك الداخلية بسهولة من خلال واجهات برمجة التطبيقات (APIs) المتوفرة لدينا، مما يتيح التكامل مع أنظمة إدارة علاقات العملاء، أنظمة المخزون، وأنظمة الدفع وغيرها."
    },
    {
      question: "كم تستغرق مدة تفعيل خدمة الموظف الذكي من Awfar Chat Commerce؟",
      answer: "يحتاج الموظف الذكي لـ ساعتين فقط للربط مع أنظمة شركتك (نظام التشغيل، نظام التوصيل، نظام المخزون، إدارة خدمة العملاء،...)"
    },
    {
      question: "هل موظف البنك المصرفي/المستشفى له حق التدخل بذكاء اصطناعي؟",
      answer: "نعم، يمكن تخصيص الموظف الذكي ليعمل في القطاعات المصرفية والصحية مع الالتزام التام بمتطلبات الخصوصية والأمان في هذه القطاعات الحساسة."
    },
    {
      question: "هل الموظف الذكي مناسب للشركات الصغيرة؟",
      answer: "بالتأكيد! الموظف الذكي مصمم ليناسب الشركات من جميع الأحجام، بما في ذلك الشركات الصغيرة، حيث يمكن تخصيص الخدمات وفقاً لاحتياجاتك وميزانيتك."
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">أسئلة قد تكون في ذهنك عن موظف Awfar الذكي ولم تجب عليها بعد</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {questions.map((q, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-colors"
            >
              <h3 className="font-bold text-lg mb-3">{q.question}</h3>
              <p className="text-white/80">{q.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <p className="mb-6 text-lg">إجابة كل هذه الأسئلة وأكثر مع موظفة Awfar Chat Commerce الذكية سلمى</p>
          <Button asChild className="bg-white text-awfar-primary hover:bg-white/90">
            <Link to="/demo">اسأل سلمى الآن</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
