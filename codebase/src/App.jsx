// src/App.jsx
import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import SignupPage from './components/SignupPage'
import UploadZone from './components/UploadZone'
import AgentLog from './components/AgentLog'
import ArchitectureMap from './components/ArchitectureMap'
import DangerZones from './components/DangerZones'
import Handbook from './components/Handbook'
import OracleChat from './components/OracleChat'
import { analyseFiles, checkUserSession, logoutSession } from './api/backend'

export default function App() {
  // Auth / navigation state
  const [page, setPage] = useState('landing') // 'landing' | 'signup' | 'dashboard'
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Dashboard state
  const [screen, setScreen] = useState('upload')
  const [result, setResult] = useState(null)
  const [agentStep, setAgentStep] = useState(0)
  const [error, setError] = useState(null)

  // Check auth status on mount
  useEffect(() => {
    async function verifyAuth() {
      // Clean up /dashboard redirect from URL if present to keep it clean
      if (window.location.pathname === '/dashboard') {
        window.history.replaceState({}, document.title, '/')
      }

      const session = await checkUserSession()
      if (session.loggedIn && session.user) {
        setUser({
          name: session.user.displayName || 'Developer',
          email: session.user.email,
          photo: session.user.photo
        })
        setPage('dashboard')
      } else {
        setUser(null)
        setPage('landing')
      }
      setLoading(false)
    }
    verifyAuth()
  }, [])

  async function handleLogout() {
    try {
      await logoutSession()
    } catch (err) {
      console.error('Failed to log out of server session', err)
    }
    setUser(null)
    setPage('landing')
    setScreen('upload')
    setResult(null)
    setAgentStep(0)
    setError(null)
  }

  async function handleUpload(files) {
    setScreen('analysing')
    setAgentStep(1)
    try {
      setTimeout(() => setAgentStep(2), 1000)
      setTimeout(() => setAgentStep(3), 2000)

      const data = await analyseFiles(files)
      if (data.success) {
        setResult(data)
        setScreen('results')
      } else {
        setError(data.error)
        setScreen('upload')
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Protected route kicked us out (session expired)
        setUser(null)
        setPage('signup')
        setError('Session expired. Please sign in again.')
      } else {
        setError('Server error. Is backend running on port 3001?')
      }
      setScreen('upload')
    }
  }

  // ─── Loading Screen (Premium Glassmorphism Spinner) ──────────────────────────
  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 bg-grid-pattern flex flex-col items-center justify-center text-slate-800 antialiased'>
        <div className='bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4 max-w-sm w-full mx-6'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse'>
            <svg className="w-6.5 h-6.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div className='flex items-center gap-2 mt-2'>
            <div className='w-2 h-2 rounded-full bg-blue-600 animate-bounce' style={{ animationDelay: '0ms' }} />
            <div className='w-2 h-2 rounded-full bg-indigo-600 animate-bounce' style={{ animationDelay: '150ms' }} />
            <div className='w-2 h-2 rounded-full bg-purple-600 animate-bounce' style={{ animationDelay: '300ms' }} />
          </div>
          <p className='text-xs font-semibold text-slate-500 tracking-wide mt-1'>Initializing secure sandbox...</p>
        </div>
      </div>
    )
  }

  // ─── Landing Page ──────────────────────────────────
  if (page === 'landing') {
    return <LandingPage onGetStarted={() => setPage('signup')} />
  }

  // ─── Signup Page ───────────────────────────────────
  if (page === 'signup') {
    return (
      <SignupPage
        onBack={() => setPage('landing')}
        onGoogleSignIn={() => {}} // Not used as we do direct href redirects now
      />
    )
  }

  // ─── Dashboard (existing page) ────────────────────
  return (
    <div className='min-h-screen bg-slate-50 bg-grid-pattern text-slate-800 antialiased'>
      {/* Top Accent Line */}
      <div className='h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 w-full' />

      {/* Premium Header */}
      <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 shadow-sm'>
        <div className='max-w-5xl mx-auto flex items-center justify-between'>
          <h1 className='text-lg font-extrabold tracking-tight flex items-center gap-2'>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-500/20 flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className='text-gradient font-black'>Codebase Intelligence</span>
            <span className='text-slate-400 font-normal'>|</span>
            <span className='text-slate-500 text-sm font-semibold hidden sm:inline'>Onboarding Engine</span>
          </h1>
          <div className='flex items-center gap-3'>
            <span className='text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100/80 shadow-sm'>
              Hackathon v1.0
            </span>

            {/* User profile */}
            {user && (
              <div className='flex items-center gap-2.5 ml-2 pl-3 border-l border-slate-200'>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-700 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                  title="Sign out"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className='max-w-5xl mx-auto p-6 lg:py-10 space-y-8'>
        {screen === 'results' && result && (
          <div className='bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-wider'>Analysis Complete</p>
              <h2 className='text-xl font-bold text-slate-800 mt-0.5'>Codebase Survival Guide Generated</h2>
            </div>
            <button
              onClick={() => {
                setScreen('upload');
                setResult(null);
                setAgentStep(0);
              }}
              className='text-xs font-bold text-slate-500 hover:text-blue-600 px-4 py-2 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/20 rounded-lg transition-all shadow-sm self-start md:self-auto'
            >
              Analyze Another Repository
            </button>
          </div>
        )}

        {screen === 'upload' && <UploadZone onUpload={handleUpload} error={error} />}
        {screen === 'analysing' && <AgentLog currentStep={agentStep} />}
        {screen === 'results' && result && (
          <div className='space-y-6'>
            <ArchitectureMap data={result.architectureJSON} />
            <DangerZones data={result.dangerJSON} />
            <Handbook markdown={result.handbook} />
            <OracleChat context={result.rawContext} />
          </div>
        )}
      </main>
    </div>
  )
}
