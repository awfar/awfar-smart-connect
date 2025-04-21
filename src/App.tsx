
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { supabase } from '@/integrations/supabase/client';
// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import Leads from './pages/leads/Leads';
import LeadProfilePage from './pages/leads/LeadProfilePage';
import Companies from './pages/CompaniesManagement';
import Tasks from './pages/TasksManagement';
import Calendar from './pages/Calendar';
import UserManagement from './pages/UserManagement';
import { Toaster } from 'sonner';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000
    }
  }
});

function App() {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.info('Auth state changed:', event, session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/leads" element={<Leads />} />
            <Route path="/dashboard/leads/:id" element={<LeadProfilePage />} />
            <Route path="/dashboard/companies" element={<Companies />} />
            <Route path="/dashboard/tasks" element={<Tasks />} />
            <Route path="/dashboard/calendar" element={<Calendar />} />
            <Route path="/dashboard/users" element={<UserManagement />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
