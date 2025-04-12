
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-awfar-primary to-awfar-secondary text-white">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            استكشف قوة الذكاء الاصطناعي في أعمالك
          </h2>
          <p className="text-xl mb-8">
            ابدأ اليوم مع تجربة مجانية وارفع مستوى تفاعل عملائك إلى آفاق جديدة
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-awfar-primary hover:bg-gray-100">
              <Link to="/demo">طلب عرض توضيحي</Link>
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
