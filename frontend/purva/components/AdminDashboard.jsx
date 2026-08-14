import React from 'react';
import { LayoutDashboard, CheckCircle2, Clock, AlertTriangle, MapPin } from 'lucide-react';
import { useAuth } from '../../tanmay/context/AuthContext';

/**
 * AdminDashboard (Purva's Module Placeholder / Initial Interface)
 * Desktop-optimized Kanban & Map container for municipal authorities.
 */
export const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
              Authenticated Session
            </span>
            <span className="text-xs text-slate-500">Logged in as {user?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Municipal Operations Dashboard
          </h1>
        </div>
      </div>

      {/* Stats Cards Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Issues</div>
            <div className="text-2xl font-black text-slate-900">12</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</div>
            <div className="text-2xl font-black text-slate-900">5</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved</div>
            <div className="text-2xl font-black text-slate-900">28</div>
          </div>
        </div>
      </div>

      {/* Module Workspace Notification */}
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <LayoutDashboard className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Purva's Dashboard Module Area
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
          This protected route successfully verified authentication. Purva will mount the Kanban Board columns, Issue Cards, Leaflet Map View, and status update modals here.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
