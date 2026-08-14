import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  KeyRound,
  ArrowLeft 
} from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Attempt call to Amey's backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token || 'jwt_token_jharkhand_admin_' + Date.now();
        const userData = {
          email: email.trim(),
          role: data.role || 'admin',
        };
        login(token, userData);
        navigate(redirectPath, { replace: true });
        return;
      }

      if (response.status === 401) {
        setError('Invalid credentials');
        return;
      }

      // If backend is offline / 502 / 504 gateway error from dev proxy
      if (response.status >= 500 || response.status === 502 || response.status === 504) {
        if (email.trim() === 'admin@jharkhand.gov' && password.trim() === 'password123') {
          const demoToken = 'mock_jwt_token_jharkhand_admin_' + Date.now();
          login(demoToken, { email: 'admin@jharkhand.gov', role: 'admin' });
          navigate(redirectPath, { replace: true });
          return;
        }
        setError('Invalid credentials');
        return;
      }

      const errData = await response.json().catch(() => ({}));
      setError(errData.message || 'Invalid credentials');
    } catch (err) {
      console.warn('Backend server not reachable on /api/auth/login. Using demo fallback:', err);
      
      // Standalone development fallback for IGNITE 8.0 demo testing
      if (email.trim() === 'admin@jharkhand.gov' && password.trim() === 'password123') {
        const demoToken = 'mock_jwt_token_jharkhand_admin_' + Date.now();
        login(demoToken, { email: 'admin@jharkhand.gov', role: 'admin' });
        navigate(redirectPath, { replace: true });
      } else {
        setError('Invalid credentials');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@jharkhand.gov');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Top return link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Citizen Portal
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Authority Portal Login
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Municipal Authorities & Department Admin Access
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div 
              role="alert"
              className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-700 text-sm font-medium animate-in fade-in duration-200"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label 
                htmlFor="admin-email" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Government Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  required
                  placeholder="admin@jharkhand.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Badge for Testing */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>Click to Autofill Demo Credentials</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
