
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';

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

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/leads" element={<LeadManagement />} />
            <Route path="/dashboard/leads/:id" element={<LeadProfilePage />} />
            <Route path="/dashboard/tasks" element={<TasksManagement />} />
            <Route path="/dashboard/appointments" element={<AppointmentsManagement />} />
            <Route path="/dashboard/deals" element={<DealsManagement />} />
            <Route path="/dashboard/deals/:id" element={<DealProfilePage />} />
            <Route path="/dashboard/companies" element={<CompaniesManagement />} />
            <Route path="/dashboard/companies/:id" element={<CompanyProfile />} />
            <Route path="/dashboard/tickets" element={<TicketsManagement />} />
            
            {/* User Management Routes */}
            <Route path="/dashboard/users" element={<UserManagement />} />
            <Route path="/dashboard/departments" element={<DepartmentsManagement />} />
            <Route path="/dashboard/teams" element={<TeamsManagement />} />
            <Route path="/dashboard/roles" element={<RolesManagement />} />
            <Route path="/dashboard/permissions" element={<PermissionsManagement />} />
            
            {/* Settings */}
            <Route path="/dashboard/settings" element={<Settings />} />

            {/* Fallback routes */}
            <Route path="/dashboard/*" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
