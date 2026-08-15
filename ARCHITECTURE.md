# Jharkhand Civic Grievance & Triage Platform — Technical Architecture

## 1. Executive Summary & System Overview

The **Jharkhand Crowdsourced Civic Issue Reporting & Resolution System** is an enterprise-grade, full-stack civic governance platform designed for municipal corporations across the Government of Jharkhand. It provides a real-time, closed-loop workflow connecting three primary stakeholders:
1. **Citizens:** Lightweight Progressive Web App (PWA) with instant camera capture, high-precision GPS tagging, duplicate proximity detection, AI triage, and public complaint tracking.
2. **Municipal Administrators:** Command Center with spatial GIS mapping, Kanban triage board, field personnel dispatch, and real-time SLA/analytics intelligence.
3. **Field Personnel (Workers):** Dedicated mobile-first task execution dashboard with GPS turn-by-turn navigation and photographic proof-of-resolution upload.

---

## 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (PWA)                              │
│                                                                             │
│  ┌─────────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐  │
│  │     Citizen Portal      │ │   Admin Dashboard    │ │ Worker Dashboard │  │
│  │ (Camera/GPS/Track/Near) │ │ (Kanban/GIS/Metrics) │ │ (Nav/Resolution) │  │
│  └────────────┬────────────┘ └──────────┬───────────┘ └────────┬─────────┘  │
│               │                         │                      │            │
│               │ i18n Translation Engine (English / Hindi)      │            │
│               └─────────────────────────┼──────────────────────┘            │
└─────────────────────────────────────────┼───────────────────────────────────┘
                                          │ HTTPS / REST (JSON)
┌─────────────────────────────────────────▼───────────────────────────────────┐
│                        SECURITY & GATEWAY LAYER                             │
│                                                                             │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────┐  │
│  │ Global & Route Limit  │ │ Multi-Layer Spam/Bot  │ │ Input Sanitizer   │  │
│  │ (express-rate-limit)  │ │ (Honeypot + GPS Bound)│ │ (XSS/Tag Strip)   │  │
│  └───────────┬───────────┘ └───────────┬───────────┘ └─────────┬─────────┘  │
│              └─────────────────────────┼───────────────────────┘            │
└────────────────────────────────────────┼────────────────────────────────────┘
                                         │
┌────────────────────────────────────────▼────────────────────────────────────┐
│                        APPLICATION BACKEND LAYER                            │
│                                                                             │
│  ┌─────────────────────────┐ ┌──────────────────────┐ ┌──────────────────┐  │
│  │     Auth Controller     │ │   Issue Controller   │ │ Worker Service   │  │
│  │ (RBAC: Admin/Worker/Cit)│ │ (CRUD/Geospatial/Ded)│ │ (Dispatch/SLA)   │  │
│  └────────────┬────────────┘ └──────────┬───────────┘ └────────┬─────────┘  │
│               │                         │                      │            │
└───────────────┼─────────────────────────┼──────────────────────┼────────────┘
                │                         │                      │
       ┌────────▼────────┐       ┌────────▼────────┐    ┌────────▼────────┐
       │   MongoDB Atlas │       │ Groq Vision AI  │    │ Cloudinary CDN  │
       │ (2dsphere + DB) │       │ (Multimodal LLM)│    │ (Media Storage) │
       └─────────────────┘       └─────────────────┘    └─────────────────┘
```

---

## 3. Technology Stack

### Frontend Application
- **Runtime & Build Tooling:** React 18 with Vite 6.
- **Styling Architecture:** Vanilla TailwindCSS design token system with Jharkhand State branding palette (`#1E2A45` Deep Navy, `#F59E0B` Saffron Amber, `#059669` Emerald Green).
- **Progressive Web App (PWA):** `vite-plugin-pwa` with automatic service worker registration and OpenStreetMap tile cache strategy.
- **Geospatial GIS Engine:** `react-leaflet` and `leaflet` powered by OpenStreetMap cartography.
- **Internationalization (i18n):** Native zero-dependency React context translation engine with instant English ↔ Hindi switching and localStorage persistence.
- **Component Architecture:** Reusable atomic design system (`Card`, `Badge`, `Button`, `InputField`, `Modal`).

