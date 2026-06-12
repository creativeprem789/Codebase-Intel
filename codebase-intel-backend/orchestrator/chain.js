// orchestrator/chain.js — The Brain: Wires All 4 Agents Together
// ─────────────────────────────────────────────────────────────────────────────
// Execution order:
//   Agent 1 (Cartographer) → Agent 2 (Archaeologist) → Agent 3 (Guide)
//   Agent 4 (Oracle) is called separately on-demand from routes/analyse.routes.js
//
// If any agent fails, the chain catches the error and returns a partial result
// so the API never fully crashes — the frontend always gets something back.
// ─────────────────────────────────────────────────────────────────────────────

import { runCartographer }  from '../agents/cartographer.js'
import { runArchaeologist } from '../agents/archaeologist.js'
import { runGuide }         from '../agents/guide.js'

/**
 * runChain — runs the 3-agent sequential analysis pipeline
 *
 * @param {string} codebaseText  — combined code string from fileParser
 * @returns {object}             — result object with all agent outputs
 *
 * Result shape:
 * {
 *   success:          boolean
 *   architectureJSON: object | null   ← Agent 1 output
 *   dangerJSON:       object | null   ← Agent 2 output
 *   handbook:         string | null   ← Agent 3 output (markdown)
 *   rawContext:       object | null   ← all 3 combined, for Oracle calls
 *   error:            string | null   ← error message if something failed
 *   completedAgents:  number          ← how many agents finished (0, 1, 2, or 3)
 * }
 */
export async function runChain(codebaseText) {
  const result = {
    success:          false,
    architectureJSON: null,
    dangerJSON:       null,
    handbook:         null,
    rawContext:       null,
    error:            null,
    completedAgents:  0,
  }

  try {
    // ── AGENT 1: Cartographer ─────────────────────────────────────────────────
    console.log('[Chain] ▶ Agent 1 (Cartographer) running...')
    result.architectureJSON = await runCartographer(codebaseText)
    result.completedAgents  = 1
    console.log('[Chain] ✓ Agent 1 complete')

    // ── AGENT 2: Archaeologist ────────────────────────────────────────────────
    // Receives Agent 1 output + original code
    console.log('[Chain] ▶ Agent 2 (Archaeologist) running...')
    result.dangerJSON      = await runArchaeologist(result.architectureJSON, codebaseText)
    result.completedAgents = 2
    console.log('[Chain] ✓ Agent 2 complete')

    // ── AGENT 3: Guide ────────────────────────────────────────────────────────
    // Receives Agents 1 + 2 outputs. Returns markdown string.
    console.log('[Chain] ▶ Agent 3 (Guide) running...')
    result.handbook        = await runGuide(result.architectureJSON, result.dangerJSON)
    result.completedAgents = 3
    console.log('[Chain] ✓ Agent 3 complete')

    // ── Build rawContext for Oracle (Agent 4) ─────────────────────────────────
    // The frontend saves this and sends it back with every /api/ask request
    result.rawContext = {
      architectureJSON: result.architectureJSON,
      dangerJSON:       result.dangerJSON,
      handbook:         result.handbook,
    }

    result.success = true
    console.log('[Chain] ✅ All 3 agents complete. Success.')

    return result

  } catch (err) {
    // Catch partial failures — return whatever completed successfully
    console.error(`[Chain] ❌ Error after ${result.completedAgents} agents:`, err.message)

    result.error = err.message

    // Build partial rawContext from whatever did complete
    if (result.completedAgents >= 1) {
      result.rawContext = {
        architectureJSON: result.architectureJSON,
        dangerJSON:       result.dangerJSON       || null,
        handbook:         result.handbook         || null,
      }
    }

    return result   // return partial — never crash the API
  }
}
