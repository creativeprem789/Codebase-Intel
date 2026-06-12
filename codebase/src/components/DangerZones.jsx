// src/components/DangerZones.jsx
const SEV = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', label: 'text-red-700' },
  warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'text-yellow-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', label: 'text-blue-700' },
}

export default function DangerZones({ data }) {
  if (!data || !data.zones) return null
  
  return (
    <div className='bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md shadow-slate-100/40 space-y-6'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-4'>
        <div className='w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50' />
        <h2 className='text-xl font-black text-slate-800 tracking-tight'>Danger Zones</h2>
      </div>

      <div className='space-y-4'>
        {data.zones.map((zone, i) => {
          const s = SEV[zone.severity] || SEV.info
          return (
            <div key={i} className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-sm ${s.bg} ${s.border} flex flex-col gap-3`}>
              <div className='flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/30 pb-2.5'>
                <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-white/80 shadow-sm ${s.label}`}>
                  {zone.severity}
                </span>
                <span className='text-xs text-slate-500 font-bold font-mono bg-white/40 px-2 py-0.5 rounded border border-slate-200/30'>
                  {zone.file}
                </span>
              </div>
              <p className='text-sm text-slate-700 font-medium leading-relaxed'>{zone.issue}</p>
              {zone.fix && (
                <div className='mt-1 bg-white/60 p-3 rounded-xl border border-slate-200/50 shadow-inner flex gap-2 items-start'>
                  <span className='text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded uppercase mt-0.5'>
                    Fix
                  </span>
                  <p className='text-xs text-slate-600 font-semibold leading-relaxed'>{zone.fix}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
