# Codebase Onboarding Intelligence Engine — Backend

A 4-agent AI backend that analyses uploaded codebases and generates onboarding documentation for new developers.

---

## 📁 Folder Structure

```
codebase-intel-backend/
│
├── server.js                    ← App entry. Start here.
├── test.js                      ← Chain integration test
├── .env.example                 ← Copy to .env and fill in keys
├── package.json
│
├── config/
│   └── passport.js              ← Google OAuth strategy
│
├── middleware/
│   └── requireAuth.js           ← Route guard (login required)
│
├── routes/
│   ├── analyse.routes.js        ← POST /api/analyse, POST /api/ask
│   └── auth.routes.js           ← GET /auth/google, /auth/me, /auth/logout
│
├── agents/
│   ├── cartographer.js          ← Agent 1: Maps architecture
│   ├── archaeologist.js         ← Agent 2: Finds danger zones
│   ├── guide.js                 ← Agent 3: Writes handbook
│   └── oracle.js                ← Agent 4: Answers questions
│
├── orchestrator/
│   └── chain.js                 ← Wires Agents 1→2→3 in sequence
│
└── utils/
    ├── fileParser.js            ← Converts uploaded files to code string
    └── jsonHelper.js            ← Safely parses LLM JSON output
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd codebase-intel-backend
npm install
```

### 2. Set Up Environment Variables

```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

Then open `.env` and fill in:
- `GROQ_API_KEY` — get free at [console.groq.com](https://console.groq.com)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — see setup below
- `SESSION_SECRET` — any long random string

### 3. Run the Server

```bash
npm run dev    # development (auto-restarts on changes)
npm start      # production
```

### 4. Test Without Frontend

```bash
node test.js   # runs full chain against sample code
```

---

## 🔐 Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create or select a project
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web Application**
6. Add Authorized JavaScript origins: `http://localhost:3001`
7. Add Authorized redirect URIs: `http://localhost:3001/auth/google/callback`
8. Copy Client ID and Client Secret into `.env`

### Auth Flow (for Frontend Team)

```
1. Frontend redirects user to:
   GET http://localhost:3001/auth/google

2. User logs in with Google → backend receives callback

3. Backend redirects to:
   http://localhost:5173/dashboard   (your FRONTEND_URL)

4. Frontend checks login status:
   GET http://localhost:3001/auth/me
   → { loggedIn: true, user: { displayName, email, photo } }

5. All API calls must include credentials:
   fetch('/api/analyse', { credentials: 'include', ... })

6. Logout:
   GET http://localhost:3001/auth/logout
```

---

## 📡 API Reference

### `POST /api/analyse` *(Auth required)*

Upload code files and run the 3-agent analysis chain.

**Request:**
```
Content-Type: multipart/form-data
Field: files (one or more code files)
```

**Response:**
```json
{
  "success": true,
  "architectureJSON": { "layers": [...], "patterns": [...] },
  "dangerJSON":       { "dangerZones": [...], "hiddenRules": [...] },
  "handbook":         "# CODEBASE ONBOARDING HANDBOOK\n...",
  "rawContext":       { ... save this for /api/ask calls ... },
  "completedAgents":  3
}
```

---

### `POST /api/ask` *(Auth required)*

Ask the Oracle agent a question about the analysed codebase.

**Request:**
```json
{
  "question": "Where does authentication happen?",
  "context":  { ...rawContext from /api/analyse response... }
}
```

**Response:**
```json
{
  "answer": "Authentication happens in routes/auth.js..."
}
```

---

### `GET /auth/google`
Initiates Google OAuth login. Redirect the user's browser to this URL.

### `GET /auth/me`
Returns current user or `{ loggedIn: false }`.

### `GET /auth/logout`
Logs out and destroys the session.

### `GET /health`
Returns `{ status: "ok" }`. Use to verify server is up.

---

## 🛠 Common Issues

| Problem | Fix |
|---|---|
| LLM returns JSON inside `` ```json ``` `` fences | `safeParseJSON()` handles this automatically |
| Token limit — response cuts off mid-way | In `fileParser.js`, change `8000` to `5000` |
| CORS error from frontend | Add `credentials: 'include'` to all fetch calls |
| Groq rate limit | Switch to Gemini: replace `ChatGroq` with `ChatGoogleGenerativeAI` |
| Session not persisting | Make sure `credentials: 'include'` is in your fetch options |
| 401 on /api routes | User not logged in — redirect to `/auth/google` first |
