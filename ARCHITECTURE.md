# Architecture

## Current Status
Architecture Finalized.

## Architecture Decision Process
Chosen based on the 18-hour hackathon constraints: prioritizing speed, parallel development, and ease of deployment. 

## High-Level Architecture
A decoupled system: A monolithic Node.js backend serving REST APIs to a single React Progressive Web App (PWA).

## Frontend Architecture
- **Framework:** React.js (via Vite) for fast builds.
- **Styling:** TailwindCSS for rapid UI development.
- **PWA Capabilities:** `vite-plugin-pwa` to make the web app installable on phones.
- **Maps:** `react-leaflet` (OpenStreetMap) to avoid Google Maps billing/API key hurdles during a hackathon.
- **State Management:** Context API or Zustand (lightweight).

## Backend Architecture
- **Framework:** Node.js with Express.js.
- **Architecture Style:** Controller-Service-Route structure to keep Amey's codebase clean.
- **Authentication:** JWT (JSON Web Tokens).

## Database Architecture
- **Database:** MongoDB (hosted on MongoDB Atlas).
- **Why?** Flexible schema for rapid iteration and built-in **GeoJSON** support for location-based queries (e.g., "find all issues within 5km").

## External Services / APIs
- **Image Storage:** Cloudinary (Free tier) for storing user-uploaded photos.
- **AI Triage:** Groq API (using a Vision model like Llama 3.2 Vision) for analyzing images and auto-categorizing issues at lightning speed with high rate limits.

## Data Flow
1. Citizen captures a photo and GPS location via the React PWA.
2. Frontend uploads the image to Cloudinary and receives a secure image URL.
3. Frontend sends the image URL, GPS coordinates, and description to the Express Backend.
4. Backend calls the Groq API with the image to determine the `category` (e.g., Road, Water) and `severity`.
5. Backend saves the complete document to MongoDB.
6. Admin Dashboard fetches data from the backend to display on the Kanban board and Map.
