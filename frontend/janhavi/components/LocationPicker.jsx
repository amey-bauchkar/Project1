import React, { useState } from "react";
import { getCurrentCoordinates, formatCoordinates, reverseGeocode } from "../utils/geoHelper";

/**
 * LocationPicker Component
 * Handles GPS fetching, accuracy indicator, and display for civic reports.
 */
export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  disabled = false
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [address, setAddress] = useState("");

  const handleGetLocation = async () => {
    if (disabled) return;
    setIsFetching(true);
    setErrorMsg(null);

    try {
      const coords = await getCurrentCoordinates();
      onLocationChange(coords.latitude, coords.longitude);
      setAccuracy(coords.accuracy);

      // Async reverse geocoding in background
      reverseGeocode(coords.latitude, coords.longitude)
        .then((addr) => setAddress(addr))
        .catch(() => {});
    } catch (err) {
      setErrorMsg(err.message || "Failed to retrieve GPS location.");
    } finally {
      setIsFetching(false);
    }
  };

  const hasLocation = latitude !== null && longitude !== null && !isNaN(latitude) && !isNaN(longitude);

  return (
    <div className="w-full mb-5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <span className="text-emerald-600">📍</span> Incident Location <span className="text-rose-500">*</span>
        </label>
        {hasLocation && (
          <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            GPS Locked
          </span>
        )}
      </div>

      {!hasLocation ? (
        /* Action Button to Acquire GPS */
        <div>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={disabled || isFetching}
            className={`w-full p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 transition-all duration-200 ${
              isFetching
                ? "bg-emerald-50 border-emerald-400 text-emerald-800 cursor-wait"
                : "bg-white border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 shadow-sm active:scale-[0.99]"
            } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isFetching ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-emerald-600"
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
                <span className="font-semibold text-emerald-700">Acquiring Precise GPS...</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-800 text-sm">Get My Live Location</p>
                  <p className="text-xs text-slate-500">Auto-tags precise coordinates for field workers</p>
                </div>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="mt-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-fadeIn">
              <span className="text-base leading-none">⚠️</span>
              <div className="flex-1">
                <p className="font-semibold">GPS Acquisition Failed</p>
                <p className="mt-0.5">{errorMsg}</p>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="mt-1.5 text-xs font-bold text-rose-800 underline hover:text-rose-900"
                >
                  Retry with High Accuracy
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Location Acquired Info Box */
        <div className="p-4 rounded-xl bg-emerald-50/90 border border-emerald-200 text-slate-800 shadow-sm transition-all animate-fadeIn">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  Location Acquired
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCoordinates(latitude, longitude)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={disabled || isFetching}
              className="text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-sm transition active:scale-95 flex items-center gap-1"
            >
              <svg className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {address && (
            <p className="mt-2 text-xs text-slate-600 bg-white/70 p-2 rounded-lg border border-emerald-100/60 line-clamp-2">
              📍 <span className="font-medium">{address}</span>
            </p>
          )}

          {accuracy && (
            <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-700/90 font-medium">
              <span>🎯 Accuracy: ±{accuracy} meters</span>
              <span>•</span>
              <span>Ready for GeoJSON indexing</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
