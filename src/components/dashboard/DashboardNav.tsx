
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChartHorizontal,
  Building,
  CalendarClock,
  CheckSquare,
  ClipboardList,
  CreditCard,
  Home,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  submenu?: NavItem[];
};

const DashboardNav: React.FC = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    {
      title: 'لوحة التحكم',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'العملاء المحتملين',
      href: '/dashboard/leads',
      icon: Users,
    },
    {
      title: 'الشركات',
      href: '/dashboard/companies',
      icon: Building,
    },
    {
      title: 'الصفقات',
      href: '/dashboard/deals',
      icon: CreditCard,
    },
    {
      title: 'المواعيد',
      href: '/dashboard/appointments',
      icon: CalendarClock,
    },
    {
      title: 'التذاكر والدعم',
      href: '/dashboard/tickets',
      icon: ClipboardList,
    },
    {
      title: 'المهام',
      href: '/dashboard/tasks',
      icon: CheckSquare,
    },
    {
      title: 'المحادثات',
      href: '/dashboard/chats',
      icon: MessageSquare,
    },
    {
      title: 'التقارير',
      href: '/dashboard/reports',
      icon: BarChartHorizontal,
    },
    {
      title: 'الإعدادات',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col border-l bg-white rtl">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-5 w-5" />
          <span>Awfar.com</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
                isActive(item.href) && "bg-muted font-medium text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3 rounded-md px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">فريق أوفر</p>
            <p className="text-xs text-muted-foreground">
              مصر | الفريق الإداري
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNav;
