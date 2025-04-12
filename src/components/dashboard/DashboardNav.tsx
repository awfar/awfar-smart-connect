
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
  FormInput,
  X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardNavProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const DashboardNav = ({ mobileOpen = false, onClose }: DashboardNavProps) => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

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

  // For desktop view
  if (!isMobile) {
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
  }

  // For mobile view
  return (
    <Sheet open={mobileOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="rtl p-0 w-[80%] sm:max-w-sm">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">القائمة</h2>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <SheetClose key={item.href} asChild>
                  <Link to={item.href}>
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        pathname === item.href
                          ? "bg-muted hover:bg-muted"
                          : "hover:bg-transparent hover:underline"
                      )}
                      onClick={onClose}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardNav;
