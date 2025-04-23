
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Index from './pages/Index';
import Settings from './pages/Settings';
import LeadManagement from './pages/LeadManagement';
import TasksManagement from './pages/TasksManagement';
import AppointmentsManagement from './pages/AppointmentsManagement';
import AppointmentSettings from './pages/AppointmentSettings';
import DealProfilePage from './pages/DealProfilePage';
import DepartmentsManagement from './pages/DepartmentsManagement';
import TeamsManagement from './pages/TeamsManagement';
import RolesManagement from './pages/RolesManagement';
import PermissionsManagement from './pages/PermissionsManagement';
import UserManagement from './pages/UserManagement';
import LeadDetailsPage from './pages/LeadDetailsPage';
import CompaniesManagement from './pages/CompaniesManagement';
import CompanyProfile from './pages/companies/CompanyProfile';
import DealsManagement from './pages/DealsManagement';
import TicketsManagement from './pages/TicketsManagement';
import LeadProfilePage from './pages/leads/LeadProfilePage';
import DashboardLayoutWrapper from './components/layout/DashboardLayoutWrapper';
import SystemTests from './pages/SystemTests';
import CMS from './pages/CMS';
import InvoiceManagement from './pages/InvoiceManagement';
import CatalogManagement from './pages/CatalogManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';
import PackageManagement from './pages/PackageManagement';
import PropertiesManagement from './pages/PropertiesManagement';
import FormBuilderManagement from './pages/FormBuilderManagement';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Dashboard Routes with Layout Wrapper */}
          <Route element={<DashboardLayoutWrapper />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/leads" element={<LeadManagement />} />
            <Route path="/dashboard/leads/:id" element={<LeadProfilePage />} />
            <Route path="/dashboard/tasks" element={<TasksManagement />} />
            <Route path="/dashboard/appointments" element={<AppointmentsManagement />} />
            <Route path="/dashboard/appointment-settings" element={<AppointmentSettings />} />
            <Route path="/dashboard/deals" element={<DealsManagement />} />
            <Route path="/dashboard/deals/:id" element={<DealProfilePage />} />
            <Route path="/dashboard/companies" element={<CompaniesManagement />} />
            <Route path="/dashboard/companies/:id" element={<CompanyProfile />} />
            <Route path="/dashboard/tickets" element={<TicketsManagement />} />
            <Route path="/dashboard/invoices" element={<InvoiceManagement />} />
            <Route path="/dashboard/users" element={<UserManagement />} />
            <Route path="/dashboard/departments" element={<DepartmentsManagement />} />
            <Route path="/dashboard/teams" element={<TeamsManagement />} />
            <Route path="/dashboard/roles" element={<RolesManagement />} />
            <Route path="/dashboard/permissions" element={<PermissionsManagement />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="/dashboard/cms" element={<CMS />} />
            <Route path="/dashboard/system-tests" element={<SystemTests />} />
            <Route path="/dashboard/catalog" element={<CatalogManagement />} />
            <Route path="/dashboard/subscriptions" element={<SubscriptionManagement />} />
            <Route path="/dashboard/packages" element={<PackageManagement />} />
            <Route path="/dashboard/properties" element={<PropertiesManagement />} />
            <Route path="/dashboard/forms" element={<FormBuilderManagement />} />
            
            {/* Add fallbacks for pages that haven't been created yet */}
            <Route path="/dashboard/chats" element={<Dashboard />} />
            <Route path="/dashboard/reports" element={<Dashboard />} />
          </Route>
          
          {/* Fallback routes */}
          <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster richColors />
    </ThemeProvider>
  );
}

export default App;
