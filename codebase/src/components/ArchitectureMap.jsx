// src/components/ArchitectureMap.jsx
export default function ArchitectureMap({ data }) {
  if (!data || !data.layers) return null
  
  return (
    <div className='bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md shadow-slate-100/40 space-y-6'>
      <div className='flex items-center gap-2 border-b border-slate-100 pb-4'>
        <div className='w-2.5 h-2.5 rounded-full bg-teal-500 shadow-sm shadow-teal-500/50' />
        <h2 className='text-xl font-black text-slate-800 tracking-tight'>Architecture Map</h2>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        {data.layers.map((layer, i) => (
          <div key={i} className='border border-slate-200/60 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-5 transition-all duration-200 hover:shadow-sm flex flex-col justify-between'>
            <div className='space-y-4'>
              <h3 className='text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50/80 px-3 py-1 rounded-md border border-blue-100/50 inline-block'>
                {layer.name}
              </h3>
              <div className='space-y-3 mt-2'>
                {layer.files.map((file, j) => (
                  <div key={j} className='flex flex-col gap-1 text-sm bg-white p-3 rounded-xl border border-slate-200/50 shadow-sm'>
                    <span className='text-green-600 font-bold font-mono text-xs tracking-tight bg-green-50/50 px-2 py-0.5 rounded border border-green-100/60 self-start'>
                      {file.filename}
                    </span>
                    <span className='text-xs text-slate-500 font-medium pl-1 mt-1'>
                      {file.purpose}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.patterns?.length > 0 && (
        <div className='mt-6 pt-5 border-t border-slate-100'>
          <h3 className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-3'>Detected Software Patterns</h3>
          <div className='flex flex-wrap gap-2'>
            {data.patterns.map((p, i) => (
              <span key={i} className='px-3.5 py-1.5 bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-300 transition-colors shadow-sm'>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
