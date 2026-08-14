# Decisions Log

> Record only meaningful technical, architectural, product, or implementation decisions and their reasoning.

## Decision 001

Date: 2026-08-11
Decision: Selected Progressive Web App (PWA) as the primary platform over Native App or WhatsApp Bot.
Reason: Best balance of accessibility and feature capability for an 18-hour hackathon. Avoids App Store friction while allowing a single unified frontend to handle both citizen mobile views and admin desktop dashboards.
Alternatives Considered: WhatsApp Bot, Dedicated Native Mobile App.
Why Alternative Was Not Selected: WhatsApp limits UI/UX for community features like public maps. Native Apps are too heavy/risky to build alongside a web admin dashboard in 18 hours.
Impact: The frontend team will build a single web application with responsive routing.
Affected Modules: frontend, backend

## Decision 002

Date: 2026-08-11
Decision: Selected MERN Stack (MongoDB, Express, React, Node.js) with TailwindCSS and Groq API.
Reason: Highly familiar stack for rapid prototyping. MongoDB provides easy geospatial querying (GeoJSON) for map features. React (Vite) allows fast parallel frontend development without stepping on the backend's toes. Groq was chosen over Gemini for AI Triage due to significantly higher rate limits and lightning-fast inference speeds, which is crucial for hackathon demos.
Alternatives Considered: Next.js (Full-stack), PostgreSQL, Google Gemini API.
Why Alternative Was Not Selected: Next.js full-stack can cause merge conflicts if backend (Amey) and frontend (Purva, Janhavi, Tanmay) are constantly touching the same API route files. PostgreSQL schemas take longer to migrate during rushed hackathons. Gemini was replaced by Groq because Groq offers better request limits for testing and faster responses.
Impact: Strict API boundary between the frontend team and backend leader. Groq API will handle the AI Triage.
Affected Modules: Entire repository.

## Decision 301 (Janhavi)

Date: 2026-08-14
Decision: Implemented HTML5 Media Capture with URL Object preview and Geolocation API with graceful accuracy fallbacks in Janhavi's module (`frontend/janhavi/`).
Reason: Ensures zero-dependency mobile camera triggering across iOS Safari and Android Chrome without requiring heavy third-party camera libraries or native permissions. Handles network/GPS errors cleanly with user-friendly retry states.
Alternatives Considered: React-Webcam library, Manual coordinate text entry.
Why Alternative Was Not Selected: `react-webcam` requires complex WebRTC permissions, video streams, and canvas blitting which drain mobile battery and introduce compatibility hurdles during an 18-hour hackathon. Native file input with `capture="environment"` directly launches the OS camera interface.
Impact: Lightweight, high-performance citizen mobile reporting with automatic multipart `FormData` transmission.
Affected Modules: `frontend/janhavi/`
