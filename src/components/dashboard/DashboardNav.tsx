
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Calendar, 
  Contact, 
  DollarSign, 
  FileText, 
  Home, 
  LayoutDashboard, 
  Mail, 
  Settings, 
  UserCog, 
  Users, 
  FileEdit, 
  DatabaseZap,
  FormInput
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';

const DashboardNav = () => {
  const { pathname } = useLocation();

  const navItems = [
    {
      href: '/dashboard',
      label: 'لوحة التحكم',
      icon: LayoutDashboard,
    },
    {
      href: '/leads',
      label: 'العملاء المحتملين',
      icon: Users,
    },
    {
      href: '/deals',
      label: 'الصفقات',
      icon: DollarSign,
    },
    {
      href: '/companies',
      label: 'الشركات',
      icon: Home,
    },
    {
      href: '/appointments',
      label: 'المواعيد',
      icon: Calendar,
    },
    {
      href: '/tasks',
      label: 'المهام',
      icon: FileText,
    },
    {
      href: '/tickets',
      label: 'تذاكر الدعم',
      icon: Mail,
    },
    {
      href: '/reports',
      label: 'التقارير',
      icon: BarChart,
    },
    {
      href: '/users',
      label: 'المستخدمين',
      icon: Contact,
    },
    {
      href: '/properties',
      label: 'إدارة الخصائص',
      icon: DatabaseZap,
    },
    {
      href: '/form-builder',
      label: 'بناء النماذج',
      icon: FormInput,
    },
    {
      href: '/cms',
      label: 'إدارة المحتوى',
      icon: FileEdit,
    },
    {
      href: '/settings',
      label: 'الإعدادات',
      icon: Settings,
    }
  ];

  return (
    <div className="hidden lg:block min-h-screen w-64 border-l p-4 bg-white dark:bg-gray-900">
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                pathname === item.href
                  ? "bg-muted hover:bg-muted"
                  : "hover:bg-transparent hover:underline"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardNav;
