// config/passport.js — Google OAuth Strategy Configuration
// ─────────────────────────────────────────────────────────────────────────────
// Registers the Google OAuth 2.0 strategy with Passport.
// This file is imported ONCE in server.js — the side-effect registers the strategy.
// ─────────────────────────────────────────────────────────────────────────────

import passport       from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

// ── Serialize / Deserialize ────────────────────────────────────────────────────
// serialize:   what to store IN the session (just the id to keep it small)
// deserialize: what to reconstruct FROM the session on every request
// In a real app with a DB, deserialize would do: User.findById(id)
// Here we store the full profile object directly for simplicity.

passport.serializeUser((user, done) => {
  done(null, user)  // store entire user object in session
})

passport.deserializeUser((user, done) => {
  done(null, user)  // restore user object from session
})

// ── Google Strategy ────────────────────────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback',
    scope:        ['profile', 'email'],
  },
  // verify callback — called after Google redirects back with user data
  (accessToken, refreshToken, profile, done) => {
    // Here you would normally find-or-create the user in your database.
    // For now we build a lean user object from the Google profile.
    const user = {
      googleId:    profile.id,
      displayName: profile.displayName,
      email:       profile.emails?.[0]?.value,
      photo:       profile.photos?.[0]?.value,
      accessToken,               // store if you need to call Google APIs on behalf of user
    }

    // Pass the user object to Passport — it will be serialized into the session
    return done(null, user)
  }
))
