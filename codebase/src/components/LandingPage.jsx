// src/components/LandingPage.jsx
import { useState, useEffect } from 'react'

export default function LandingPage({ onGetStarted }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const features = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      title: 'Architecture Mapping',
      desc: 'Instantly visualize code layers, patterns, and dependencies across your entire repository.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Danger Zone Detection',
      desc: 'AI agents flag hardcoded secrets, missing validations, and critical vulnerabilities automatically.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Onboarding Handbook',
      desc: 'Generate a complete developer handbook with setup guides, key files, and first tasks.',
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: 'Oracle Q&A',
      desc: 'Ask natural language questions about any codebase and get contextual, accurate answers.',
    },
  ]

  const steps = [
    { num: '01', title: 'Upload Code', desc: 'Drag & drop your repository files into the analyzer.' },
    { num: '02', title: 'AI Agents Run', desc: 'Four specialized agents dissect your codebase in parallel.' },
    { num: '03', title: 'Get Insights', desc: 'Receive architecture maps, danger zones, and a full handbook.' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 bg-grid-pattern text-slate-800 antialiased overflow-hidden">
      {/* Top Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 w-full" />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-gradient font-black text-lg tracking-tight">Codebase Intelligence</span>
          </div>
          <button
            onClick={onGetStarted}
            className="text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/15 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className={`relative max-w-6xl mx-auto px-6 pt-20 pb-24 lg:pt-28 lg:pb-32 transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />

        <div className="relative text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100/80 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">AI-Powered Codebase Analysis</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Understand Any Codebase
            <br />
            <span className="text-gradient">In Minutes, Not Days</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Upload your repository and let AI agents map architecture, detect vulnerabilities, and generate a complete onboarding handbook — instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-2"
            >
              Start Analyzing
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-10 py-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-base rounded-xl transition-all duration-200 shadow-sm text-center"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={`max-w-6xl mx-auto px-6 pb-20 transition-all duration-1000 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-12">
          <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Features</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">Four AI Agents. One Platform.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-sm font-extrabold text-slate-800 mb-1.5">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={`max-w-6xl mx-auto px-6 pb-24 transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-2">How It Works</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800">Three Steps to Clarity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center group hover:shadow-md hover:border-slate-300/80 transition-all duration-300">
              <span className="text-5xl font-black text-gradient opacity-30 group-hover:opacity-50 transition-opacity duration-300">{s.num}</span>
              <h3 className="text-base font-extrabold text-slate-800 mt-3 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gradient font-black text-sm">Codebase Intelligence</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-400 font-medium">Hackathon v1.0</span>
          </div>
          <p className="text-xs text-slate-400">Built with AI agents for smarter onboarding.</p>
        </div>
      </footer>
    </div>
  )
}
