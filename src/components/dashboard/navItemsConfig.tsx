
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
  Users, 
  FileEdit, 
  DatabaseZap,
  FormInput,
  ShoppingBag,
  Package,
  Receipt,
  Bookmark,
  Shield,
  Building2,
  UserCog
} from 'lucide-react';

export interface NavItemConfig {
  href: string;
  label: string;
  icon: any;
}

export const navItems: NavItemConfig[] = [
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
    href: '/catalog',
    label: 'إدارة الكتالوج',
    icon: ShoppingBag,
  },
  {
    href: '/subscriptions',
    label: 'إدارة الاشتراكات',
    icon: Bookmark,
  },
  {
    href: '/packages',
    label: 'إدارة الباقات',
    icon: Package,
  },
  {
    href: '/invoices',
    label: 'الفواتير',
    icon: Receipt,
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
    href: '/roles',
    label: 'الأدوار والصلاحيات',
    icon: Shield,
  },
  {
    href: '/departments',
    label: 'الأقسام',
    icon: Building2,
  },
  {
    href: '/teams',
    label: 'الفرق',
    icon: UserCog,
  },
  {
    href: '/settings',
    label: 'الإعدادات',
    icon: Settings,
  }
];
