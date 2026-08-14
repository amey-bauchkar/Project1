import React, { useState } from 'react';
import { X, Tag, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Button, Badge } from '../../src/components/ui';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved'];

const SEVERITY_BADGE_VARIANTS = {
  High: 'danger',
  Medium: 'warning',
  Low: 'info',
};

export const IssueModal = ({ issue, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !issue) return null;

  const [selectedStatus, setSelectedStatus] = useState(issue.status || 'Pending');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (selectedStatus === issue.status) {
      onClose();
      return;
    }
    setIsUpdating(true);
    await onUpdateStatus(issue._id || issue.id, selectedStatus);
    setIsUpdating(false);
    onClose();
  };

  const severityVariant = SEVERITY_BADGE_VARIANTS[issue.severity] || 'surface';
  const lat = issue.location?.coordinates ? issue.location.coordinates[1] : null;
  const lng = issue.location?.coordinates ? issue.location.coordinates[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gov-navy/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl shadow-elevated max-w-2xl w-full overflow-hidden border border-gov-border flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gov-border bg-gov-surface">
          <div className="flex items-center gap-3">
            <span className="font-black text-gov-navy text-base tracking-tight uppercase">
              Grievance Detail
            </span>
            <Badge variant="surface" size="xs">
              {issue.category}
            </Badge>
            <Badge variant={severityVariant} size="xs">
              {issue.severity} Priority
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="text-gov-muted hover:text-gov-navy rounded-lg p-1 hover:bg-gov-border transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Image */}
          {issue.imageUrl && (
            <div className="w-full h-64 rounded-lg overflow-hidden bg-gov-navy flex items-center justify-center border border-gov-border">
              <img
                src={issue.imageUrl}
                alt={issue.category}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-1.5">
              Citizen Description
            </h4>
            <p className="text-sm text-gov-text-body bg-gov-surface p-4 rounded-lg border border-gov-border leading-relaxed font-medium">
              {issue.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-gov-surface p-3.5 rounded-lg border border-gov-border">
              <span className="text-[10px] uppercase font-bold text-gov-muted block mb-0.5 tracking-wider">Report Timestamp</span>
              <span className="font-bold text-gov-navy">
                {issue.createdAt ? new Date(issue.createdAt).toLocaleString('en-IN') : 'N/A'}
              </span>
            </div>

            <div className="bg-gov-surface p-3.5 rounded-lg border border-gov-border">
              <span className="text-[10px] uppercase font-bold text-gov-muted block mb-0.5 tracking-wider">Geographic Coordinates</span>
              <span className="font-mono font-bold text-gov-navy">
                {lat != null && lng != null ? `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E` : 'Not Available'}
              </span>
            </div>
          </div>

          {/* Status Update Control */}
          <div className="pt-2 border-t border-gov-border">
            <label className="block text-xs font-bold text-gov-navy uppercase tracking-wider mb-2">
              Update Resolution Workflow Status
            </label>
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 bg-white border border-gov-border rounded-lg px-3.5 py-2.5 text-sm font-bold text-gov-navy focus:outline-none focus:ring-2 focus:ring-gov-navy"
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gov-surface border-t border-gov-border flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            loading={isUpdating}
            icon={CheckCircle2}
          >
            Save Status
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
