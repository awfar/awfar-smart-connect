
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import AboutUs from "./pages/AboutUs";
import AIAgent from "./pages/AIAgent";
import TryAIAgent from "./pages/TryAIAgent"; 
import Channels from "./pages/Channels";
import Solutions from "./pages/Solutions";
import Integration from "./pages/Integration";
import Dashboard from "./pages/Dashboard";
import LeadManagement from "./pages/LeadManagement";
import LeadDetails from "./pages/LeadDetails";
import CompaniesManagement from "./pages/CompaniesManagement";
import AppointmentsManagement from "./pages/AppointmentsManagement";
import TasksManagement from "./pages/TasksManagement";
import TicketsManagement from "./pages/TicketsManagement";
import Settings from "./pages/Settings";
import CMS from "./pages/CMS";
import NotFound from "./pages/NotFound";
import Demo from "./pages/Demo";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/ai-agent" element={<AIAgent />} />
          <Route path="/try-ai-agent" element={<TryAIAgent />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/leads" element={<LeadManagement />} />
          <Route path="/dashboard/leads/:id" element={<LeadDetails />} />
          <Route path="/dashboard/companies" element={<CompaniesManagement />} />
          <Route path="/dashboard/cms" element={<CMS />} />
          <Route path="/dashboard/appointments" element={<AppointmentsManagement />} />
          <Route path="/dashboard/tasks" element={<TasksManagement />} />
          <Route path="/dashboard/tickets" element={<TicketsManagement />} />
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route path="/dashboard/chats" element={<Dashboard />} />
          <Route path="/dashboard/reports" element={<Dashboard />} />
          <Route path="/dashboard/deals" element={<Dashboard />} />
          <Route path="/dashboard//*" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
