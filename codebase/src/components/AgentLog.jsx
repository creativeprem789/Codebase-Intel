// src/components/AgentLog.jsx
const AGENTS = [
  { num: 1, name: 'Cartographer', job: 'Mapping architecture...', color: 'text-green-600' },
  { num: 2, name: 'Archaeologist', job: 'Finding danger zones...', color: 'text-orange-600' },
  { num: 3, name: 'Guide', job: 'Writing onboarding handbook...', color: 'text-blue-600' },
]

export default function AgentLog({ currentStep }) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[400px] gap-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-100/40 max-w-xl mx-auto'>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-black text-slate-800 tracking-tight'>
          Analyzing Repository
        </h2>
        <p className='text-sm text-slate-500 max-w-md mx-auto'>
          Please wait while our AI agents inspect files, trace API schemas, and compile danger zones.
        </p>
      </div>

      <div className='w-full space-y-3.5'>
        {AGENTS.map(agent => {
          const done = currentStep > agent.num
          const running = currentStep === agent.num
          return (
            <div key={agent.num}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300
              ${running 
                ? 'border-blue-200 bg-blue-50/45 shadow-sm scale-[1.01]' 
                : done 
                  ? 'border-emerald-100 bg-emerald-50/10' 
                  : 'border-slate-100 bg-white opacity-40'}`}
            >
              {/* Step indicator circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border
                ${done 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                  : running 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20 animate-pulse' 
                    : 'bg-slate-50 border-slate-200 text-slate-400'}`}
              >
                {done ? '✓' : agent.num}
              </div>

              <div className='flex-1'>
                <p className={`text-sm font-bold transition-colors ${running ? 'text-blue-700' : done ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {agent.name} Agent
                </p>
                <p className='text-xs text-slate-400 mt-0.5'>
                  {done ? 'Task Complete' : running ? agent.job : 'Queueing...'}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
