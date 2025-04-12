
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            حوّل تفاعلاتك مع العملاء مع وكيل الذكاء الاصطناعي من Awfar
          </h2>
          <p className="text-xl mb-10 text-gray-100">
            اختبر قوة الأتمتة الذكية اليوم! نقدم فترة تجريبية مجانية لمدة 14 يوم بكامل المميزات.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-awfar-primary hover:bg-gray-100">
              <Link to="/dashboard">استخدم لوحة التحكم</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-awfar-primary hover:bg-gray-100">
              <Link to="/demo">ابدأ التجربة المجانية</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/pricing">عرض الأسعار والباقات</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
