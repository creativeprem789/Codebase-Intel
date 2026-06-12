import 'dotenv/config'
import express        from 'express'
import cors           from 'cors'
import session        from 'express-session'
import passport       from 'passport'

import { analyseRoutes } from './routes/analyse.routes.js'
import { authRoutes }    from './routes/auth.routes.js'
import './config/passport.js'  // registers the Google OAuth strategy


const app  = express()
const PORT = process.env.PORT || 3001

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow only your frontend origin in production
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,   // IMPORTANT: needed so session cookies travel with OAuth
}))

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Session ───────────────────────────────────────────────────────────────────
// Passport needs sessions to persist the logged-in user between requests.
// In production replace this with a DB-backed session store (e.g. connect-pg-simple).
app.use(session({
  secret:            process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    secure:   process.env.NODE_ENV === 'production',  // HTTPS only in prod
    httpOnly: true,
    maxAge:   1000 * 60 * 60 * 24,   // 1 day
  },
}))

// ── Passport ──────────────────────────────────────────────────────────────────
app.use(passport.initialize())
app.use(passport.session())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/auth',  authRoutes)     // Google OAuth flow
app.use('/api',   analyseRoutes)  // AI chain endpoints (protected by requireAuth)

// ── Health Check ──────────────────────────────────────────────────────────────
// Frontend can hit GET /health to verify server is alive before uploading files
app.get('/health', (req, res) => res.json({
  status: 'ok',
  user:   req.user ? req.user.displayName : null,
}))

// ── 404 Fallback ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[Unhandled Error]', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`✅  Backend running on http://localhost:${PORT}`)
  console.log(`🔐  Google OAuth: http://localhost:${PORT}/auth/google`)
  console.log(`🔑  Using Client ID: "${process.env.GOOGLE_CLIENT_ID}"`)
})
