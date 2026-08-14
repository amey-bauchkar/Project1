import React, { useRef, useState, useEffect } from "react";

/**
 * CameraCapture Component
 * Handles mobile camera capture and file selection with instant image preview.
 */
export default function CameraCapture({ imageFile, onImageSelected, onImageRemoved, disabled = false }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Manage object URL lifecycle to prevent memory leaks
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file (JPEG, PNG, WEBP).");
        return;
      }
      onImageSelected(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelected(file);
    }
  };

  const triggerInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <span className="text-emerald-600">📸</span> Photo Evidence <span className="text-rose-500">*</span>
        </label>
        {imageFile && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        )}
      </div>

      {/* Hidden Mobile-First Camera Input */}
      <input
        ref={fileInputRef}
        id="camera-file-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {!imageFile ? (
        /* Empty State: Tap to Snap or Upload */
        <div
          onClick={triggerInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-emerald-500 bg-emerald-50/70 scale-[1.01]"
              : "border-slate-300 hover:border-emerald-500 bg-white hover:bg-slate-50/80 shadow-sm"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="w-16 h-16 mb-3 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-200 shadow-inner">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-800 text-center">
            Tap to Open Camera & Snap Photo
          </p>
          <p className="text-xs text-slate-500 mt-1 text-center">
            or choose an existing photo from gallery
          </p>
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            <span>✨</span> Groq AI Vision will auto-analyze the image
          </div>
        </div>
      ) : (
        /* Image Preview Card */
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md group">
          <img
            src={previewUrl}
            alt="Issue preview"
            className="w-full h-56 object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top Status Badge */}
          <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm shadow flex items-center gap-1">
            <span>✓</span> Photo Ready
          </div>

          {/* Actions Bar */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={triggerInput}
              disabled={disabled}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold shadow backdrop-blur-sm transition active:scale-95 disabled:opacity-50"
            >
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retake Photo
            </button>
            <button
              type="button"
              onClick={onImageRemoved}
              disabled={disabled}
              className="py-2 px-3 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold shadow backdrop-blur-sm transition active:scale-95 disabled:opacity-50 inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
