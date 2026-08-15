import React, { useState } from "react";
import { Building2, Send, AlertCircle, Loader2, CheckCircle2, Shield, ThumbsUp, ArrowRight, X } from "lucide-react";
import CameraCapture from "./CameraCapture";
import LocationPicker from "./LocationPicker";
import SubmissionForm from "./SubmissionForm";
import SuccessScreen from "./SuccessScreen";
import Button from "../../src/components/ui/Button";
import { useLanguage } from "../../tanmay/i18n/LanguageContext";
import { upvoteIssue } from "../../tanmay/services/nearbyService";

/**
 * CitizenPortal Component
 * Mobile-first civic issue reporting container with camera capture, GPS acquisition,
 * duplicate detection, Groq Vision AI analysis, honeypot spam protection, and multilingual i18n.
 */
export default function CitizenPortal({ apiBaseUrl = "" }) {
  const { t } = useLanguage();
  const [imageFile, setImageFile] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [description, setDescription] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  // Duplicate detection state
  const [duplicateData, setDuplicateData] = useState(null);
  const [upvotedDuplicateIds, setUpvotedDuplicateIds] = useState([]);

  const handleImageSelected = (file) => {
    setImageFile(file);
    setErrorMessage(null);
  };

  const handleImageRemoved = () => {
    setImageFile(null);
  };

  const handleLocationChange = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
    setErrorMessage(null);
  };

  const handleResetForm = () => {
    setImageFile(null);
    setLatitude(null);
    setLongitude(null);
    setDescription("");
    setHoneypot("");
    setErrorMessage(null);
    setSubmittedData(null);
    setDuplicateData(null);
    setUpvotedDuplicateIds([]);
  };

  const handleSubmit = async (e, force = false) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!imageFile) {
      setErrorMessage("Photo evidence is required! Please snap or upload an image of the issue.");
      return;
    }

    if (latitude === null || longitude === null) {
      setErrorMessage("GPS Location is required! Please tap 'Tag Current GPS Location'.");
      return;
    }

    if (description.trim().length < 20) {
      setErrorMessage("Description must be at least 20 characters long for accurate AI triage.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("description", description.trim());
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      if (honeypot) formData.append("website", honeypot);
      if (force) formData.append("force", "true");

      const endpoint = `${apiBaseUrl}/api/issues`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Server error (${response.status})`);
      }

      // Check if duplicate detected and not forced
      if (result.isDuplicate && !force && result.existingIssues?.length > 0) {
        setDuplicateData(result);
        setIsSubmitting(false);
        return;
      }

      setSubmittedData(result);
      setDuplicateData(null);
    } catch (err) {
      console.error("Submission Error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvoteDuplicate = async (issueId) => {
    try {
      await upvoteIssue(issueId);
      setUpvotedDuplicateIds((prev) => [...prev, issueId]);
    } catch (err) {
      console.error("Failed to upvote duplicate issue:", err);
    }
  };

  // If successfully submitted, show SuccessScreen
  if (submittedData) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-card border border-gov-border">
        <SuccessScreen submittedData={submittedData} onReset={handleResetForm} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-card border border-gov-border flex flex-col font-sans relative pb-6 antialiased">
      {/* Header Banner */}
      <header className="bg-gov-surface border-b border-gov-border px-5 py-4 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gov-navy text-gov-accent flex items-center justify-center shadow-soft font-bold text-sm flex-shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-gov-navy leading-none uppercase tracking-wide">
                {t('report.title')}
              </h2>
              <p className="text-[11px] font-medium text-gov-muted mt-0.5">
                {t('report.tagline')}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-gov-navy text-gov-accent px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
            {t('report.publicForm')}
          </span>
        </div>

        {/* Step Indicators */}
        <div className="mt-3.5 grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider">
          <div
            className={`py-1.5 rounded border transition-colors ${
              imageFile
                ? "bg-gov-navy text-gov-accent border-gov-navy"
                : "bg-white text-gov-muted border-gov-border"
            }`}
          >
            {imageFile ? `✓ ${t('report.stepPhoto').replace(' *', '')}` : t('report.stepPhoto')}
          </div>
          <div
            className={`py-1.5 rounded border transition-colors ${
              latitude !== null
                ? "bg-gov-navy text-gov-accent border-gov-navy"
                : "bg-white text-gov-muted border-gov-border"
            }`}
          >
            {latitude !== null ? `✓ ${t('report.stepGps').replace(' *', '')}` : t('report.stepGps')}
          </div>
          <div
            className={`py-1.5 rounded border transition-colors ${
              description.trim().length >= 20
                ? "bg-gov-navy text-gov-accent border-gov-navy"
                : "bg-white text-gov-muted border-gov-border"
            }`}
          >
            {description.trim().length >= 20 ? `✓ ${t('report.stepDetails').replace(' *', '')}` : t('report.stepDetails')}
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <div className="p-5 flex-1">
        {/* Error / Validation Toast */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-soft">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Submission Incomplete</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-900 font-bold text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Duplicate Detection Modal / Warning */}
        {duplicateData && (
          <div className="mb-5 p-4 rounded-xl bg-amber-50 border-2 border-amber-300 shadow-card animate-fadeIn">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <h3 className="text-sm font-black text-amber-900">{t('duplicate.title')}</h3>
              </div>
              <button
                onClick={() => setDuplicateData(null)}
                className="text-amber-700 hover:text-amber-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-amber-800 mt-1 font-medium">
              {t('duplicate.message')}
            </p>

            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {duplicateData.existingIssues.map((dup) => (
                <div
                  key={dup._id}
                  className="p-3 bg-white rounded-lg border border-amber-200 text-xs flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gov-navy truncate">{dup.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gov-muted mt-0.5">
                      <span className="font-mono">#{dup.trackingId || dup._id.slice(-6)}</span>
                      <span>•</span>
                      <span>{dup.status}</span>
                      <span>•</span>
                      <span>👍 {dup.upvotes || 0}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpvoteDuplicate(dup._id)}
                    disabled={upvotedDuplicateIds.includes(dup._id)}
                    className={`px-3 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                      upvotedDuplicateIds.includes(dup._id)
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                        : "bg-gov-navy text-white hover:bg-gov-navy/90"
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    {upvotedDuplicateIds.includes(dup._id) ? "Upvoted ✓" : t('duplicate.upvoteExisting')}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                className="text-xs font-bold text-amber-900 hover:text-amber-950 underline px-2 py-1"
              >
                {t('duplicate.submitAnyway')}
              </button>
            </div>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, false)}>
          {/* Honeypot field for bot protection */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: "none" }}
            tabIndex="-1"
            autoComplete="off"
          />

          {/* Step 1: Camera / File Input */}
          <CameraCapture
            imageFile={imageFile}
            onImageSelected={handleImageSelected}
            onImageRemoved={handleImageRemoved}
            disabled={isSubmitting}
          />

          {/* Step 2: Live Geolocation */}
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onLocationChange={handleLocationChange}
            disabled={isSubmitting}
          />

          {/* Step 3: Description & Suggestions */}
          <SubmissionForm
            description={description}
            onDescriptionChange={setDescription}
            disabled={isSubmitting}
          />

          {/* Submit Action Button */}
          <Button
            type="submit"
            variant="accent"
            size="lg"
            fullWidth
            loading={isSubmitting}
            icon={Send}
            iconPosition="right"
            className="font-black text-sm uppercase tracking-wider py-3.5 shadow-card"
          >
            {isSubmitting ? t('report.submitting') : t('report.submit')}
          </Button>

          {isSubmitting && (
            <p className="text-[11px] text-center text-gov-muted mt-2 font-medium">
              {t('report.triageNote')}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
