import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import LeadManagement from "./pages/LeadManagement";
import UserManagement from "./pages/UserManagement";
import RolesManagement from "./pages/RolesManagement";
import PermissionsManagement from "./pages/PermissionsManagement";
import FormBuilderManagement from "./pages/FormBuilderManagement";
import CreateSuperAdmin from "./pages/CreateSuperAdmin";
import TasksManagement from "./pages/TasksManagement";
import AppointmentsManagement from "./pages/AppointmentsManagement";
import TicketsManagement from "./pages/TicketsManagement";
import DealsManagement from "./pages/DealsManagement";
import CatalogManagement from "./pages/CatalogManagement";
import CMS from "./pages/CMS";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import LeadDetails from "./pages/LeadDetails";
import LeadDetailsPage from "./pages/LeadDetailsPage";
import AIAgent from "./pages/AIAgent";
import ChatsManagement from "./pages/ChatsManagement";
import Channels from "./pages/Channels";
import TryAIAgent from "./pages/TryAIAgent";
import AboutUs from "./pages/AboutUs";
import Solutions from "./pages/Solutions";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Demo from "./pages/Demo";
import Integration from "./pages/Integration";
import FormEmbed from "./pages/FormEmbed";
import InvoiceManagement from "./pages/InvoiceManagement";
import PackageManagement from "./pages/PackageManagement";
import ProductDetails from "./pages/ProductDetails";
import CompaniesManagement from "./pages/CompaniesManagement";
import CompanyPropertiesManagement from "./pages/CompanyPropertiesManagement";
import SystemTests from "./pages/SystemTests";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamsManagement from "./pages/TeamsManagement";
import DepartmentsManagement from "./pages/DepartmentsManagement";
import PropertiesManagement from "./pages/PropertiesManagement";
import ReportsManagement from "./pages/ReportsManagement";
import SubscriptionManagement from "./pages/SubscriptionManagement";

import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardLayoutWrapper from "./components/layout/DashboardLayoutWrapper";

function App() {
  return (
    <AuthProvider>
      <>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Dashboard routes with consistent layout */}
            <Route element={<DashboardLayoutWrapper />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/enhanced" element={<EnhancedDashboard />} />
              <Route path="/dashboard/leads" element={<LeadManagement />} />
              <Route path="/dashboard/leads/:id" element={<LeadDetailsPage />} />
              <Route path="/dashboard/users" element={<UserManagement />} />
              <Route path="/dashboard/roles" element={<RolesManagement />} />
              <Route path="/dashboard/permissions" element={<PermissionsManagement />} />
              <Route path="/dashboard/forms" element={<FormBuilderManagement />} />
              <Route path="/dashboard/super-admin" element={<CreateSuperAdmin />} />
              <Route path="/dashboard/tasks" element={<TasksManagement />} />
              <Route path="/dashboard/appointments" element={<AppointmentsManagement />} />
              <Route path="/dashboard/tickets" element={<TicketsManagement />} />
              <Route path="/dashboard/deals" element={<DealsManagement />} />
              <Route path="/dashboard/catalog" element={<CatalogManagement />} />
              <Route path="/dashboard/cms" element={<CMS />} />
              <Route path="/dashboard/settings" element={<Settings />} />
              <Route path="/dashboard/lead/:id" element={<LeadDetails />} />
              <Route path="/dashboard/ai-agent" element={<AIAgent />} />
              <Route path="/dashboard/chats" element={<ChatsManagement />} />
              <Route path="/dashboard/channels" element={<Channels />} />
              <Route path="/dashboard/invoices" element={<InvoiceManagement />} />
              <Route path="/dashboard/packages" element={<PackageManagement />} />
              <Route path="/dashboard/catalog/:id" element={<ProductDetails />} />
              <Route path="/dashboard/companies" element={<CompaniesManagement />} />
              <Route path="/dashboard/companies/properties" element={<CompanyPropertiesManagement />} />
              <Route path="/dashboard/system-tests" element={<SystemTests />} />
              <Route path="/dashboard/teams" element={<TeamsManagement />} />
              <Route path="/dashboard/departments" element={<DepartmentsManagement />} />
              <Route path="/dashboard/properties" element={<PropertiesManagement />} />
              <Route path="/dashboard/reports" element={<ReportsManagement />} />
              <Route path="/dashboard/subscriptions" element={<SubscriptionManagement />} />
            </Route>
            
            {/* Auth and public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/try-ai-agent" element={<TryAIAgent />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/form/:id" element={<FormEmbed />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      
        <Toaster 
          position="top-center"
          richColors
          expand
          closeButton
          dir="rtl"
        />
      </>
    </AuthProvider>
  );
}

export default App;
