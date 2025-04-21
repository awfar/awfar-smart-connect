
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, ListTodo, Calendar, Settings, LayoutDashboard, 
  FileSpreadsheet, PhoneCall 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">أوفر CRM</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">مرحباً، المستخدم</span>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r hidden md:block">
          <nav className="py-4">
            <ul className="space-y-1 px-2">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LayoutDashboard size={18} />
                  <span>لوحة التحكم</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/leads"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Users size={18} />
                  <span>العملاء المحتملين</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/companies"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Building2 size={18} />
                  <span>الشركات</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/tasks"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ListTodo size={18} />
                  <span>المهام</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/calendar"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Calendar size={18} />
                  <span>التقويم</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/users"
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings size={18} />
                  <span>إدارة المستخدمين</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
