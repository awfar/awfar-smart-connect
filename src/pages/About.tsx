
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col rtl">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-awfar-primary to-awfar-secondary py-20 text-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
              <p className="text-xl">
                تعرف على فريق أوفر والرؤية التي أدت إلى تأسيس منصة متكاملة لإدارة وتحسين تفاعل العملاء
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-right">
                <h2 className="text-3xl font-bold text-awfar-primary mb-4">قصتنا</h2>
                <p className="text-gray-600">
                  Awfar.com هي شركة رائدة في تقديم حلول التواصل الرقمي وخدمات إدارة تجربة العملاء. تأسست في عام 2013 كمنصة (SaaS) للأعمال التجارية، لتمكينهم من جمع وإدارة توقعات تفاعل العملاء.
                </p>
                <p className="text-gray-600">
                  نحن في Awfar نؤمن بتمكين الشركات من خلال التكنولوجيا التي تلبي توقعات العملاء فحسب، بل وتتجاوزها.
                </p>
                <p className="text-gray-600">
                  تقدم Awfar حلولاً متقدمة للحكومات، تجارة التجزئة، الصناعات، الصيدليات، التجارة الإلكترونية، والشركات الناشئة.
                </p>
                <p className="text-gray-600">
                  مع التركيز الشديد على الابتكار ورضا العملاء، تقدم Awfar.com مجموعة من الخدمات المصممة لزيادة كفاءة العمليات، تحسين تفاعل العملاء، ورفع المبيعات.
                </p>
              </div>
              <div className="order-first lg:order-last">
                <img 
                  src="/lovable-uploads/9b758cfa-ce4e-40a0-bcf5-2379fbd46420.png" 
                  alt="About Awfar" 
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-awfar-primary mb-4">لماذا نحن</h2>
              <p className="text-gray-600 text-lg">
                نقدم خدمات مصممة خصيصاً لتلبية احتياجات مختلف الصناعات، بما في ذلك الحكومات، تجارة التجزئة، الصناعات، الصيدليات، التجارة الإلكترونية، والشركات الناشئة. نسعى دائماً لتقديم حلولاً متكاملة يمكن تخصيصها وتكييفها لتناسب متطلبات كل قطاع بشكل أفضل.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-awfar-primary">جاهزة للإنطلاق</h3>
                <p className="text-gray-600 mb-4">جميع حلولنا جاهزة للاستخدام الفوري</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-awfar-primary">تطوير مستمر</h3>
                <p className="text-gray-600 mb-4">نعمل باستمرار على إضافة ميزات جديدة وتحسين الموجودة</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-awfar-primary">تعدد الأنظمة</h3>
                <p className="text-gray-600 mb-4">نقدم عدة أنظمة للعمل اليدوي مع الدعم لتفرغ للمهام الاستراتيجية</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-awfar-primary">تحسين تجربة العملاء</h3>
                <p className="text-gray-600 mb-4">نوفر تجربة سلسة ومميزة لزيادة رضا العملاء</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-awfar-primary">زيادة الكفاءة</h3>
                <p className="text-gray-600 mb-4">زيادة المبيعات من خلال حلول تتبع العملاء بشكل فعال</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-4 text-awfar-primary">تكامل سلس</h3>
                <p className="text-gray-600 mb-4">التكامل بسهولة مع أنظمة CRM وأتمتة المبيعات وتتبع العملاء</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold text-awfar-primary mb-8">جاهزون للانضمام إلى عملائنا المميزين؟</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-awfar-primary to-awfar-secondary hover:opacity-90">
                <Link to="/demo">طلب تجربة مجانية</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">تواصل معنا</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
