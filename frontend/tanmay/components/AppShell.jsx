import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Fixed Global Navbar */}
      <Navbar />

      {/* Main Content Area with top offset for fixed Navbar */}
      <main className="flex-1 pt-16 flex flex-col">
        {children || <Outlet />}
      </main>

      {/* Minimal Civic Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Government of Jharkhand — Department of Urban Development & Housing</span>
          <span className="text-slate-400">SIH 2025 • SIH25031</span>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
