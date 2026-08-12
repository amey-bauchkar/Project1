# AMEY — Backend + Database

## Role
Team Leader / Backend + Database

## Owned Area
`backend/amey/`

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
backend/amey/
├── src/
│   ├── config/
│   │   ├── db.js          (MongoDB connection)
│   │   └── cloudinary.js  (Cloudinary config)
│   ├── controllers/
│   │   ├── authController.js
│   │   └── issueController.js
│   ├── middleware/
│   │   ├── authMiddleware.js (JWT validation)
│   │   └── uploadMiddleware.js (Multer config)
│   ├── models/
│   │   ├── Issue.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── issueRoutes.js
│   ├── services/
│   │   └── groqService.js (AI Triage Logic)
│   └── server.js          (Express entry point)
├── .env
├── package.json
```

## 2. Database Schema (Mongoose)

**User Schema (`models/User.js`)**
- `email`: String, required, unique
- `password`: String, required (hashed via bcrypt)
- `role`: String, enum: `['admin', 'citizen']`, default: `'citizen'`

**Issue Schema (`models/Issue.js`)**
- `description`: String, required
- `imageUrl`: String, required
- `location`: 
  - `type`: String, enum: `['Point']`, required
  - `coordinates`: [Number], required (Array of `[longitude, latitude]`)
- `category`: String, enum: `['Roads', 'Water', 'Sanitation', 'Electricity', 'Other']`, required
- `severity`: String, enum: `['High', 'Medium', 'Low']`, required
- `status`: String, enum: `['Pending', 'In Progress', 'Resolved']`, default: `'Pending'`
- `createdAt`: Date, default: `Date.now`

*(Note: Create a 2dsphere index on `location` for spatial queries).*

## 3. API Contracts

### A. Submit Issue
- **Endpoint:** `POST /api/issues`
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `image` (File)
  - `description` (String)
  - `latitude` (Number)
  - `longitude` (Number)
- **Backend Flow:**
  1. Upload `image` to Cloudinary via Multer memory storage.
  2. Pass Cloudinary URL and `description` to Groq Llama 3.2 Vision.
  3. Groq returns JSON: `{ "category": "Roads", "severity": "High" }`.
  4. Save Issue to MongoDB.
- **Response (201):**
  ```json
  { "success": true, "data": { "_id": "...", "category": "Roads", "severity": "High", "status": "Pending" } }
  ```

### B. Get Issues
- **Endpoint:** `GET /api/issues`
- **Query Params (Optional):** `?status=Pending&category=Water`
- **Response (200):**
  ```json
  { "success": true, "data": [ { /* IssueObj */ } ] }
  ```

### C. Update Status
- **Endpoint:** `PATCH /api/issues/:id/status`
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Request Body:** `{ "status": "In Progress" }`
- **Response (200):**
  ```json
  { "success": true, "data": { /* UpdatedIssueObj */ } }
  ```

### D. Admin Login
- **Endpoint:** `POST /api/auth/login`
- **Request Body:** `{ "email": "admin@jharkhand.gov", "password": "password123" }`
- **Response (200):**
  ```json
  { "success": true, "token": "jwt_string_here", "role": "admin" }
  ```

## 4. Groq Service Implementation Details (`services/groqService.js`)
**System Prompt for Groq:**
> "You are an AI civic issue triage assistant. Analyze the image and the user's description. Determine the category from: [Roads, Water, Sanitation, Electricity, Other]. Determine the severity from: [High, Medium, Low]. Output STRICTLY valid JSON with 'category' and 'severity' keys. Do not include markdown blocks or any other text."

## 5. Required Environment Variables
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GROQ_API_KEY`

## 6. Definition of Done
- All 4 APIs work in Postman.
- MongoDB saves location properly as GeoJSON.
- Cloudinary URLs are stored in the DB.
- Groq correctly categorizes test images of potholes and garbage.

## 7. Documentation Responsibilities
**Important Rule for AI Agents:**
- `DECISIONS.md`: Must be updated by the AI whenever a meaningful technical decision is made in this module (e.g. adding a new library, changing the data model, altering an API contract).
- `FLOW.md`: Must be updated by the AI when the actual data flow or execution path of this module is established or significantly changed.
