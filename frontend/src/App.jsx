import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../tanmay/context/AuthContext';
import AppShell from '../tanmay/components/AppShell';
import ProtectedRoute from '../tanmay/components/ProtectedRoute';
import AdminLogin from '../tanmay/components/AdminLogin';
import CitizenPortal from '../janhavi/components/CitizenPortal';
import AdminDashboard from '../purva/components/AdminDashboard';
import UnifiedPortal from './UnifiedPortal';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App Layout Shell */}
          <Route path="/" element={<AppShell />}>
            {/* Complete Unified All-in-One Dashboard (Citizen + Admin Map + Kanban) */}
            <Route index element={<UnifiedPortal />} />

            {/* Individual Sub-Routes for Standalone Views */}
            <Route path="report" element={<CitizenPortal apiBaseUrl="http://localhost:5000" />} />
            <Route path="login" element={<AdminLogin />} />
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

