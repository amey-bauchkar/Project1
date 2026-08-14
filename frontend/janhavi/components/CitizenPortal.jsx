import React, { useState } from "react";
import CameraCapture from "./CameraCapture";
import LocationPicker from "./LocationPicker";
import SubmissionForm from "./SubmissionForm";
import SuccessScreen from "./SuccessScreen";

/**
 * CitizenPortal Component (Main Container for Janhavi's Module)
 * Mobile-first civic issue reporting container with camera capture, GPS acquisition,
 * Groq AI analysis indicator, and multipart FormData submission.
 */
export default function CitizenPortal({ apiBaseUrl = "" }) {
  const [imageFile, setImageFile] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

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
    setErrorMessage(null);
    setSubmittedData(null);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    // Validation according to specifications
    if (!imageFile) {
      setErrorMessage("Photo is required! Please snap or upload an image of the issue.");
      return;
    }

    if (latitude === null || longitude === null) {
      setErrorMessage("GPS Location is required! Please tap 'Get My Live Location'.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Construct multipart/form-data payload
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("description", description.trim() || "Civic issue reported via citizen mobile portal");
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      const endpoint = `${apiBaseUrl}/api/issues`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData
        // Content-Type is set automatically by the browser with correct multipart boundary
      });

      if (!response.ok) {
        let errDetail = "Failed to submit issue";
        try {
          const errData = await response.json();
          errDetail = errData.message || errData.error || errDetail;
        } catch {
          errDetail = `Server responded with status ${response.status}`;
        }
        throw new Error(errDetail);
      }

      const result = await response.json();
      setSubmittedData(result);
    } catch (err) {
      console.error("Submission Error:", err);
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        setErrorMessage(
          "Backend server not reachable at /api/issues. Ensure Amey's backend is running on port 5000."
        );
      } else {
        setErrorMessage(err.message || "An unexpected error occurred during submission.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already successfully submitted, show SuccessScreen
  if (submittedData) {
    return (
      <main className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col font-sans">
        <SuccessScreen submittedData={submittedData} onReset={handleResetForm} />
      </main>
    );
  }

  const isFormIncomplete = !imageFile || latitude === null || longitude === null;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-slate-50 flex flex-col font-sans relative pb-28 antialiased">
      {/* Header Banner */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-5 py-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md font-bold text-lg">
              🏛️
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-none">
                Jharkhand Civic Report
              </h1>
              <p className="text-[11px] font-medium text-emerald-700 mt-0.5">
                Clean & Green Jharkhand Initiative
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Citizen
          </span>
        </div>

        {/* Step Indicators */}
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[11px] font-medium">
          <div
            className={`py-1 rounded-md transition-colors ${
              imageFile
                ? "bg-emerald-100 text-emerald-800 font-semibold"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {imageFile ? "✓ Photo" : "1. Photo *"}
          </div>
          <div
            className={`py-1 rounded-md transition-colors ${
              latitude !== null
                ? "bg-emerald-100 text-emerald-800 font-semibold"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {latitude !== null ? "✓ GPS" : "2. GPS *"}
          </div>
          <div
            className={`py-1 rounded-md transition-colors ${
              description.trim().length > 0
                ? "bg-emerald-100 text-emerald-800 font-semibold"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {description.trim().length > 0 ? "✓ Details" : "3. Details"}
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <div className="p-4 flex-1">
        {/* Error / Validation Toast */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-sm animate-fadeIn">
            <span className="text-base leading-none">🚨</span>
            <div className="flex-1">
              <p className="font-bold">Cannot Submit Report</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 font-bold text-sm"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
        </form>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-white via-white/95 to-transparent pt-3 pb-4 px-4 z-40 max-w-md mx-auto">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2.5 transition-all duration-200 ${
            isSubmitting
              ? "bg-emerald-700 text-white cursor-wait opacity-95"
              : isFormIncomplete
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-[0.98]"
              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/40 active:scale-[0.98]"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Analyzing Issue with AI...</span>
            </>
          ) : (
            <>
              <span>🚀 Submit Civic Report</span>
            </>
          )}
        </button>

        {isSubmitting && (
          <p className="text-[11px] text-center text-slate-500 mt-2 animate-pulse">
            Groq Llama 3.2 Vision is triaging your image & categorizing department...
          </p>
        )}
      </div>
    </main>
  );
}

