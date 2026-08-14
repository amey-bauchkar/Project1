# Application Flow

## Current Status
Frontend App Shell, Auth Context, Route Guards, and Navigation implemented.

## Frontend Entry Point
- `frontend/src/main.jsx` mounts `App.jsx` with `React.StrictMode` and Tailwind CSS.
- `App.jsx` sets up `AuthProvider` and `BrowserRouter` with `AppShell` wrapping all child views.

## Main User Flows

### 201. Citizen Issue Reporting Flow (Janhavi - 300 series)
1. User navigates to `/` (Citizen Portal).
2. `AppShell` displays top `Navbar` with Jharkhand civic branding.
3. User sees reporting interface (Janhavi's module) to capture photos and GPS coordinates.

### 202. Admin Authentication & Management Flow (Tanmay - 200 series)
1. User clicks **"Admin Login"** in `Navbar` or navigates to `/login`.
2. User enters government admin credentials (`admin@jharkhand.gov` / `password123`).
3. `AdminLogin` sends `POST /api/auth/login` to Express Backend.
4. On response (200), `AuthContext.login(token, user)` persists JWT in `localStorage`.
5. User is redirected to `/admin` (`AdminDashboard` in Purva's module).
6. `Navbar` dynamically updates to show authenticated badge and **"Logout"** button.

### 203. Protected Route Security Flow (Tanmay - 200 series)
1. Unauthenticated visitor navigates directly to `/admin`.
2. `ProtectedRoute` intercepts request, checks `AuthContext.user`.
3. If no user is logged in, navigates to `/login` with previous location saved in state.
4. If valid JWT exists in `localStorage`, session is restored on initial load.

## API Flow
- `POST /api/auth/login`: `{ email, password }` -> `{ token, role }`
- `GET /api/issues`: Fetches issue feed for dashboard
- `POST /api/issues`: `multipart/form-data` with photo, coordinates, and description
- `PATCH /api/issues/:id/status`: Updates issue workflow status

## Major Execution Paths
`main.jsx` -> `App.jsx` (`AuthProvider` -> `BrowserRouter`) -> `AppShell` (`Navbar`) -> Route Component (`CitizenPortal` | `AdminLogin` | `ProtectedRoute` -> `AdminDashboard`)
