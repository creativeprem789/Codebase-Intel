// agents/cartographer.js — Agent 1: Architecture Mapper
// ─────────────────────────────────────────────────────────────────────────────
// Analyses the raw codebase and returns a JSON architecture map.
// Output feeds directly into Agent 2 (Archaeologist) and Agent 3 (Guide).
//
// NOTE: LLM is created INSIDE the function (lazy init) so that dotenv has
// already loaded process.env before the API key is read.
// ─────────────────────────────────────────────────────────────────────────────

import { ChatGroq }             from '@langchain/groq'
import { PromptTemplate }         from '@langchain/core/prompts'
import { safeParseJSON }          from '../utils/jsonHelper.js'

const PROMPT = `You are a software architect analysing a codebase.
Given this code:
{codebaseText}

Return ONLY a valid JSON object with this EXACT structure:
{{
  "layers": [
    {{
      "name": "Layer name e.g. Routes, Services, Models",
      "files": [
        {{
          "filename": "actual filename from the code",
          "purpose": "one sentence: what this file does",
          "callsTo": ["filenames this file depends on"],
          "functions": ["key function or class names exported"]
        }}
      ]
    }}
  ],
  "mainFlow": "describe the primary request flow end-to-end in 1-2 sentences",
  "patterns": ["design pattern the codebase follows e.g. MVC"],
  "violations": ["specific places where patterns are broken — file and line if visible"]
}}

Return ONLY JSON. No explanation. No markdown fences. No comments.`

/**
 * runCartographer — maps the architecture of a codebase
 *
 * @param {string} codebaseText  — combined code string from fileParser
 * @returns {object}             — architecture JSON (or parseError object)
 */
export async function runCartographer(codebaseText) {
  // LLM created HERE (not at module level) so dotenv is fully loaded first
  const llm = new ChatGroq({
    apiKey:          process.env.GROQ_API_KEY,
    model:           'llama-3.3-70b-versatile',
    temperature:     0,
    maxTokens:       4096,
  })

  const formatted = await PromptTemplate
    .fromTemplate(PROMPT)
    .format({ codebaseText })

  const response = await llm.invoke(formatted)

  return safeParseJSON(response.content)
}
