import React, { useState } from 'react';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved'];

const SEVERITY_BADGE_CLASSES = {
  High: 'bg-red-100 text-red-800 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Low: 'bg-blue-100 text-blue-800 border-blue-200'
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

  const badgeClass = SEVERITY_BADGE_CLASSES[issue.severity] || 'bg-gray-100 text-gray-800';

  const lat = issue.location?.coordinates ? issue.location.coordinates[1] : null;
  const lng = issue.location?.coordinates ? issue.location.coordinates[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900 text-base">
              Issue Details
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              {issue.category}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded border ${badgeClass}`}>
              {issue.severity} Severity
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-200/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Image */}
          {issue.imageUrl && (
            <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-gray-200">
              <img
                src={issue.imageUrl}
                alt={issue.category}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Description
            </h4>
            <p className="text-sm text-gray-800 bg-slate-50 p-3.5 rounded-xl border border-gray-200 leading-relaxed">
              {issue.description}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-500 block mb-0.5 font-medium">Reported At</span>
              <span className="font-semibold text-gray-800">
                {issue.createdAt ? new Date(issue.createdAt).toLocaleString('en-IN') : 'N/A'}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-gray-500 block mb-0.5 font-medium">Geo Coordinates</span>
              <span className="font-mono text-gray-800">
                {lat != null && lng != null ? `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E` : 'Not Available'}
              </span>
            </div>
          </div>

          {/* Status Update Control */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Update Resolution Status
            </label>
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3.5 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-2xs"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
