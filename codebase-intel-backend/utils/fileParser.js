// utils/fileParser.js
// ─────────────────────────────────────────────────────────────────────────────
// Converts an array of uploaded Multer file objects into a single combined
// code string that the LLM agents can process.
//
// Each file gets a header comment so the agent knows which file each section
// came from (crucial for accurate "danger zone" file references).
// ─────────────────────────────────────────────────────────────────────────────

// File extensions that are safe to parse as text
const SUPPORTED_EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs',
  '.py', '.rb', '.go', '.java', '.kt', '.swift',
  '.c',  '.cpp', '.h',  '.cs',  '.rs', '.php',
  '.html', '.css', '.scss', '.less',
  '.json', '.yaml', '.yml', '.toml', '.env',
  '.md', '.txt', '.sh', '.bash', '.zsh',
  '.sql', '.graphql', '.gql',
])

// Filenames that should be explicitly ignored (e.g. lock files)
const IGNORED_FILENAMES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'composer.lock',
  'gemfile.lock',
  'cargo.lock',
  'mix.lock',
])

// Directory segments that should cause a file to be ignored
const IGNORED_DIR_SEGMENTS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  '.next',
  'coverage',
  '.cache',
]

function getExtension(filename) {
  const idx = filename.lastIndexOf('.')
  return idx === -1 ? '' : filename.slice(idx).toLowerCase()
}

function shouldIgnore(filepath) {
  const normalized = filepath.replace(/\\/g, '/').toLowerCase()
  const pathParts = normalized.split('/')
  
  // 1. Check if the file is inside any ignored directory
  const hasIgnoredSegment = pathParts.some(part => IGNORED_DIR_SEGMENTS.includes(part))
  if (hasIgnoredSegment) return true

  // 2. Check if the filename itself is in the ignored list
  const filename = pathParts[pathParts.length - 1]
  if (IGNORED_FILENAMES.has(filename)) return true

  return false
}

/**
 * parseFiles — converts Multer file array to one big code string
 *
 * @param {Express.Multer.File[]} files — array of Multer file objects
 * @param {number} charLimit            — max total characters (default 25000)
 * @returns {string}                    — combined code string ready for LLM
 */
export function parseFiles(files, charLimit = 25000) {
  const parsed = files
    .filter(file => {
      // 1. Skip lock files, dependencies, build files
      if (shouldIgnore(file.originalname)) {
        console.log(`[fileParser] Ignoring file: ${file.originalname}`)
        return false
      }

      // 2. Validate extensions
      const ext = getExtension(file.originalname)
      if (!SUPPORTED_EXTENSIONS.has(ext)) {
        console.warn(`[fileParser] Skipping unsupported file type: ${file.originalname}`)
        return false
      }
      return true
    })
    .map(file => {
      const content = file.buffer.toString('utf-8')
      return `// ===== FILE: ${file.originalname} =====\n${content}`
    })
    .join('\n\n')

  if (parsed.length === 0) {
    throw new Error('No supported code files found. Upload .js, .ts, .py, .go, etc.')
  }

  // To fit comfortably within Groq's 12,000 TPM (Tokens Per Minute) free-tier limit,
  // we cap the total codebase character limit to 25,000 (~6,000 tokens).
  const truncated = parsed.slice(0, charLimit)

  if (parsed.length > charLimit) {
    console.warn(`[fileParser] Code truncated from ${parsed.length} to ${charLimit} chars`)
  }

  return truncated
}
