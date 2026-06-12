// agents/guide.js — Agent 3: Onboarding Handbook Writer
// ─────────────────────────────────────────────────────────────────────────────
// Receives outputs from Agent 1 (architecture) and Agent 2 (audit).
// Writes a complete developer onboarding handbook in Markdown.
//
// Returns plain markdown string (not JSON) — the frontend renders this directly.
// NOTE: LLM created inside function (lazy init) — avoids dotenv timing bug.
// ─────────────────────────────────────────────────────────────────────────────

import { ChatGroq }             from '@langchain/groq'
import { PromptTemplate }         from '@langchain/core/prompts'

const PROMPT = `You are writing a developer onboarding handbook for a software team.

Architecture map:
{architectureJSON}

Danger zones and hidden rules:
{dangerJSON}

Write a complete markdown handbook with EXACTLY these sections in this order:

# CODEBASE ONBOARDING HANDBOOK

## Architecture Overview
(Describe the layers, how they connect, what the main flow is)

## Read These Files First (in order)
(List actual filenames with 1-sentence explanations — ordered from entry point to deepest layer)

## One Flow To Trace End-To-End
(Pick one real user action and trace it through every file that gets touched)

## DANGER ZONES ⚠️
(List every danger zone with the filename, severity, and what rule to follow)

## Hidden Rules Nobody Told You
(List unwritten rules with the evidence from the code)

## Your First Safe Change
(Name a specific file and specific small change a new dev can safely make on Day 1)

## When Something Breaks
(Give debugging starting points — which file to look at first for which type of error)

Use actual filenames throughout. Be direct. Be specific. No filler content.`

/**
 * runGuide — generates the onboarding onboarding handbook markdown
 *
 * @param {object} architectureJSON  — output from runCartographer
 * @param {object} dangerJSON        — output from runArchaeologist
 * @returns {string}                 — markdown handbook string
 */
export async function runGuide(architectureJSON, dangerJSON) {
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
      dangerJSON:       JSON.stringify(dangerJSON),
    })

  const response = await llm.invoke(formatted)

  return response.content   // plain markdown — no JSON parsing needed
}
