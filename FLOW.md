# Application Flow

> Team Namespace Convention:
> - 100 Series: Backend & Database Execution Flows (Amey)
> - 200 Series: App Shell, Authentication & Routing Flows (Tanmay)
> - 300 Series: Citizen Mobile Issue Submission Flows (Janhavi)
> - 400 Series: Admin Dashboard & Map Visualization Flows (Purva)

---

## 100 Series: Backend & Database Flows (Amey)
*Pending implementation.*

---

## 200 Series: App Shell & Authentication Flows (Tanmay)
*Pending implementation.*

---

## 300 Series: Citizen Mobile Submission Flows (Janhavi)

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

## 400 Series: Admin Dashboard & Map Flows (Purva)
*Pending implementation.*


