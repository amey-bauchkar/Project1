import React from 'react';

const SEVERITY_BORDER_CLASSES = {
  High: 'border-red-500',
  Medium: 'border-yellow-500',
  Low: 'border-blue-500'
};

const SEVERITY_BADGE_CLASSES = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  Low: 'bg-blue-50 text-blue-700 border-blue-200'
};

const CATEGORY_COLORS = {
  Roads: 'bg-amber-100 text-amber-800',
  Water: 'bg-cyan-100 text-cyan-800',
  Sanitation: 'bg-emerald-100 text-emerald-800',
  Electricity: 'bg-purple-100 text-purple-800',
  Other: 'bg-slate-100 text-slate-800'
};

export const IssueCard = ({ issue, onClick }) => {
  const { category, imageUrl, createdAt, severity, description } = issue;
  
  const borderClass = SEVERITY_BORDER_CLASSES[severity] || 'border-gray-400';
  const badgeClass = SEVERITY_BADGE_CLASSES[severity] || 'bg-gray-50 text-gray-700 border-gray-200';
  const categoryClass = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800';

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recently';

  return (
    <div
      onClick={() => onClick(issue)}
      className={`bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg p-3 mb-3 cursor-pointer border-l-4 ${borderClass} border-t border-r border-b border-gray-100`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryClass}`}>
          {category}
        </span>
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${badgeClass}`}>
          {severity}
        </span>
      </div>

      <div className="flex gap-3 items-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={category}
            className="w-14 h-14 object-cover rounded-md flex-shrink-0 bg-gray-100 border border-gray-200"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-14 h-14 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
            No image
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed">
            {description}
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-400">
            <span>{formattedDate}</span>
            <span className="text-emerald-600 font-medium hover:underline">View details &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
