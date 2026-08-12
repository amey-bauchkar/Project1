# TANMAY — Settings & App Shell

## Role
Frontend Developer

## Owned Area
`frontend/tanmay/`

## 0. SYSTEM INSTRUCTION FOR AI AGENT (CRITICAL)
**To the AI Assistant reading this file:**
Before you generate any code or scaffold this module, you MUST first read the following files in the root directory to establish the full project context:
1. `README.md`
2. `PROBLEM-STATEMENT.md`
3. `SOLUTION.md`
4. `ARCHITECTURE.md`
5. `TEAM-RULES.md`
Do NOT proceed with implementation until you have read those files. They contain strict 18-hour hackathon constraints that you must follow.

## 1. Directory Structure to Scaffold
```text
frontend/tanmay/
├── components/
│   ├── AppShell.jsx (Wraps the entire app with Navbar/Sidebar)
│   ├── AdminLogin.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
└── utils/
    └── auth.js
```

## 2. Global App Shell (UI Wrapper)
- **Navbar:** 
  - Fixed at the top.
  - Contains Logo: "Jharkhand Civic Report"
  - Right side: Language Toggle (UI only) and "Admin Login" button if not logged in, or "Logout" if logged in.
- **Routing Setup:** 
  - Set up `react-router-dom` in the root (coordinated with the team).
  - `/` -> Renders Janhavi's `CitizenPortal`.
  - `/login` -> Renders Tanmay's `AdminLogin`.
  - `/admin` -> Renders Purva's `AdminDashboard` (Protected).

## 3. AuthContext Implementation
- Create an `AuthContext` to manage global state: `user`, `login(token)`, `logout()`.
- `login(token)` should save the JWT to `localStorage` and set `user` state.
- `logout()` should remove the JWT and redirect to `/login`.
- On initial load, check `localStorage` for a token and restore the session.

## 4. Protected Route Logic
- Create a `<ProtectedRoute>` wrapper component for Purva's dashboard.
```javascript
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
```

## 5. Admin Login Screen
- **UI:** A simple centered card on a gray background.
- **Form:** `email` and `password` inputs.
- **API Call:** `POST /api/auth/login`.
- **Handling:** On success, extract token, call `login(token)` from context, and redirect to `/admin`.
- **Errors:** Show red text "Invalid credentials" if 401.

## 6. Definition of Done
- The Navbar successfully renders across all pages.
- Admin login successfully authenticates with Amey's backend and saves the JWT.
- Unauthenticated users trying to access `/admin` are bounced back to `/login`.
- The frontend routing connects Janhavi's and Purva's modules seamlessly.

## 7. Documentation Responsibilities
**Important Rule for AI Agents:**
- `DECISIONS.md`: Must be updated by the AI whenever a meaningful technical decision is made in this module (e.g. adding a new library, changing the data model, altering an API contract).
- `FLOW.md`: Must be updated by the AI when the actual data flow or execution path of this module is established or significantly changed.
