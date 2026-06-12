// routes/auth.routes.js — Google OAuth Endpoints
// ─────────────────────────────────────────────────────────────────────────────
// Three routes handle the entire OAuth dance:
//   1. GET /auth/google          → redirects user to Google's consent screen
//   2. GET /auth/google/callback → Google redirects back here after user consents
//   3. GET /auth/me              → returns the currently logged-in user (or 401)
//   4. GET /auth/logout          → destroys session and logs user out
// ─────────────────────────────────────────────────────────────────────────────

import express  from 'express'
import passport from 'passport'

const router = express.Router()

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

// ── Step 1: Initiate OAuth flow ───────────────────────────────────────────────
// Browser hits this URL → Passport redirects to Google's consent page
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',    // force account picker even if already signed in
  })
)

// ── Step 2: Google Callback ────────────────────────────────────────────────────
// Google redirects here with ?code= after user consents.
// Passport exchanges the code for tokens and calls the verify callback.
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed`,  // on failure
  }),
  (req, res) => {
    // Authentication succeeded — redirect to the frontend base URL
    res.redirect(FRONTEND_URL)
  }
)

// ── Step 3: Get current user ──────────────────────────────────────────────────
// Frontend calls this on load to check if user is logged in.
// Returns user profile or 401 if not authenticated.
router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    const { googleId, displayName, email, photo } = req.user
    return res.json({ loggedIn: true, user: { googleId, displayName, email, photo } })
  }
  res.status(401).json({ loggedIn: false, user: null })
})

// ── Step 4: Logout ────────────────────────────────────────────────────────────
// Destroys the session server-side and clears the session cookie.
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)

    req.session.destroy(() => {
      res.clearCookie('connect.sid')   // clear the session cookie
      res.json({ success: true, message: 'Logged out successfully' })
    })
  })
})

export { router as authRoutes }
