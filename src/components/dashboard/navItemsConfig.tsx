
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
  UserCog,
  UserPlus,
  Lock,
  UsersRound,
  MessageSquare
} from 'lucide-react';

export interface NavItemConfig {
  href: string;
  label: string;
  icon: any;
  subItems?: NavItemConfig[];
  expanded?: boolean;
}

export const navItems: NavItemConfig[] = [
  {
    href: '/dashboard',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/leads',
    label: 'العملاء المحتملين',
    icon: Users,
  },
  {
    href: '/dashboard/deals',
    label: 'الصفقات',
    icon: DollarSign,
  },
  {
    href: '/dashboard/companies',
    label: 'الشركات',
    icon: Building2,
  },
  {
    href: '/dashboard/appointments',
    label: 'المواعيد',
    icon: Calendar,
  },
  {
    href: '/dashboard/tasks',
    label: 'المهام',
    icon: FileText,
  },
  {
    href: '/dashboard/tickets',
    label: 'تذاكر الدعم',
    icon: Mail,
  },
  {
    href: '/dashboard/chats',
    label: 'المحادثات',
    icon: MessageSquare,
  },
  {
    href: '/dashboard/invoices',
    label: 'الفواتير',
    icon: Receipt,
  },
  {
    href: '/dashboard/reports',
    label: 'التقارير',
    icon: BarChart,
  },
  {
    href: '/dashboard/users-management',
    label: 'إدارة المستخدمين',
    icon: UsersRound,
    expanded: false,
    subItems: [
      {
        href: '/dashboard/users',
        label: 'المستخدمين',
        icon: UserPlus,
      },
      {
        href: '/dashboard/roles',
        label: 'الأدوار والصلاحيات',
        icon: Shield,
      },
      {
        href: '/dashboard/permissions',
        label: 'إدارة الصلاحيات',
        icon: Lock,
      },
      {
        href: '/dashboard/departments',
        label: 'الأقسام',
        icon: Building2,
      },
      {
        href: '/dashboard/teams',
        label: 'الفرق',
        icon: UserCog,
      }
    ]
  },
  {
    href: '/dashboard/catalog',
    label: 'إدارة الكتالوج',
    icon: ShoppingBag,
  },
  {
    href: '/dashboard/subscriptions',
    label: 'إدارة الاشتراكات',
    icon: Bookmark,
  },
  {
    href: '/dashboard/packages',
    label: 'إدارة الباقات',
    icon: Package,
  },
  {
    href: '/dashboard/properties',
    label: 'إدارة الخصائص',
    icon: DatabaseZap,
  },
  {
    href: '/dashboard/forms',
    label: 'بناء النماذج',
    icon: FormInput,
  },
  {
    href: '/dashboard/cms',
    label: 'إدارة المحتوى',
    icon: FileEdit,
  },
  {
    href: '/dashboard/system-tests',
    label: 'اختبار النظام',
    icon: Shield,
  },
  {
    href: '/dashboard/settings',
    label: 'الإعدادات',
    icon: Settings,
  }
];
