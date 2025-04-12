
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import LeadManagement from "./pages/LeadManagement";
import LeadDetails from "./pages/LeadDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppointmentsManagement from "./pages/AppointmentsManagement";
import TicketsManagement from "./pages/TicketsManagement";
import TasksManagement from "./pages/TasksManagement";
import CompaniesManagement from "./pages/CompaniesManagement";
import DealsManagement from "./pages/DealsManagement";
import UserManagement from "./pages/UserManagement";
import TeamsManagement from "./pages/TeamsManagement";
import DepartmentsManagement from "./pages/DepartmentsManagement";
import RolesManagement from "./pages/RolesManagement";
import PermissionsManagement from "./pages/PermissionsManagement";
import ReportsManagement from "./pages/ReportsManagement";
import Settings from "./pages/Settings";
import CMS from "./pages/CMS";
import CreateSuperAdmin from "./pages/CreateSuperAdmin";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

// Import our new pages
import PropertiesManagement from "./pages/PropertiesManagement";
import FormBuilderManagement from "./pages/FormBuilderManagement";
import FormEmbed from "./pages/FormEmbed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<LeadManagement />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/appointments" element={<AppointmentsManagement />} />
        <Route path="/tickets" element={<TicketsManagement />} />
        <Route path="/tasks" element={<TasksManagement />} />
        <Route path="/companies" element={<CompaniesManagement />} />
        <Route path="/deals" element={<DealsManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/teams" element={<TeamsManagement />} />
        <Route path="/departments" element={<DepartmentsManagement />} />
        <Route path="/roles" element={<RolesManagement />} />
        <Route path="/permissions" element={<PermissionsManagement />} />
        <Route path="/reports" element={<ReportsManagement />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/cms" element={<CMS />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-super-admin" element={<CreateSuperAdmin />} />
        
        {/* Add our new routes */}
        <Route path="/properties" element={<PropertiesManagement />} />
        <Route path="/form-builder" element={<FormBuilderManagement />} />
        <Route path="/form-embed/:formId" element={<FormEmbed />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <SonnerToaster position="top-center" expand closeButton richColors />
    </Router>
  );
}

export default App;
