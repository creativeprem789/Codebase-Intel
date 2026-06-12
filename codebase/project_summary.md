# Codebase Onboarding Intelligence - Project Summary

This file serves as a permanent record of what was created in this workspace, so the AI coding assistant can instantly resume work.

## Project Details
- **Created On**: June 12, 2026
- **Stack**: React.js (Vite) + Tailwind CSS v3 + Axios + React-Markdown
- **Location**: `C:\Users\HP\.gemini\antigravity\scratch\frontend`

## Completed Setup
1. **React Application**: Scaffolded using Vite.
2. **Styling**: Configured `tailwind.config.js` and `postcss.config.js` with typography support.
3. **Mocks & Services**:
   - `src/data/mockData.js`: Contains structured responses representing the outputs from the Cartographer, Archaeologist, Guide, and Oracle agents.
   - `src/api/backend.js`: Set to `USE_MOCK = true` by default. Can be flipped to `false` to connect to a real backend on `http://localhost:3001/api`.
4. **Components**:
   - `UploadZone.jsx`: File selection/drop area.
   - `AgentLog.jsx`: Step-by-step progress tracking for agents.
   - `ArchitectureMap.jsx`: Renders code layers and patterns.
   - `DangerZones.jsx`: Renders warning cards and recommendations.
   - `Handbook.jsx`: Formatted markdown handbook.
   - `OracleChat.jsx`: Interactive codebase Q&A widget.

## How to Run
Run this command in the terminal inside this folder:
```cmd
cmd.exe /c ""C:\Program Files\nodejs\npm.cmd" run dev"
```
The website runs at `http://localhost:5173/`.

## Next Steps / Backlog
- Send the project folder to the backend developer as a ZIP file (excluding `node_modules`).
- Switch `USE_MOCK = false` in `src/api/backend.js` when the backend is ready.
- Set up CORS in the backend code: `app.use(cors({ origin: 'http://localhost:5173' }))`.
