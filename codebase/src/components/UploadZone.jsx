// src/components/UploadZone.jsx
import { useState } from 'react'

export default function UploadZone({ onUpload, error }) {
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [uploadMode, setUploadMode] = useState('folder') // 'folder' | 'files'

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    setFiles(dropped)
  }

  function handleChange(e) {
    setFiles(Array.from(e.target.files))
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[500px] gap-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md shadow-slate-100/40 max-w-xl mx-auto'>
      <div className='text-center space-y-2'>
        <h2 className='text-2xl font-black text-slate-800 tracking-tight sm:text-3xl'>
          Upload Your Codebase
        </h2>
        <p className='text-sm text-slate-500 max-w-md mx-auto'>
          Analyze your repository layers, detect danger zones, and generate an onboarding developer handbook instantly.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-slate-100/80 p-1 rounded-xl w-full border border-slate-200/40 shadow-inner">
        <button
          onClick={() => { setUploadMode('folder'); setFiles([]); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
            uploadMode === 'folder'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/30'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Folder Upload
        </button>
        <button
          onClick={() => { setUploadMode('files'); setFiles([]); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
            uploadMode === 'files'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/30'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Individual Files
        </button>
      </div>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`w-full relative group border-2 border-dashed rounded-2xl p-8 sm:p-10
        text-center cursor-pointer transition-all duration-300
        ${dragging 
          ? 'border-blue-500 bg-blue-50/50 scale-[1.01]' 
          : 'border-slate-300 bg-slate-50 hover:bg-slate-100/50 hover:border-slate-400'}`}
      >
        <svg className={`mx-auto h-12 w-12 mb-4 transition-transform duration-300 group-hover:-translate-y-1 ${dragging ? 'text-blue-500 scale-110' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className='text-sm text-slate-600 font-semibold text-center'>
          {dragging 
            ? 'Drop to upload!' 
            : uploadMode === 'folder' 
              ? 'Click to select codebase directory' 
              : 'Drag & drop or click to select files'}
        </p>
        <p className='text-xs text-slate-400 mt-1 text-center'>
          Supports .js, .ts, .py, .jsx, .tsx files
        </p>

        {uploadMode === 'folder' ? (
          <input
            type='file'
            directory=""
            webkitdirectory=""
            onChange={handleChange}
            className='absolute inset-0 opacity-0 cursor-pointer'
          />
        ) : (
          <input
            type='file'
            multiple
            accept='.js,.ts,.py,.jsx,.tsx'
            onChange={handleChange}
            className='absolute inset-0 opacity-0 cursor-pointer'
          />
        )}
      </div>

      {files.length > 0 && (
        <div className='w-full bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 shadow-inner max-h-40 overflow-y-auto space-y-1.5'>
          <p className='text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1'>Selected ({files.length} files)</p>
          {files.map(f => {
            const path = f.webkitRelativePath || f.name
            return (
              <div key={path} className='text-xs text-green-700 font-semibold py-0.5 flex items-center gap-2 truncate' title={path}>
                <span className='w-1.5 h-1.5 rounded-full bg-green-500 shrink-0' /> {path}
              </div>
            )
          })}
        </div>
      )}

      {error && <p className='text-red-600 text-sm font-semibold text-center'>{error}</p>}
      
      <button
        disabled={files.length === 0}
        onClick={() => onUpload(files)}
        className='w-full sm:w-auto px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-300 disabled:to-slate-300 disabled:opacity-40 disabled:pointer-events-none text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95'
      >
        Analyse Codebase
      </button>
    </div>
  )
}
