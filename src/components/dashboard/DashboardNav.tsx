
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Building2,
  ShoppingCart,
  TicketCheck,
  MessageCircle,
  Settings,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface NavItemProps {
  icon: React.ElementType;
  title: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, title, href, active, onClick }: NavItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
        active ? "bg-accent text-accent-foreground" : "transparent"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  );
};

const DashboardNav = () => {
  const [activePath, setActivePath] = useState("/dashboard");
  const [open, setOpen] = useState(false);

  const handleNavClick = (path: string) => {
    setActivePath(path);
    setOpen(false);
  };

  const navItems = [
    { icon: LayoutDashboard, title: "لوحة التحكم", href: "/dashboard" },
    { icon: Users, title: "العملاء المحتملين", href: "/dashboard/leads" },
    { icon: Building2, title: "الشركات", href: "/dashboard/companies" },
    { icon: ShoppingCart, title: "الفرص والصفقات", href: "/dashboard/deals" },
    { icon: TicketCheck, title: "التذاكر", href: "/dashboard/tickets" },
    { icon: MessageCircle, title: "المحادثات", href: "/dashboard/chat" },
    { icon: FileText, title: "المحتوى", href: "/dashboard/content" },
    { icon: BarChart3, title: "التقارير", href: "/dashboard/reports" },
    { icon: Settings, title: "الإعدادات", href: "/dashboard/settings" },
  ];

  // Mobile navigation with sheet
  const mobileNav = (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <nav className="grid gap-2 py-4">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              title={item.title}
              href={item.href}
              active={activePath === item.href}
              onClick={() => handleNavClick(item.href)}
            />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {mobileNav}
      <div className="hidden md:flex h-screen w-56 flex-col border-l bg-background">
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid gap-2 px-4">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                title={item.title}
                href={item.href}
                active={activePath === item.href}
                onClick={() => handleNavClick(item.href)}
              />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default DashboardNav;
