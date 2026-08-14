# Application Flow

## Current Status
- Backend (Amey - 100 series) implemented and live.
- Frontend App Shell & Auth (Tanmay - 200 series) implemented.
- Citizen Mobile Reporting (Janhavi - 300 series) implemented.
- Municipal Admin Dashboard (Purva - 400 series) implemented.

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

---

# 200 Series: Frontend App Shell & Auth Flow (Tanmay)

### 201. Frontend Entry & Shell Initialization
- `frontend/src/main.jsx` mounts `App.jsx` with `React.StrictMode` and Tailwind CSS.
- `App.jsx` sets up `AuthProvider` and `BrowserRouter` with `AppShell` wrapping all child views.
- `AppShell` renders responsive top `Navbar` with Jharkhand civic branding.

### 202. Admin Authentication Flow (Tanmay)
1. User clicks **"Admin Login"** in `Navbar` or navigates to `/login`.
2. User enters government admin credentials (`admin@jharkhand.gov` / `password123`).
3. `AdminLogin` sends `POST /api/auth/login` to Express Backend.
4. On response (200), `AuthContext.login(token, user)` persists JWT in `localStorage`.
5. User is redirected to `/admin` (`AdminDashboard` in Purva's module).
6. `Navbar` dynamically updates to show authenticated badge and **"Logout"** button.

### 203. Protected Route Security Flow (Tanmay)
1. Unauthenticated visitor navigates directly to `/admin`.
2. `ProtectedRoute` intercepts request, checks `AuthContext.user`.
3. If no user is logged in, navigates to `/login` with previous location saved in state.
4. If valid JWT exists in `localStorage`, session is restored on initial load.

---

# 300 Series: Citizen Mobile Submission Flows (Janhavi)

### 301. Mobile Camera Capture Flow (`CameraCapture.jsx`)
- **Trigger**: Citizen taps camera zone or file input.
- **Action**: Native mobile OS camera launched via `<input type="file" accept="image/*" capture="environment" />`.
- **Preview**: Image blob URL generated via `URL.createObjectURL(file)` with automatic cleanup on unmount/retake to avoid memory leaks.
- **State**: Sets `imageFile` state in `CitizenPortal`, updates header step indicator to `✓ Photo`.

### 302. GPS Geolocation Acquisition Flow (`LocationPicker.jsx` & `geoHelper.js`)
- **Trigger**: Citizen taps "Get My Live Location" button.
- **Action**: Queries HTML5 Geolocation API with `{ enableHighAccuracy: true, timeout: 15000 }`.
- **Feedback**: Formats coordinates (e.g. `23.3441° N, 85.3096° E`), displays `GPS Locked` status badge, accuracy meter, and initiates background reverse geocoding via OpenStreetMap.
- **State**: Sets `latitude` and `longitude` states in `CitizenPortal`, updates header step indicator to `✓ GPS`.

### 303. Issue Details & Quick-Tag Selection Flow (`SubmissionForm.jsx`)
- **Trigger**: Citizen enters description or taps quick-tag chips (`+ Pothole on road`, `+ Broken streetlight`, etc.).
- **Action**: Appends formatted tag string and updates 300-char limit counter.
- **State**: Sets `description` state in `CitizenPortal`, updates header step indicator to `✓ Details`.

### 304. Multipart FormData Submission & AI Triage Flow (`CitizenPortal.jsx`)
- **Trigger**: Citizen taps sticky "Submit Civic Report" button (`#submit-issue-btn`).
- **Validation**: Checks that `imageFile`, `latitude`, and `longitude` are present. Displays error toast if missing.
- **Payload**: Assembles multipart `FormData`:
  ```javascript
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("description", description);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  ```
- **Execution**: Sends `POST /api/issues` with `multipart/form-data`.
- **Loading State**: Disables button, renders loading spinner and "Analyzing Issue with AI..." indicator while backend Groq Vision triage executes.

### 305. Confirmation & Ticket Resolution Flow (`SuccessScreen.jsx`)
- **Trigger**: Receives HTTP 201 response containing created Issue document.
- **Display**: Renders confirmation badge, Issue ID (`#XXXXXX`), AI Category (`Roads`, `Sanitation`, etc.), and Severity Score (`High`, `Medium`, `Low`).
- **Reset**: Tapping "Report Another Issue" resets all state variables and returns to empty submission form.

---

# 400 Series: Municipal Admin Dashboard & Map Flows (Purva)

### 401. Issues Fetching & Optimistic Kanban Update Flow
1. Municipal official accesses the `/admin` route handled by `frontend/purva/components/AdminDashboard.jsx`.
2. On mount, `useIssues.js` fires `GET /api/issues`.
3. Issues are distributed into 3 status columns: `Pending`, `In Progress`, and `Resolved`.
4. When status is altered via the detail modal, `updateIssueStatus` immediately reflects the new column locally (optimistic update) and dispatches `PATCH /api/issues/:id/status` with `Authorization: Bearer <jwt_token>` in the background.

### 402. Leaflet Map Markers & Spatial Coordinates Flow
1. `MapView.jsx` initializes a Leaflet `MapContainer` centered on Ranchi, Jharkhand (`[23.3441, 85.3096]`, zoom 13).
2. MongoDB GeoJSON format coordinates `location.coordinates: [longitude, latitude]` are parsed and converted to Leaflet's `[latitude, longitude]` structure `[coordinates[1], coordinates[0]]`.
3. Markers are populated dynamically on the map layer with category tags, status, and thumbnails.
4. Clicking a marker popup's action button triggers `onMarkerClick` to open the full `IssueModal`.

### 403. Issue Status Update Modal Flow
1. Clicking any `IssueCard` or Map marker sets `selectedIssue` and opens `IssueModal.jsx`.
2. Modal presents full image preview, description, formatted Indian timestamp, coordinates, category badge, and severity border.
3. Authority chooses a new status from the dropdown and clicks **Save Changes**.
4. Triggers `updateIssueStatus(id, newStatus)` and closes modal seamlessly.



