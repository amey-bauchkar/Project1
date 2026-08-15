import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from '../tanmay/context/AuthContext';
import AppShell from '../tanmay/components/AppShell';
import ProtectedRoute from '../tanmay/components/ProtectedRoute';
import AdminLogin from '../tanmay/components/AdminLogin';
import NearbyIssuesView from '../tanmay/components/nearby/NearbyIssuesView';
import CitizenPortal from '../janhavi/components/CitizenPortal';
import AdminDashboard from '../purva/components/AdminDashboard';
import UnifiedPortal from './UnifiedPortal';
import { ArrowLeft, Shield, Building2 } from 'lucide-react';

/**
 * Standalone Citizen Report Page with executive framing
 */
const StandaloneCitizenPage = () => (
  <div className="min-h-[calc(100vh-14rem)] bg-gov-surface py-10 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
      {/* Top Breadcrumb Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gov-muted hover:text-gov-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command Center</span>
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gov-navy bg-gov-accent/20 px-2.5 py-1 rounded border border-gov-accent-dark/30">
          Official Grievance Form
        </span>
      </div>

      {/* Embedded Mobile Portal */}
      <CitizenPortal apiBaseUrl="http://localhost:5000" />
    </div>
  </div>
);

/**
 * Standalone Admin Dashboard Page with executive framing
 */
const StandaloneAdminPage = () => (
  <div className="min-h-[calc(100vh-14rem)] bg-gov-surface py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gov-muted hover:text-gov-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Command Center</span>
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-gov-navy px-2.5 py-1 rounded">
          Authorized Admin Session
        </span>
      </div>

      {/* Admin Dashboard Card */}
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-card border border-gov-border">
        <AdminDashboard />
      </div>
    </div>
  </div>
);

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App Layout Shell */}
          <Route path="/" element={<AppShell />}>
            {/* Complete Unified Command Center */}
            <Route index element={<UnifiedPortal />} />

            {/* Dedicated Standalone Sub-Routes */}
            <Route path="report" element={<StandaloneCitizenPage />} />
            <Route path="nearby" element={<NearbyIssuesView />} />
            <Route path="login" element={<AdminLogin />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute>
                  <StandaloneAdminPage />
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
