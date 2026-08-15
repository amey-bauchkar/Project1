# Tanmay's Self-Contained Implementation Plan: Near-Me Issues & Upvoting

## Objective & Ownership
Build the entire **Near-Me Issues & Upvoting Feature** in a self-contained manner inside Tanmay's owned module (`frontend/tanmay/` and dedicated submodules), minimizing touchpoints with other teammate directories (`janhavi`, `purva`, `backend/amey`) so that:
1. You can build and test this feature end-to-end yourself without merge conflicts.
2. It can easily plug into the Citizen experience or live as a dedicated **"Nearby Issues" / "Explore & Upvote"** screen in the App Shell.
3. It provides a client-side mock/sync fallback so it works immediately even if the backend GeoJSON API isn't deployed yet.

---

## 1. Architecture & Component Structure

All files for this feature will be contained cleanly inside `frontend/tanmay/`:

```text
frontend/tanmay/
├── components/
│   ├── AppShell.jsx
│   ├── AdminLogin.jsx
│   ├── Navbar.jsx               (Add 'Nearby Issues' nav link)
│   ├── ProtectedRoute.jsx
│   └── nearby/                  (NEW: Dedicated Submodule)
│       ├── NearbyIssuesView.jsx (Main Page / Modal for Near-Me Issues)
│       ├── NearbyIssueCard.jsx  (Card showing photo, distance, category & Upvote button)
│       ├── UpvoteButton.jsx     (Interactive button with instant optimistic count)
│       └── FilterBar.jsx        (Filter by category: Roads, Water, Sanitation, etc.)
├── hooks/
│   └── useNearbyIssues.js       (Custom hook: geolocation + fetching + optimistic upvoting)
├── services/
│   └── nearbyService.js         (API calls to GET /api/issues/nearby & PATCH /api/issues/:id/upvote with mock fallback)
└── utils/
    ├── device.js                (Anonymous voter ID generator/storage)
    └── distance.js              (Haversine formula to calculate meters/km from user coords)
```

---

## 2. Step-by-Step Execution Plan

### Step 1: Utility Helpers (`frontend/tanmay/utils/`)
1. **`device.js`:**
   - Creates/retrieves a persistent UUID `civic_voter_id` from `localStorage` so any citizen can upvote without logging in.
   - Maintains a list of `upvoted_issues` array in `localStorage` for instant disabled state.
2. **`distance.js`:**
   - Haversine distance calculator between citizen's current GPS `[lat, lng]` and issue coordinates `[lat, lng]`. Formats as `"150m away"` or `"1.2 km away"`.

### Step 2: Service Layer with Dual-Mode (Live + Mock Fallback)
1. **`nearbyService.js`:**
   - `fetchNearbyIssues(lat, lng, radius)`:
     - Tries `GET /api/issues/nearby?lat=${lat}&lng=${lng}&radius=${radius}`.
     - If backend endpoint is 404/down during dev/pitch, automatically falls back to fetching `GET /api/issues` and filtering client-side by distance, or serving realistic seed data centered on Ranchi, Jharkhand.
   - `upvoteIssue(issueId, voterId)`:
     - Calls `PATCH /api/issues/${issueId}/upvote`.
     - Returns updated upvote count.

### Step 3: Custom React Hook (`frontend/tanmay/hooks/useNearbyIssues.js`)
- Manages state: `issues`, `loading`, `error`, `userLocation`, `radius` (default 1000m).
- Automatically triggers `navigator.geolocation.getCurrentPosition()`.
- Provides an `handleUpvote(issueId)` function with **Optimistic UI updates** (instantly bumps counter and updates `localStorage`).

### Step 4: UI Components (`frontend/tanmay/components/nearby/`)
1. **`NearbyIssueCard.jsx`:**
   - Displays issue image preview, category badge (Roads, Water, etc.), formatted distance ("250m away"), and timestamp.
   - Embedded `<UpvoteButton />` with flame/thumb icon (`🔥 X Citizens Affected`).
2. **`FilterBar.jsx`:**
   - Pill buttons to filter by category or sort by "Most Upvoted" vs "Closest".
3. **`NearbyIssuesView.jsx`:**
   - Mobile-first responsive view with:
     - Header: "Civic Issues Near You in Jharkhand"
     - GPS status banner ("📍 Location Acquired: Main Road, Ranchi")
     - Radius slider (500m - 5km)
     - Empty state with cute CTA: "No issues reported nearby! Your neighborhood is clean."
     - List of `NearbyIssueCard`s.

### Step 5: Routing & App Shell Integration
1. **`Navbar.jsx`:**
   - Add a navigation link: **"📍 Nearby Issues"** alongside "Report Issue".
2. **`App.jsx`:**
   - Add route `/nearby` pointing to `<NearbyIssuesView />`.
   - Also allow opening it as a bottom-sheet/modal if integrated into the home screen.

---

## 3. Backend Coordination (For Amey's DB integration)
When Amey is ready to link up, you provide him with the exact contract:
- `GET /api/issues/nearby?lat={lat}&lng={lng}&radius={radius}`
- `PATCH /api/issues/:id/upvote` with body `{ voterId }`

Because you have the mock fallback built into `nearbyService.js`, **your feature will work 100% independently for the demo even if the backend is not yet updated!**

---

## 4. Definition of Done
- Citizen can navigate to `/nearby` from the Navbar.
- Browser requests GPS and shows current location.
- Nearby issues load with realistic distance metrics.
- Clicking "Upvote" immediately increases the count with smooth animation, disables the button, and stores the state locally.
- 0 merge conflicts with Janhavi, Purva, or Amey.
