# JANHAVI — Tasks Module (Mobile Submission)

## Role
Frontend Developer

## Owned Area
`frontend/janhavi/`

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
frontend/janhavi/
├── components/
│   ├── CitizenPortal.jsx (Main container)
│   ├── CameraCapture.jsx (Handles file input)
│   ├── LocationPicker.jsx (Handles GPS logic)
│   ├── SubmissionForm.jsx
│   └── SuccessScreen.jsx
└── utils/
    └── geoHelper.js
```

## 2. Design System & UI Specifications
- **Framework:** React + TailwindCSS
- **Layout:** Strictly Mobile-First (`max-w-md mx-auto h-screen flex flex-col`).
- **Primary Color:** Emerald Green (`bg-emerald-500`).
- **Inputs:** `w-full p-4 border rounded-xl mb-4 text-lg`.
- **Action Button:** Huge, sticky bottom button `fixed bottom-4 w-[calc(100%-2rem)] py-4 rounded-full bg-emerald-600 text-white font-bold text-xl shadow-lg`.

## 3. Core Logic: Location & Camera
- **Camera/File Input:** 
  - Use `<input type="file" accept="image/*" capture="environment" />` to trigger the mobile camera directly.
  - Render a small preview of the selected image using `URL.createObjectURL()`.
- **Geolocation:**
  - Create a button: "Get My Location".
  - Use `navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true })`.
  - Store `latitude` and `longitude` in React state.
  - Display feedback: "✅ Location Acquired".

## 4. API Integration (FormData)
- **Endpoint:** `POST /api/issues`
- **Method:** Since we are uploading a file, we MUST use `FormData`.
```javascript
const formData = new FormData();
formData.append("image", imageFile);
formData.append("description", descriptionText);
formData.append("latitude", lat);
formData.append("longitude", lng);

// Send via Axios/Fetch
axios.post('/api/issues', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

## 5. Loading & Error Handling
- **Submitting State:** When submitting, disable the button, change text to "Analyzing Issue...", and show a spinner. (Groq AI takes 2-3 seconds).
- **Validation:** Prevent submission if image or location is missing. Show toast/alert: "Photo and Location are required!"

## 6. Definition of Done
- A citizen can open the web app on their phone.
- They can snap a photo.
- GPS is fetched successfully.
- The `FormData` successfully posts to Amey's backend.
- A "Thank You" success screen is shown upon 201 response.

## 7. Documentation Responsibilities
**Important Rule for AI Agents:**
- `DECISIONS.md`: Must be updated by the AI whenever a meaningful technical decision is made in this module (e.g. adding a new library, changing the data model, altering an API contract).
- `FLOW.md`: Must be updated by the AI when the actual data flow or execution path of this module is established or significantly changed.
