import React from "react";
import { CheckCircle2, Tag, AlertCircle, Clock, Cpu, Camera } from "lucide-react";
import { Card, Badge, Button } from "../../src/components/ui";

/**
 * SuccessScreen Component
 * Displays post-submission confirmation, AI-triage breakdown, and reference details.
 */
export default function SuccessScreen({ submittedData, onReset }) {
  const data = submittedData?.data || submittedData || {};
  const issueId = data._id || `JH-${Math.floor(100000 + Math.random() * 900000)}`;
  const category = data.category || "Roads";
  const severity = data.severity || "Medium";
  const status = data.status || "Pending";

  const getSeverityBadgeVariant = (sev) => {
    switch (sev?.toLowerCase()) {
      case "high":
        return "danger";
      case "low":
        return "info";
      default:
        return "warning";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fadeIn min-h-[75vh]">
      {/* Success Badge */}
      <div className="w-16 h-16 mb-5 rounded-xl bg-gov-navy text-gov-accent flex items-center justify-center shadow-card">
        <CheckCircle2 className="w-9 h-9" />
      </div>

      <h2 className="text-2xl font-black text-gov-navy tracking-tight">
        Grievance Report Submitted
      </h2>
      <p className="text-xs text-gov-muted mt-1 max-w-xs font-medium">
        Your issue has been recorded in the Government of Jharkhand Municipal Grievance Database.
      </p>

      {/* Ticket Details Card */}
      <Card variant="white" padding="md" className="w-full mt-6 text-left border-gov-border shadow-card">
        <div className="flex items-center justify-between pb-3 border-b border-gov-border">
          <span className="text-xs font-bold uppercase tracking-widest text-gov-muted">
            Tracking ID
          </span>
          <span className="text-xs font-mono font-bold text-gov-navy bg-gov-surface px-2.5 py-1 rounded border border-gov-border">
            #{String(issueId).slice(-8)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3.5 border-b border-gov-border text-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gov-muted block">AI Category</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Tag className="w-3.5 h-3.5 text-gov-navy" />
              <span className="font-bold text-gov-navy text-xs uppercase tracking-wider">{category}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gov-muted block">Severity Score</span>
            <div className="mt-1">
              <Badge variant={getSeverityBadgeVariant(severity)} size="xs">
                {severity} Priority
              </Badge>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-between text-xs">
          <span className="text-gov-muted font-medium">Routing Status:</span>
          <Badge variant="warning" size="xs" icon={Clock}>
            {status} Review
          </Badge>
        </div>
      </Card>

      {/* Notice box */}
      <div className="mt-4 p-3.5 rounded-lg bg-gov-surface border border-gov-border text-gov-muted text-xs flex items-center gap-2.5 w-full text-left">
        <Cpu className="w-4 h-4 text-gov-navy flex-shrink-0" />
        <span className="font-medium">
          Auto-triaged by Groq Vision AI and dispatched to municipal field personnel.
        </span>
      </div>

      {/* Action Button */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        onClick={onReset}
        icon={Camera}
        className="mt-6"
      >
        Submit Another Report
      </Button>
    </div>
  );
}
