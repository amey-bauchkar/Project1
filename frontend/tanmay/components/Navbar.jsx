import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Globe2, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  FilePlus, 
  LayoutDashboard,
  Check
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentLang, setCurrentLang] = useState('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCitizenView = location.pathname === '/';
  const isAdminView = location.pathname.startsWith('/admin');
  const isLoginView = location.pathname === '/login';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  Jharkhand <span className="text-emerald-600">Civic Report</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Govt. of Jharkhand
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:inline-block">
                Crowdsourced Civic Issue Reporting & Resolution System
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Contextual) */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isCitizenView 
                  ? 'text-emerald-700 bg-emerald-50 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              Report Issue
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isAdminView 
                    ? 'text-emerald-700 bg-emerald-50 font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher UI Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                title="Change Language"
                aria-label="Language Selector"
              >
                <Globe2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase">{currentLang === 'en' ? 'EN' : 'HI'}</span>
              </button>

              {langMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setLangMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => { setCurrentLang('en'); setLangMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-left font-medium"
                  >
                    <span>English</span>
                    {currentLang === 'en' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCurrentLang('hi'); setLangMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 text-left font-medium"
                  >
                    <span>हिंदी (Hindi)</span>
                    {currentLang === 'hi' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Action Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[120px]">{user?.email?.split('@')[0] || 'Admin'}</span>
                </div>
                
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all ${
                  isLoginView
                    ? 'bg-slate-800 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md hover:shadow-emerald-600/20'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
