# Application Flow

## Current Status
Backend (Amey - 100 series) implemented and documented. Frontend modules (Tanmay: 200, Janhavi: 300, Purva: 400) in progress.

---

# 100 Series: Backend & Data Execution Flow (Amey)

### 101. Backend Entry & Express Server Setup
- File: `backend/amey/src/server.js`
- Starts Express server on port `PORT` (default 5000), connects to MongoDB Atlas via Mongoose (`src/config/db.js`), enables CORS for all origins, and mounts routes under `/api/auth` and `/api/issues`.

### 102. Groq AI Vision Triage Flow
1. Citizen submits form -> sends multipart/form-data `POST /api/issues`.
2. Backend streams image buffer to Cloudinary (`src/config/cloudinary.js`) to acquire secure URL.
3. Passes secure image URL & description to Groq Llama 3.2 Vision (`src/services/groqService.js`).
4. Groq Vision analyzes and outputs `{ category, severity }` JSON (with resilient heuristic fallback for offline/failover).

### 103. Issue Schema & GeoJSON Storage
1. Backend creates MongoDB record with GeoJSON `Point` coordinates `[longitude, latitude]`.
2. `2dsphere` index allows spatial proximity queries for map rendering.
3. Returns `201 Created` response with structured issue data.

### 104. Authentication & Status Management Flow
1. `POST /api/auth/login`: Validates user credentials with `bcrypt` -> returns signed JWT.
2. `GET /api/issues`: Fetches issues with optional filtering (`?status=Pending&category=Water`).
3. `PATCH /api/issues/:id/status`: Validates Bearer JWT (`authMiddleware.js`), updates status (`Pending` -> `In Progress` -> `Resolved`), and returns updated issue.

### 105. Backend API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | None | Server health check & status |
| `POST` | `/api/auth/login` | None | Authenticate admin / get JWT |
| `POST` | `/api/auth/register`| None | Register user / seed account |
| `POST` | `/api/issues` | None | Multipart upload, AI triage & create issue |
| `GET` | `/api/issues` | None | Fetch all issues (supports `?status=&category=&severity=`) |
| `GET` | `/api/issues/:id` | None | Fetch single issue details |
| `PATCH` | `/api/issues/:id/status` | Bearer JWT | Update issue resolution status |


