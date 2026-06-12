// test.js — Full Chain Integration Test
// ─────────────────────────────────────────────────────────────────────────────
// Run with: node test.js
// Tests Agents 1, 2, 3 in sequence using a hardcoded sample codebase.
// Test this BEFORE connecting the frontend.
// ─────────────────────────────────────────────────────────────────────────────

import 'dotenv/config'
import { runChain }  from './orchestrator/chain.js'
import { askOracle } from './agents/oracle.js'

// ── Sample codebase — paste your own code here for custom testing ─────────────
const SAMPLE_CODE = `
// ===== FILE: server.js =====
const express = require('express')
const app = express()
app.use(express.json())
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/payment', require('./routes/payment'))
app.listen(3000, () => console.log('Server on 3000'))

// ===== FILE: routes/auth.js =====
const express = require('express')
const db      = require('../db')
const router  = express.Router()
router.post('/login', async (req, res) => {
  // SQL injection vulnerability — not using parameterised query!
  const user = await db.query('SELECT * FROM users WHERE email=' + req.body.email)
  res.json({ user })
})
module.exports = router

// ===== FILE: routes/payment.js =====
const db     = require('../db')
const stripe = require('stripe')(process.env.STRIPE_KEY)
exports.charge = async (req, res) => {
  const user   = await db.query('SELECT * FROM users WHERE id=' + req.body.id)
  const charge = await stripe.charges.create({ amount: req.body.amount * 100 })
  res.json({ ok: true })
}

// ===== FILE: utils/formatters.js =====
// SAFE FILE — pure functions, no side effects
exports.formatPrice = (paise) => (paise / 100).toFixed(2)
exports.formatDate  = (ts)    => new Date(ts).toLocaleDateString('en-IN')
`

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  CODEBASE INTEL — CHAIN TEST')
  console.log('═══════════════════════════════════════════════════\n')

  // ── Test full chain (Agents 1→2→3) ────────────────────────────────────────
  console.log('Running full chain (Agents 1, 2, 3)...\n')
  const result = await runChain(SAMPLE_CODE)

  console.log('\n─── RESULT ───────────────────────────────────────')
  console.log('Success:         ', result.success)
  console.log('Completed Agents:', result.completedAgents)

  if (result.error) {
    console.log('Error:           ', result.error)
  }

  console.log('\n─── AGENT 1: Architecture ────────────────────────')
  console.log(JSON.stringify(result.architectureJSON, null, 2))

  console.log('\n─── AGENT 2: Danger Zones ────────────────────────')
  console.log(JSON.stringify(result.dangerJSON, null, 2))

  console.log('\n─── AGENT 3: Handbook (first 500 chars) ─────────')
  console.log(result.handbook?.slice(0, 500))

  // ── Test Oracle (Agent 4) ─────────────────────────────────────────────────
  if (result.success && result.rawContext) {
    console.log('\n─── AGENT 4: Oracle Q&A ──────────────────────────')
    const question = 'Where does authentication happen and is it safe?'
    console.log('Question:', question)

    const answer = await askOracle(question, result.rawContext)
    console.log('Answer:', answer)
  }

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  TEST COMPLETE')
  console.log('═══════════════════════════════════════════════════')
}

main().catch(err => {
  console.error('Test failed:', err)
  process.exit(1)
})
