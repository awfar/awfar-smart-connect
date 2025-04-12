import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import DepartmentsManagement from './pages/DepartmentsManagement';
import TeamsManagement from './pages/TeamsManagement';
import LeadManagement from './pages/LeadManagement';
import NotFound from './pages/NotFound';
import CreateSuperAdmin from "./pages/CreateSuperAdmin";

function App() {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/leads" element={isLoggedIn ? <LeadManagement /> : <Navigate to="/login" />} />
          <Route path="/dashboard/companies" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/deals" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/appointments" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/tickets" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/tasks" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/chats" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/reports" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/dashboard/cms" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard/users" element={<UserManagement />} />
        <Route path="/dashboard/departments" element={<DepartmentsManagement />} />
        <Route path="/dashboard/teams" element={<TeamsManagement />} />
        <Route path="/create-super-admin" element={<CreateSuperAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    <Toaster />
  </div>
);
}

export default App;
