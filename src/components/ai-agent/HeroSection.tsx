
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-awfar-primary to-awfar-secondary py-20 text-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">وكيل الذكاء الاصطناعي</h1>
            <h2 className="text-2xl mb-6">Awfar AI Agent</h2>
            <p className="text-xl mb-8">
              هو نظام متقدم مصمم لتحسين التفاعل مع العملاء، تبسيط العمليات التجارية، وزيادة الكفاءة من خلال الأتمتة الذكية.
            </p>
            <Button asChild size="lg" className="bg-awfar-accent text-awfar-primary hover:opacity-90">
              <Link to="/demo">طلب عرض توضيحي</Link>
            </Button>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img 
              src="/lovable-uploads/b0b14990-b364-428f-b4d8-3eec941921fa.png" 
              alt="Awfar AI Agent" 
              className="w-full max-w-md rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
