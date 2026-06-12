// routes/analyse.routes.js — AI Chain API Endpoints
// ─────────────────────────────────────────────────────────────────────────────
// Two endpoints:
//   POST /api/analyse  — upload code files → runs 3-agent chain → returns analysis
//   POST /api/ask      — send a question + rawContext → Agent 4 (Oracle) answers
//
// Both endpoints are protected by requireAuth middleware.
// Users must be logged in via Google OAuth before they can analyse code.
// ─────────────────────────────────────────────────────────────────────────────

import express           from 'express'
import multer            from 'multer'
import { runChain }      from '../orchestrator/chain.js'
import { askOracle }     from '../agents/oracle.js'
import { parseFiles }    from '../utils/fileParser.js'
import { requireAuth }   from '../middleware/requireAuth.js'

const router = express.Router()

// Store files in memory (buffers). Fine for code files.
// Limit: 10MB total upload size — adjust as needed.
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 },   // 10 MB per file
})

// ── ENDPOINT 1: Analyse uploaded code files ────────────────────────────────
// Frontend: FormData, field name = 'files'
// Returns full analysis from all 3 agents + rawContext for Oracle calls
router.post('/analyse', requireAuth, upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded. Attach at least one code file.' })
    }

    // Convert uploaded file buffers into a single combined code string
    const codeText = parseFiles(req.files)

    console.log(`[/api/analyse] User: ${req.user.email} | Files: ${req.files.length} | Chars: ${codeText.length}`)

    // Run Agents 1 → 2 → 3 in sequence via the orchestrator
    const result = await runChain(codeText)

    res.json(result)

  } catch (err) {
    console.error('[/api/analyse] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ── ENDPOINT 2: Oracle Q&A ────────────────────────────────────────────────
// Frontend sends: { question: string, context: rawContext }
// Returns: { answer: string }
router.post('/ask', requireAuth, async (req, res) => {
  try {
    const { question, context } = req.body

    if (!question || !context) {
      return res.status(400).json({
        error: 'Both "question" (string) and "context" (rawContext from /analyse) are required.'
      })
    }

    console.log(`[/api/ask] User: ${req.user.email} | Q: "${question.slice(0, 60)}..."`)

    const answer = await askOracle(question, context)

    res.json({ answer })

  } catch (err) {
    console.error('[/api/ask] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export { router as analyseRoutes }
