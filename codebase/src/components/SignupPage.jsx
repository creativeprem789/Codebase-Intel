// src/components/SignupPage.jsx
import { useState, useEffect } from 'react'
import { BACKEND_URL } from '../api/backend'

export default function SignupPage({ onBack, onGoogleSignIn }) {
  const [visible, setVisible] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  function handleGoogleClick() {
    setIsSigningIn(true)
    window.location.href = `${BACKEND_URL}/auth/google`
  }

  return (
    <div className="h-screen bg-slate-50 bg-grid-pattern text-slate-800 antialiased flex flex-col overflow-hidden">
      {/* Top Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 w-full flex-shrink-0" />

      {/* Back button */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-3 flex-shrink-0">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors duration-200 group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center px-6 min-h-0">
        <div className={`w-full max-w-sm transition-all duration-700 ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/40 px-7 py-6 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-14 -left-14 w-32 h-32 bg-gradient-to-tr from-blue-400/8 to-indigo-400/8 rounded-full blur-2xl pointer-events-none" />

            <div className="relative">
              {/* Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <svg className="w-5.5 h-5.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-5">
                <h2 className="text-xl font-black tracking-tight text-slate-800 mb-1">Welcome Back</h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Sign in to access your codebase analysis dashboard.
                </p>
              </div>

              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleClick}
                disabled={isSigningIn}
                className="w-full relative flex items-center justify-center gap-3 px-5 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl font-bold text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none group"
              >
                {isSigningIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
                    <span className="text-sm">Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-sm">Continue with Google</span>
                    <svg className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform duration-200 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Secure Authentication
                  </span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-[8px] font-bold text-slate-500 text-center leading-tight">Encrypted</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-[8px] font-bold text-slate-500 text-center leading-tight">OAuth 2.0</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50/80 border border-slate-100">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-[8px] font-bold text-slate-500 text-center leading-tight">No Data Stored</span>
                </div>
              </div>

              {/* Terms */}
              <p className="text-center text-[9px] text-slate-400 mt-4 leading-relaxed">
                By continuing, you agree to our{' '}
                <span className="text-slate-500 font-semibold hover:text-blue-600 cursor-pointer transition-colors">Terms</span>
                {' '}and{' '}
                <span className="text-slate-500 font-semibold hover:text-blue-600 cursor-pointer transition-colors">Privacy Policy</span>
              </p>
            </div>
          </div>

          {/* Bottom text */}
          <div className="text-center mt-4">
            <span className="text-[10px] text-slate-400 font-medium">
              Powered by <span className="text-gradient font-bold">Codebase Intelligence</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