### Backend Application
- **Runtime:** Node.js (ES Module standard).
- **Framework:** Express.js 4.21 with controller-route-middleware modular architecture.
- **Authentication & RBAC:** Cryptographic JSON Web Tokens (JWT) with strict role verification (`admin`, `worker`, `citizen`).
- **Rate Limiting:** `express-rate-limit` with differentiated tiers (Global: 100/15m, Submission: 5/15m, Login: 10/15m).
- **Input Sanitization & Spam Defense:** Dual-tier input sanitization, honeypot traps, and bounding-box GPS state boundary validation.

### Database & Storage
- **Primary Database:** MongoDB Atlas with Mongoose ODM.
- **Spatial Indexing:** Native GeoJSON 2dsphere indexing for `$near` spatial queries and proximity deduplication calculations.
- **Cloud Media Storage:** Cloudinary CDN for tamper-evident photo storage with direct buffer pipeline streaming.

### Artificial Intelligence & Automation
- **Model Engine:** Groq API using `qwen/qwen3.6-27b` multimodal vision model.
- **Triage Pipeline:** Zero-shot image analysis extracting:
  - `category`: Roads, Water, Sanitation, Electricity, Other
  - `severity`: High, Medium, Low
  - `department`: Automatic municipal department routing
  - `summary`: One-sentence executive problem summary
  - `confidence`: Statistical model confidence score (0.0 - 1.0)
- **Heuristic Fallback:** Deterministic regex text-classifier pipeline ensuring 100% service uptime even if external APIs encounter rate limits.

---

## 4. End-to-End Data Flows

### A. Citizen Grievance Reporting Flow
1. Citizen captures photo evidence and initiates GPS acquisition.
2. Form checks honeypot field and validates minimum description length (20 characters).
3. Payload is streamed to backend (`POST /api/issues`).
4. Backend uploads image buffer to Cloudinary CDN.
5. Image URL and description are submitted to Groq Multimodal Vision AI.
6. **Proximity Deduplication Check:** Spatial query searches within 200 meters for existing unresolved issues in the same category.
   - If duplicates exist: User is presented with duplicate alert to upvote existing issues or force submission.
7. System generates tracking ID (`JH-YYYYMMDD-XXXXX`) and persists issue to MongoDB.
8. Citizen receives confirmation with tracking ID and real-time status tracker link.

### B. Municipal Admin Dispatch & Triage Flow
1. Municipal admin authenticates with JWT credentials.
2. Dashboard displays real-time statistics, Kanban columns, and GIS map markers.
3. Admin inspects grievance details, AI confidence scores, and citizen votes.
4. Admin dispatches grievance to specific departmental field workers (`PATCH /api/issues/:id/assign`).

### C. Field Personnel Resolution Flow
1. Worker logs in and accesses personal assigned work orders.
2. Worker clicks "Navigate" to launch GPS turn-by-turn navigation to exact coordinates.
3. Upon completing physical repair, worker captures photographic resolution proof and submits notes (`PATCH /api/issues/:id/resolve`).
4. Issue transitions to `Resolved`, timestamped, and visible on public complaint tracking timeline.

---

## 5. Security & Reliability Architecture

| Threat Vector | Mitigation Strategy | Implementation |
|---|---|---|
| **Credential Leakage** | Complete removal of static secrets; `.env.example` templates | `dotenv` + runtime environment variables |
| **Unauthorized Escalation** | Strict JWT verification without mock bypasses | `requireAuth`, `requireAdmin`, `requireRole` |
| **Spam / Bot Submissions** | Honeypot field trap + IP submission rate limiter | `spamDetection.js`, `rateLimiter.js` |
| **Denial of Service** | Tiered rate limiting on auth and submission endpoints | `express-rate-limit` |
| **Cross-Site Scripting (XSS)** | HTML tag stripping and character sanitization | `sanitizeMiddleware.js` |
| **False GPS Spoofing** | State bounding box check (21.5°N–25.5°N, 83.0°E–88.0°E) | `spamDetection.js` |
| **Out-of-Bounds Queries** | Geospatial 2dsphere indexing with `$maxDistance` limits | `Issue.js` + MongoDB spatial engine |

---

## 6. Verification & Test Suite

The system includes automated seed verification and full-flow validation:
```bash
# Backend Verification
cd backend/amey
npm run seed:demo    # Cleans and seeds Admin, 3 Workers, and 8 realistic issues
npm start            # Starts production backend on port 5000

# Frontend Verification
cd frontend
npm run build        # Verifies zero-error production PWA bundle
npm run dev          # Starts development server on port 5173
```
