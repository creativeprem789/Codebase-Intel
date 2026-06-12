// src/components/Handbook.jsx
import ReactMarkdown from 'react-markdown'

export default function Handbook({ markdown }) {
  if (!markdown) return null

  function handleDownloadPDF() {
    // Basic markdown to HTML converter for clean printing
    const htmlContent = markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-black text-slate-800 border-b-2 border-slate-200 pb-3 mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-extrabold text-slate-800 border-b border-slate-100 pb-2 mt-8 mb-4">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3">$1</h3>')
      .replace(/^\* (.*$)/gim, '<li class="ml-6 list-disc mb-1.5 text-slate-600">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 list-disc mb-1.5 text-slate-600">$1</li>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200/50">$1</code>')
      .split('\n').map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''
        if (trimmed.startsWith('<h') || trimmed.startsWith('<li') || trimmed.startsWith('<ul') || trimmed.startsWith('<ol')) return line
        return `<p class="mb-4 text-slate-600 leading-relaxed text-sm">${line}</p>`
      }).join('\n')

    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Codebase Onboarding Handbook</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: 'Inter', sans-serif; }
            @media print {
              body { background: white; color: black; padding: 0; margin: 0; }
              .no-print { display: none; }
              .print-container { border: none !important; box-shadow: none !important; padding: 0 !important; }
            }
          </style>
        </head>
        <body class="bg-slate-100 p-6 sm:p-10 max-w-4xl mx-auto">
          <div class="flex justify-between items-center mb-6 no-print bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Document Print Preview</span>
            </div>
            <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/10 transition-all duration-200 active:scale-95">
              Print / Save as PDF
            </button>
          </div>
          
          <div class="print-container bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm min-h-[11in]">
            {/* Header */}
            <div class="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-8">
              <div>
                <h1 class="text-lg font-black text-slate-900 tracking-tight">CODEBASE INTELLIGENCE</h1>
                <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Automated Developer Handbook</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-slate-500 font-semibold">Generated: ${new Date().toLocaleDateString('en-IN')}</p>
                <p class="text-[9px] text-blue-600 font-bold">Confidential Spec</p>
              </div>
            </div>

            {/* Content */}
            <div class="prose prose-slate max-w-none">
              ${htmlContent}
            </div>

            {/* Footer */}
            <div class="border-t border-slate-100 pt-6 mt-12 text-center">
              <p class="text-[10px] text-slate-400 font-semibold tracking-wide">
                Generated via Codebase Onboarding Engine • Hackarena v1.0
              </p>
            </div>
          </div>

          <script>
            // Wait for tailwind and fonts, then print
            window.onload = function() {
              setTimeout(() => { window.print(); }, 800);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className='bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md shadow-slate-100/40 space-y-6'>
      <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
        <div className='flex items-center gap-2'>
          <div className='w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50' />
          <h2 className='text-xl font-black text-slate-800 tracking-tight'>Onboarding Handbook</h2>
        </div>
        <button
          onClick={handleDownloadPDF}
          className='flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-purple-200 text-slate-600 hover:text-purple-600 hover:bg-purple-50/20 text-xs font-bold rounded-xl shadow-sm transition-all duration-200 active:scale-95'
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
      </div>

      <div className='prose prose-slate prose-sm max-w-none
      prose-headings:text-slate-800 prose-headings:font-extrabold prose-headings:tracking-tight
      prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-2 prose-h2:mt-6
      prose-code:text-indigo-600 prose-code:bg-indigo-50/40 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:border prose-code:border-indigo-100/30 prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none
      prose-strong:font-bold prose-strong:text-slate-800
      prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-blue-700'>
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  )
}
