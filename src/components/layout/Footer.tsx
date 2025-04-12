
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-awfar-primary text-white pt-16 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-1 mb-4">
              <span className="text-3xl font-bold text-white">Awfar</span>
              <span className="text-3xl font-bold text-awfar-accent">.com</span>
            </Link>
            <p className="text-gray-300 mb-6">كل تواصلك في مكان واحد</p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">الخدمات</h3>
            <ul className="space-y-2">
              <li><Link to="/ai-agent" className="text-gray-300 hover:text-white">الذكاء الاصطناعي</Link></li>
              <li><Link to="/channels" className="text-gray-300 hover:text-white">قنوات التواصل</Link></li>
              <li><Link to="/solutions" className="text-gray-300 hover:text-white">الحلول الشاملة</Link></li>
              <li><Link to="/integration" className="text-gray-300 hover:text-white">التكامل مع الأنظمة</Link></li>
              <li><Link to="/pricing" className="text-gray-300 hover:text-white">الأسعار والعروض</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">الشركة</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white">من نحن</Link></li>
              <li><Link to="/team" className="text-gray-300 hover:text-white">فريق العمل</Link></li>
              <li><Link to="/partners" className="text-gray-300 hover:text-white">شركاء النجاح</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white">الوظائف</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white">المدونة</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span className="text-gray-300">+966 123 4567</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span className="text-gray-300">info@awfar.com</span>
              </div>
              <address className="text-gray-300 not-italic">
                الرياض، المملكة العربية السعودية
              </address>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Awfar.com. جميع الحقوق محفوظة
          </p>
          <div className="flex space-x-6 rtl:space-x-reverse">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">سياسة الخصوصية</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
