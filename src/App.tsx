
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import DepartmentsManagement from './pages/DepartmentsManagement';
import TeamsManagement from './pages/TeamsManagement';
import LeadManagement from './pages/LeadManagement';
import NotFound from './pages/NotFound';
import CreateSuperAdmin from "./pages/CreateSuperAdmin";
import PermissionsManagement from './pages/PermissionsManagement';
import RolesManagement from './pages/RolesManagement';
import CompaniesManagement from './pages/CompaniesManagement';
import DealsManagement from './pages/DealsManagement';
import CMS from './pages/CMS';
import Settings from './pages/Settings';
import TasksManagement from './pages/TasksManagement';
import TicketsManagement from './pages/TicketsManagement';

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('rtl');
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/leads" element={isLoggedIn ? <LeadManagement /> : <Navigate to="/login" />} />
          <Route path="/dashboard/companies" element={isLoggedIn ? <CompaniesManagement /> : <Navigate to="/login" />} />
          <Route path="/dashboard/deals" element={isLoggedIn ? <DealsManagement /> : <Navigate to="/login" />} />
          <Route path="/dashboard/appointments" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/tickets" element={isLoggedIn ? <TicketsManagement /> : <Navigate to="/login" />} />
          <Route path="/dashboard/tasks" element={isLoggedIn ? <TasksManagement /> : <Navigate to="/login" />} />
          <Route path="/dashboard/chats" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/reports" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/cms" element={isLoggedIn ? <CMS /> : <Navigate to="/login" />} />
          <Route path="/dashboard/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/dashboard/users" element={<UserManagement />} />
          <Route path="/dashboard/departments" element={<DepartmentsManagement />} />
          <Route path="/dashboard/teams" element={<TeamsManagement />} />
          <Route path="/dashboard/permissions" element={<PermissionsManagement />} />
          <Route path="/dashboard/roles" element={<RolesManagement />} />
          <Route path="/create-super-admin" element={<CreateSuperAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
