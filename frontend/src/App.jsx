import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../tanmay/context/AuthContext';
import AppShell from '../tanmay/components/AppShell';
import ProtectedRoute from '../tanmay/components/ProtectedRoute';
import AdminLogin from '../tanmay/components/AdminLogin';
import CitizenPortal from '../janhavi/components/CitizenPortal';
import AdminDashboard from '../purva/components/AdminDashboard';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App Layout Shell */}
          <Route path="/" element={<AppShell />}>
            {/* Citizen Portal (Janhavi's Module) */}
            <Route index element={<CitizenPortal />} />

            {/* Admin Login (Tanmay's Module) */}
            <Route path="login" element={<AdminLogin />} />

            {/* Protected Admin Dashboard (Purva's Module) */}
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Wildcard / Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
