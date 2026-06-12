// middleware/requireAuth.js — Route Guard
// ─────────────────────────────────────────────────────────────────────────────
// Attach this middleware to any route that should be accessible only to
// logged-in users.  Usage:
//   router.post('/analyse', requireAuth, upload.array('files'), handler)
// ─────────────────────────────────────────────────────────────────────────────

export function requireAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next()   // user is logged in — let the request through
  }

  // Not authenticated — tell the client clearly
  res.status(401).json({
    error:       'Unauthorized',
    message:     'You must be logged in to use this endpoint.',
    loginUrl:    '/auth/google',
  })
}
