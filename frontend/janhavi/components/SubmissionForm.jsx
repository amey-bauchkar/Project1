import React from "react";
import { FileText, Tag, Plus } from "lucide-react";
import InputField from "../../src/components/ui/InputField";
import { useLanguage } from "../../tanmay/i18n/LanguageContext";

/**
 * SubmissionForm Component with i18n
 * Renders description input, quick tags, and validation hints for mobile issue submission.
 */
export default function SubmissionForm({
  description,
  onDescriptionChange,
  disabled = false
}) {
  const { t } = useLanguage();

  const quickTags = [
    { key: 'report.tagPothole', defaultVal: 'Pothole on road' },
    { key: 'report.tagGarbage', defaultVal: 'Overflowing garbage bin' },
    { key: 'report.tagLight', defaultVal: 'Broken streetlight' },
    { key: 'report.tagWater', defaultVal: 'Water pipeline leakage' },
    { key: 'report.tagTree', defaultVal: 'Fallen tree blocking path' },
  ];

  const handleTagClick = (tagLabel) => {
    if (disabled) return;
    if (!description.trim()) {
      onDescriptionChange(tagLabel);
    } else if (!description.includes(tagLabel)) {
      onDescriptionChange(`${description.trim()}, ${tagLabel.toLowerCase()}`);
    }
  };

  return (
    <div className="w-full mb-6 font-sans">
      {/* Primary Description Input */}
      <InputField
        as="textarea"
        id="issue-description"
        label={t('report.issueDesc')}
        rows={4}
        maxLength={300}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={disabled}
        required
        placeholder={t('report.descPlaceholder')}
        icon={FileText}
      />

      {/* Quick Suggestion Pills */}
      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-wider text-gov-muted mb-2 flex items-center gap-1.5">
          <Tag className="w-3 h-3 text-gov-muted" />
          <span>{t('report.quickTagsLabel')}</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {quickTags.map((tagObj) => {
            const tagLabel = t(tagObj.key);
            return (
              <button
                key={tagObj.key}
                type="button"
                onClick={() => handleTagClick(tagLabel)}
                disabled={disabled}
                className="text-xs bg-gov-surface hover:bg-gov-navy hover:text-white border border-gov-border text-gov-navy font-semibold py-1 px-2.5 rounded transition-colors active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{tagLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
