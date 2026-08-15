import React from "react";
import { FileText, Tag, Plus } from "lucide-react";
import InputField from "../../src/components/ui/InputField";

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
      {/* Primary Description Input */}
      <InputField
        as="textarea"
        id="issue-description"
        label="Issue Description"
        rows={4}
        maxLength={300}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={disabled}
        required
        placeholder="Describe the issue (e.g., Deep pothole near sector 4 crossing causing traffic delay)..."
        icon={FileText}
      />

      {/* Quick Suggestion Pills */}
      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-wider text-gov-muted mb-2 flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-gov-muted" />
          <span>Quick Issue Tags (tap to append):</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              disabled={disabled}
              className="text-xs bg-gov-surface hover:bg-gov-navy hover:text-white border border-gov-border text-gov-navy font-semibold py-1 px-2.5 rounded transition-colors active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
