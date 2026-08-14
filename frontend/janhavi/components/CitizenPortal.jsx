import React from 'react';
import { Camera, MapPin, Send, Sparkles } from 'lucide-react';

/**
 * CitizenPortal (Janhavi's Module Placeholder / Initial Interface)
 * Mobile-first civic issue reporting container.
 */
export const CitizenPortal = () => {
  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 flex flex-col items-center">
      {/* Welcome Banner */}
      <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl p-5 shadow-lg shadow-emerald-500/20 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-emerald-200" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">
            Citizen Reporting Portal
          </span>
        </div>
        <h2 className="text-xl font-extrabold leading-tight">
          Report a Civic Issue in Jharkhand
        </h2>
        <p className="text-xs text-emerald-100 mt-1">
          Take a photo, capture GPS location, and let AI automatically triage to the right department.
        </p>
      </div>

      {/* Quick Action Preview Card */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
          <Camera className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-800 text-base mb-1">
          Janhavi's Tasks Module Area
        </h3>
        <p className="text-xs text-slate-500 mb-6 max-w-xs">
          This container will host the camera input, geolocation fetcher, description form, and Groq AI triage submission.
        </p>

        <div className="w-full space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-700">GPS Auto-Location</div>
              <div className="text-[11px] text-slate-400">High-accuracy geolocation tagging</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-left">
            <Send className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-700">AI Auto-Triage</div>
              <div className="text-[11px] text-slate-400">Categorization & severity estimation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenPortal;
