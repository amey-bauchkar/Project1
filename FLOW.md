# Application Flow

## Current Status
Backend (Amey) implemented and documented. Frontend modules (Purva, Janhavi, Tanmay) in progress.

## Backend Entry Point
- File: `backend/amey/src/server.js`
- Starts Express server on port `PORT` (default 5000), connects to MongoDB Atlas via Mongoose (`src/config/db.js`), enables CORS for all origins, and mounts routes under `/api/auth` and `/api/issues`.

## Main User Flow

### 1. Citizen Flow (Janhavi -> Amey)
1. Citizen opens Mobile Web Portal at `/`.
2. Citizen takes a photo of civic issue and clicks "Get My Location".
3. Citizen submits form -> sends multipart/form-data `POST /api/issues`.
4. Backend handles image streaming to Cloudinary -> passes secure URL & description to Groq Vision AI triage -> receives structured `{ category, severity }`.
5. Backend stores document in MongoDB with GeoJSON `Point` coordinates `[longitude, latitude]`.
6. Returns `201 Created` with issue data to frontend.

### 2. Admin & Dashboard Flow (Tanmay + Purva -> Amey)
1. Municipal official visits `/login`.
2. Submits credentials -> `POST /api/auth/login`.
3. Backend validates password via `bcrypt`, generates signed JWT token with 7-day expiry -> returns `{ token, role: 'admin' }`.
4. Admin is routed to `/admin` (`AdminDashboard`).
5. Dashboard calls `GET /api/issues` to populate Kanban columns ("Pending", "In Progress", "Resolved") and Leaflet Map markers.
6. When admin drags a card or updates status in `IssueModal`, sends `PATCH /api/issues/:id/status` with `Authorization: Bearer <jwt_token>`.
7. Backend updates status and returns updated issue.

## API Flow Summary

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | None | Server health check & status |
| `POST` | `/api/auth/login` | None | Authenticate admin / get JWT |
| `POST` | `/api/auth/register`| None | Register user / seed account |
| `POST` | `/api/issues` | None | Multipart upload, AI triage & create issue |
| `GET` | `/api/issues` | None | Fetch all issues (supports `?status=&category=&severity=`) |
| `GET` | `/api/issues/:id` | None | Fetch single issue details |
| `PATCH` | `/api/issues/:id/status` | Bearer JWT | Update issue resolution status |

