import React from 'react';
import IssueCard from './IssueCard';

const STATUS_ICONS = {
  Pending: (
    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'In Progress': (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Resolved: (
    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export const KanbanColumn = ({ status, issues = [], onCardClick }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-xl flex flex-col min-h-[500px] border border-gray-200/70">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {STATUS_ICONS[status]}
          <h3 className="font-semibold text-sm text-gray-800 tracking-wide">{status}</h3>
        </div>
        <span className="bg-white text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full border border-gray-200 shadow-2xs">
          {issues.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {issues.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
            <span>No issues {status.toLowerCase()}</span>
          </div>
        ) : (
          issues.map((issue) => (
            <IssueCard key={issue._id || issue.id} issue={issue} onClick={onCardClick} />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
