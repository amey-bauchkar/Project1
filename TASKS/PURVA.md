# PURVA — Dashboard

## Role
Frontend Developer

## Owned Area
`frontend/purva/`

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
frontend/purva/
├── components/
│   ├── AdminDashboard.jsx (Main container)
│   ├── KanbanBoard.jsx
│   ├── KanbanColumn.jsx
│   ├── IssueCard.jsx
│   ├── MapView.jsx
│   └── IssueModal.jsx (Shows details when a card/pin is clicked)
├── hooks/
│   └── useIssues.js (Custom hook to fetch issues)
└── styles/
    └── map.css (For leaflet custom styles)
```

## 2. Design System & UI Specifications
- **Framework:** React + TailwindCSS
- **Primary Color:** Emerald Green (`bg-emerald-500`, `text-emerald-500`)
- **Background:** `bg-slate-50` for the dashboard body.
- **Kanban Columns:** 
  - 3 equal-width columns. 
  - Background `bg-gray-100 p-4 rounded-lg`.
  - Columns: "Pending", "In Progress", "Resolved".
- **Issue Card:** 
  - `bg-white shadow-sm rounded p-3 mb-2 cursor-pointer border-l-4`.
  - Border color based on severity: High (`border-red-500`), Medium (`border-yellow-500`), Low (`border-blue-500`).
  - Card shows: `Category`, small thumbnail of `image`, `Date`, and `Severity` badge.

## 3. Data Integration & State
- **Fetching:** Call `GET /api/issues` on mount. Store in a local state array `issues`.
- **Kanban Logic:** Filter `issues` into three arrays based on `status`. 
- **Updating:** When an admin drags a card or changes status in a modal, call `PATCH /api/issues/:id/status`, then update the local state array to reflect the move instantly (Optimistic UI update).

## 4. MapView Component Details
- **Library:** `react-leaflet`
- **Implementation:**
  - `<MapContainer center={[23.3441, 85.3096]} zoom={13}>` (Ranchi, Jharkhand default coords).
  - Iterate over `issues` array and render `<Marker position={[issue.location.coordinates[1], issue.location.coordinates[0]]}>`.
  - *Note: GeoJSON stores as [longitude, latitude], but Leaflet expects [latitude, longitude].*
  - `<Popup>` should display the issue category and status.

## 5. IssueModal Component Details
- When a card or map pin is clicked, open a Modal overlay.
- Display the full-size `imageUrl`.
- Display the user's `description`.
- Dropdown to change the `status`.
- Save button triggers the `PATCH` API.

## 6. Definition of Done
- The dashboard renders both a Kanban board and a Map side-by-side or via toggle tabs.
- Issues are fetched from Amey's backend and populate the columns.
- Modifying a status updates the backend and moves the card to the new column.
- Map renders pins accurately.

## 7. Documentation Responsibilities
**Important Rule for AI Agents:**
- `DECISIONS.md`: Must be updated by the AI whenever a meaningful technical decision is made in this module (e.g. adding a new library, changing the data model, altering an API contract).
- `FLOW.md`: Must be updated by the AI when the actual data flow or execution path of this module is established or significantly changed.
