import React from "react";

/**
 * SuccessScreen Component
 * Displays post-submission confirmation, AI-triage breakdown, and reference details.
 */
export default function SuccessScreen({ submittedData, onReset }) {
  const data = submittedData?.data || submittedData || {};
  const issueId = data._id || `JH-${Math.floor(100000 + Math.random() * 900000)}`;
  const category = data.category || "General Civic Issue";
  const severity = data.severity || "Medium";
  const status = data.status || "Pending";

  const getSeverityBadge = (sev) => {
    switch (sev?.toLowerCase()) {
      case "high":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fadeIn min-h-[80vh]">
      {/* Animated Success Badge */}
      <div className="w-20 h-20 mb-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-md ring-8 ring-emerald-50">
        <svg
          className="w-10 h-10 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
        Report Submitted!
      </h2>
      <p className="text-sm text-slate-600 mt-1 max-w-xs">
        Thank you for helping keep Jharkhand clean, safe, and well-maintained.
      </p>

      {/* Ticket Details Card */}
      <div className="w-full bg-white rounded-2xl p-5 mt-6 border border-slate-200 shadow-sm text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Issue ID
          </span>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            #{issueId.slice(-8)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 py-3 border-b border-slate-100 text-sm">
          <div>
            <span className="text-xs text-slate-500 block">AI Category</span>
            <span className="font-semibold text-slate-800 mt-0.5 inline-block">
              📁 {category}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Severity Score</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${getSeverityBadge(
                severity
              )}`}
            >
              ● {severity}
            </span>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Routing Status:</span>
          <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            ⏳ {status} Review
          </span>
        </div>
      </div>

      {/* Flow next step notice */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-center gap-2">
        <span>🤖</span>
        <span>
          Auto-triaged by Groq Vision AI and routed to the municipal team.
        </span>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full mt-6 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-lg shadow-lg shadow-emerald-600/30 transition duration-200 flex items-center justify-center gap-2"
      >
        <span>📸</span> Report Another Issue
      </button>
    </div>
  );
}
