import React from "react";

/**
 * SubmissionForm Component
 * Renders description input, quick tags, and validation hints for mobile issue submission.
 */
export default function SubmissionForm({
  description,
  onDescriptionChange,
  disabled = false
}) {
  const quickTags = [
    "Pothole on road",
    "Overflowing garbage bin",
    "Broken streetlight",
    "Water pipeline leakage",
    "Fallen tree blocking path"
  ];

  const handleTagClick = (tag) => {
    if (disabled) return;
    if (!description.trim()) {
      onDescriptionChange(tag);
    } else if (!description.includes(tag)) {
      onDescriptionChange(`${description.trim()}, ${tag.toLowerCase()}`);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="issue-description"
          className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"
        >
          <span className="text-emerald-600">📝</span> Issue Details <span className="text-rose-500">*</span>
        </label>
        <span className="text-xs text-slate-400 font-mono">
          {description.length}/300
        </span>
      </div>

      {/* Primary Description Input */}
      <div className="relative">
        <textarea
          id="issue-description"
          rows={4}
          maxLength={300}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={disabled}
          placeholder="Describe the issue (e.g., Deep pothole near sector 4 crossing causing traffic delay)..."
          className="w-full p-4 border border-slate-300 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition shadow-sm resize-none disabled:bg-slate-100 disabled:opacity-75"
        />
      </div>

      {/* Quick Suggestion Pills */}
      <div className="mt-2.5">
        <p className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1">
          <span>⚡</span> Quick Issue Tags (tap to append):
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              disabled={disabled}
              className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-700 py-1 px-2.5 rounded-lg transition active:scale-95 disabled:opacity-50"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
