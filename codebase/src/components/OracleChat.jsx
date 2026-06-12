// src/components/OracleChat.jsx
import { useState } from 'react'
import { askOracle } from '../api/backend'

export default function OracleChat({ context }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    if (!question.trim()) return
    setLoading(true); setAnswer(null)
    try {
      const data = await askOracle(question, context)
      setAnswer(data.answer)
    } catch (err) {
      setAnswer('Error contacting oracle. Check backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md shadow-slate-100/40 space-y-6'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-4'>
        <div className='w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50' />
        <h2 className='text-xl font-black text-slate-800 tracking-tight'>Oracle Chat</h2>
      </div>

      <div className='flex gap-3'>
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
          placeholder='Ask a question (e.g. "Where is authentication handled?")'
          className='flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3
          text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all duration-200'
        />
        <button
          onClick={handleAsk} disabled={loading}
          className='px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none active:scale-95 text-sm'
        >
          {loading ? '...' : 'Ask'}
        </button>
      </div>
      {answer && (
        <div className='mt-4 p-5 bg-gradient-to-r from-blue-50/30 to-indigo-50/20 rounded-2xl border border-blue-100/80 shadow-inner flex gap-3 items-start'>
          <div className='w-6 h-6 rounded-full bg-blue-100/80 flex items-center justify-center text-blue-600 text-[10px] font-bold border border-blue-200/50 shrink-0 mt-0.5'>
            AI
          </div>
          <p className='text-sm text-slate-700 font-medium leading-relaxed'>{answer}</p>
        </div>
      )}
    </div>
  )
}
