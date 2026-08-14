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
import Button from '../../src/components/ui/Button';

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

  const isCitizenView = location.pathname === '/' || location.pathname === '/report';
  const isAdminView = location.pathname.startsWith('/admin');
  const isLoginView = location.pathname === '/login';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gov-border shadow-soft transition-all duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Title */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-gov-navy rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-gov-navy text-gov-accent flex items-center justify-center font-bold text-lg shadow-soft group-hover:bg-gov-navy-light transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-gov-navy tracking-tight">
                  Jharkhand <span className="text-gov-muted">Civic Portal</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gov-surface text-gov-navy border border-gov-border uppercase tracking-wider">
                  Govt. of Jharkhand
                </span>
              </div>
              <span className="text-[11px] text-gov-muted font-medium -mt-0.5 hidden sm:inline-block">
                Crowdsourced Civic Issue Reporting & Resolution System
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Contextual) */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                location.pathname === '/' 
                  ? 'text-gov-navy bg-gov-surface font-extrabold border border-gov-border' 
                  : 'text-gov-muted hover:text-gov-navy hover:bg-gov-surface'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Command Center</span>
            </Link>

            <Link
              to="/report"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                location.pathname === '/report' 
                  ? 'text-gov-navy bg-gov-surface font-extrabold border border-gov-border' 
                  : 'text-gov-muted hover:text-gov-navy hover:bg-gov-surface'
              }`}
            >
              <FilePlus className="w-4 h-4" />
              <span>Citizen Report</span>
            </Link>

            {isAuthenticated && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  isAdminView 
                    ? 'text-gov-navy bg-gov-surface font-extrabold border border-gov-border' 
                    : 'text-gov-muted hover:text-gov-navy hover:bg-gov-surface'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Triage</span>
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
                className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold uppercase tracking-wider text-gov-navy bg-gov-surface hover:bg-slate-200 rounded-lg transition-colors border border-gov-border"
                title="Change Language"
                aria-label="Language Selector"
              >
                <Globe2 className="w-3.5 h-3.5 text-gov-muted" />
                <span>{currentLang === 'en' ? 'EN' : 'HI'}</span>
              </button>

              {langMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-elevated border border-gov-border py-1.5 z-50 animate-in fade-in duration-100"
                  onMouseLeave={() => setLangMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => { setCurrentLang('en'); setLangMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-gov-text-main hover:bg-gov-surface text-left font-bold"
                  >
                    <span>English</span>
                    {currentLang === 'en' && <Check className="w-3.5 h-3.5 text-gov-navy" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCurrentLang('hi'); setLangMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-gov-text-main hover:bg-gov-surface text-left font-bold"
                  >
                    <span>हिंदी (Hindi)</span>
                    {currentLang === 'hi' && <Check className="w-3.5 h-3.5 text-gov-navy" />}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Action Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gov-navy bg-gov-surface border border-gov-border rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-gov-navy" />
                  <span className="truncate max-w-[120px]">{user?.email?.split('@')[0] || 'Admin'}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                  className="text-xs"
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant={isLoginView ? 'secondary' : 'primary'}
                  size="sm"
                  icon={LogIn}
                  className="font-bold text-xs"
                >
                  <span>Admin Login</span>
                </Button>
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
