# Codebase Onboarding Intelligence (COI)

An advanced AI-powered onboarding system designed to help developers immediately get up to speed with new or legacy codebases. By uploading codebase files, the system initiates a sequential, multi-agent AI pipeline that maps architecture, identifies danger zones, extracts unwritten rules, drafts an onboarding handbook, and hosts an interactive Q&A assistant (Oracle).

---

## 🏗️ System Architecture

COI is split into a **React (Vite) Frontend** and a **Node.js/Express Backend** powered by LangChain and LLMs (Groq / Gemini).

```
                      +-------------------+
                      |   React Frontend  |
                      |   (Vite + Axios)  |
                      +---------+---------+
                                |  1. Upload Code / Ask Questions
                                |  2. Google OAuth / Session Auth
                                v
                      +---------+---------+
                      |  Express Backend  |
                      |   (server.js)     |
                      +---------+---------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
   +-------------------+                 +-------------------+
   |   Google OAuth    |                 | Orchestrator Chain|
   |  (Passport.js)    |                 |    (chain.js)     |
   +-------------------+                 +---------+---------+
                                                   |
      +---------------------+----------------------+---------------------+
      |                     |                      |                     |
      v                     v                      v                     v
+-----------+         +-----------+          +-----------+         +-----------+
|  Agent 1  |         |  Agent 2  |          |  Agent 3  |         |  Agent 4  |
|Cartography|         |Archaeology|          |   Guide   |         |  Oracle   |
+-----------+         +-----------+          +-----------+         +-----------+
| Maps code |         | Audits for|          | Generates |         | Interactive|
| structure |         | risk zones|          | handbook  |         | Q&A chatbot|
+-----------+         +-----------+          +-----------+         +-----------+
```

### 🤖 The Multi-Agent Pipeline

The core analysis pipeline is built as a sequential workflow governed by an Orchestrator. If any downstream agent fails, the orchestrator handles the exception and returns a partial analysis so the user experience is preserved.

1. **Agent 1: Cartographer (Architecture Mapper)**:
   - **File**: `agents/cartographer.js`
   - **Role**: Parses files and groups them into system layers (e.g., Routes, Services, Middleware).
   - **Outputs**: System flow summary, patterns used (e.g., MVC), architectural violations, and dependency list.

2. **Agent 2: Archaeologist (Code Auditor)**:
   - **File**: `agents/archaeologist.js`
   - **Role**: Combines the output of the Cartographer with the raw code to identify hidden patterns and risks.
   - **Outputs**: Danger zones (categorized by Critical, High, Medium severity), unwritten rules (with evidence quotes), safe-to-edit zones, and technical debt items.

3. **Agent 3: Guide (Handbook Writer)**:
   - **File**: `agents/guide.js`
   - **Role**: Uses the combined outputs of the Cartographer and Archaeologist to compile a cohesive, formatted Markdown handbook.
   - **Outputs**: A ready-to-read developer handbook including Day 1 changes, tracing routes, and troubleshooting guidelines.

4. **Agent 4: Oracle (Codebase Q&A)**:
   - **File**: `agents/oracle.js`
   - **Role**: A standalone agent activated on-demand. Using the previous pipeline outputs as its context, it provides highly context-aware answers to user queries, including safe code fixes.

---

## 📁 Repository Structure

```
Hackarena/
│
├── codebase/                        ← React Frontend (Vite)
│   ├── src/
│   │   ├── components/              ← UI Components (Upload, Map, DangerZones, etc.)
│   │   ├── api/                     ← Axios configuration & backend endpoints
│   │   ├── data/                    ← Mock data for local offline runs
│   │   └── App.jsx                  ← Main UI Router / State Manager
│   ├── tailwind.config.js           ← Tailwind CSS styling configurations
│   └── package.json                 ← Frontend dependencies & scripts
│
├── codebase-intel-backend/          ← Express Backend Server
│   ├── agents/                      ← LLM prompt templates and configurations
│   ├── config/                      ← Passport Google OAuth configurations
│   ├── middleware/                  ← Route protection guards
│   ├── orchestrator/                ← Sequential agent chain executor
│   ├── routes/                      ← Auth and analysis API endpoints
│   ├── utils/                       ← Text parser, helper scripts, JSON cleaners
│   ├── server.js                    ← App entry point
│   ├── test.js                      ← Script to run chain tests locally
│   └── package.json                 ← Backend dependencies & scripts
│
└── LICENSE
```

---

## ⚙️ Environment Configuration

In the `codebase-intel-backend/` directory, copy `.env.example` to `.env` and fill in the values:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

# LLM Providers (default setup uses Groq)
GROQ_API_KEY=your_groq_api_key_here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Sessions
SESSION_SECRET=your_session_secret_here
NODE_ENV=development
```

---

## 🔐 Google OAuth & Authentication Flow

Access to the AI analysis endpoints is protected using Passport.js.
1. The frontend redirects to `GET /auth/google` to trigger Google's login page.
2. Google redirects the user back to the backend callback (`/auth/google/callback`).
3. The backend saves the session and redirects the browser back to `http://localhost:5173/dashboard` (the dashboard page).
4. The frontend checks if the user is logged in by querying `GET /auth/me` and attaches `credentials: 'include'` to all subsequent requests to share cookie-based sessions.

---

## 🚀 Running the Project

Follow these steps to spin up the local development environment:

### Prerequisites
- Node.js (v18+)
- NPM or Yarn

### 1. Start the Backend Server
```bash
cd codebase-intel-backend
npm install
# Set up .env values first
npm run dev
```
The backend will run on `http://localhost:3001`.

### 2. Start the Frontend Dev Server
```bash
cd codebase
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

### 3. Local Command Line Testing
If you want to test the LLM agent chain directly from your terminal without opening a browser:
```bash
cd codebase-intel-backend
node test.js
```

---

## 📡 API Reference

### Auth Routes
- `GET /auth/google` - Redirects user to Google Login.
- `GET /auth/me` - Verifies session. Returns user info or `{ loggedIn: false }`.
- `GET /auth/logout` - Destroys session and logs the user out.

### Action Routes
- `POST /api/analyse` *(Auth required)* - Accepts multipart file uploads under the field name `files`, parses code, runs the 3-agent chain, and returns the architecture map, danger audit, handbook, and contextual data.
- `POST /api/ask` *(Auth required)* - Accepts a JSON body containing `{ question, context }` and returns the Oracle response.
- `GET /health` - Health check endpoint.

---

## 🛠️ Troubleshooting

- **CORS Errors**: Ensure that the frontend origin (`http://localhost:5173`) matches the `FRONTEND_URL` config in your backend `.env` file, and that your requests use `withCredentials: true` (Axios) or `credentials: 'include'` (Fetch).
- **Token Limits**: Large codebases might hit LLM token context limits. The system filters files and clips content in `utils/fileParser.js`. Adjust context slicing limit (e.g., from `8000` to `5000`) if you hit truncation limits.
- **Switching to Gemini**: If you run out of Groq API rate limits, you can substitute `ChatGroq` with LangChain's `ChatGoogleGenerativeAI` inside `agents/cartographer.js`, `agents/archaeologist.js`, `agents/guide.js`, and `agents/oracle.js`.
