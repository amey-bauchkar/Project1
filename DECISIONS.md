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

## Decision 401 (Purva)

Date: 2026-08-14
Decision: Implemented Optimistic UI state updates for issue status changes with local rollback protection.
Reason: Ensures instantaneous card movement across Kanban columns and instant modal responsiveness during fast hackathon evaluations without waiting for backend network roundtrips.
Alternatives Considered: Blocking UI loader on every status change, purely synchronous local state without API wiring.
Why Alternative Was Not Selected: Blocking UI feels sluggish to judges; purely mock state breaks integration with Amey's backend.
Impact: `useIssues.js` updates state immediately and syncs asynchronously via `PATCH /api/issues/:id/status`.
Affected Modules: frontend/purva

## Decision 402 (Purva)

Date: 2026-08-14
Decision: Built an integrated Multi-View layout (Split View, Kanban Only, Live Map Only) with client-side category filtering.
Reason: Municipal authorities need both high-level geographic clustering and operational column-based workflow in one responsive interface.
Alternatives Considered: Separate standalone pages requiring route changes.
Why Alternative Was Not Selected: Route switching adds click friction; keeping views toggleable in one dashboard preserves state and improves authority ergonomics.
Impact: `AdminDashboard.jsx` seamlessly toggles views and filters data in-memory across both Kanban and Leaflet markers.
Affected Modules: frontend/purva

