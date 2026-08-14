import React, { useState } from 'react';
import { useAuth } from '../tanmay/context/AuthContext';
import CitizenPortal from '../janhavi/components/CitizenPortal';
import AdminDashboard from '../purva/components/AdminDashboard';
import AdminLogin from '../tanmay/components/AdminLogin';
import { FilePlus, LayoutDashboard, Sparkles, Shield, MapPin, CheckCircle, Smartphone, Monitor } from 'lucide-react';

export const UnifiedPortal = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('both'); // 'citizen', 'admin', or 'both'

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-12">
      {/* Top Banner with Quick Switcher */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white border-b border-emerald-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-300" /> SIH25031 Practice System
                </span>
                <span className="text-xs text-emerald-200">Live AI-Triage & Realtime MERN Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                Jharkhand Crowdsourced Civic Command Center
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5">
                Complete unified system combining Citizen Mobile Photo/GPS Reporting & Municipal Operations Kanban/Map.
              </p>
            </div>

            {/* View Toggle Tabs */}
            <div className="flex items-center bg-emerald-950/50 p-1.5 rounded-xl border border-emerald-600/40 backdrop-blur-sm self-start md:self-auto">
              <button
                onClick={() => setActiveTab('both')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'both'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Split View</span>
              </button>
              <button
                onClick={() => setActiveTab('citizen')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'citizen'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Citizen Mobile View</span>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-white text-emerald-900 shadow-sm'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-800/50'
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Operations</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Unified Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Case 1: Split View (Both Citizen Mobile + Admin Dashboard Side-by-Side) */}
        {activeTab === 'both' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Citizen Mobile Experience */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200 sticky top-20">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    📱
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-none">Citizen Reporting</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Mobile-optimized interface</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Janhavi's Module
                </span>
              </div>

              {/* Citizen Reporting Component */}
              <div className="max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                <CitizenPortal apiBaseUrl="http://localhost:5000" />
              </div>
            </div>

            {/* Right Column: Municipal Operations Dashboard */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    🏛️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-none">Municipal Command & Map</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Live triage Kanban & Leaflet spatial clustering</p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                  Purva's Module
                </span>
              </div>

              {/* Municipal Admin Dashboard Component */}
              <AdminDashboard />
            </div>
          </div>
        )}

        {/* Case 2: Citizen Mobile View Only */}
        {activeTab === 'citizen' && (
          <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 shadow-md border border-slate-200">
            <CitizenPortal apiBaseUrl="http://localhost:5000" />
          </div>
        )}

        {/* Case 3: Admin Operations Only */}
        {activeTab === 'admin' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <AdminDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedPortal;
