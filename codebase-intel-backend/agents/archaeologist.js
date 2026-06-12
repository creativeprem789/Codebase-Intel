// agents/archaeologist.js — Agent 2: Code Auditor
// ─────────────────────────────────────────────────────────────────────────────
// Receives the architecture map from Agent 1 + original code.
// Identifies danger zones, hidden unwritten rules, safe edit zones, and tech debt.
//
// NOTE: LLM created inside function (lazy init) — avoids dotenv timing bug.
// ─────────────────────────────────────────────────────────────────────────────

import { ChatGroq }             from '@langchain/groq'
import { PromptTemplate }         from '@langchain/core/prompts'
import { safeParseJSON }          from '../utils/jsonHelper.js'

const PROMPT = `You are a senior developer doing a thorough code audit.

Architecture map (from previous analysis):
{architectureJSON}

Original code:
{codebaseText}

Return ONLY a valid JSON object with this EXACT structure:
{{
  "dangerZones": [
    {{
      "file":     "filename",
      "severity": "CRITICAL or HIGH or MEDIUM",
      "reason":   "specific reason why this is dangerous",
      "rule":     "the rule that should be followed here"
    }}
  ],
  "hiddenRules": [
    {{
      "rule":           "the unwritten rule (e.g. all money stored in cents)",
      "evidence":       "exact quote or pattern from the code that reveals this rule",
      "whereItApplies": "filename where this rule is most critical"
    }}
  ],
  "safeZones":  ["filenames safe to edit without risk — explain why"],
  "techDebt":   ["specific description of one debt item — be concrete not vague"]
}}

Return ONLY JSON. No explanation. No markdown fences.`

/**
 * runArchaeologist — audits code for dangers, hidden rules, safe zones, debt
 *
 * @param {object} architectureJSON  — output from runCartographer
 * @param {string} codebaseText      — original combined code string
 * @returns {object}                 — audit JSON (or parseError object)
 */
export async function runArchaeologist(architectureJSON, codebaseText) {
  // LLM created HERE (not at module level) so dotenv is fully loaded first
  const llm = new ChatGroq({
    apiKey:          process.env.GROQ_API_KEY,
    model:           'llama-3.3-70b-versatile',
    temperature:     0,
    maxTokens:       4096,
  })

  const formatted = await PromptTemplate
    .fromTemplate(PROMPT)
    .format({
      architectureJSON: JSON.stringify(architectureJSON),
      codebaseText,
    })

  const response = await llm.invoke(formatted)

  return safeParseJSON(response.content)
}
