// agents/oracle.js — Agent 4: Codebase Q&A Expert
// ─────────────────────────────────────────────────────────────────────────────
// Called on-demand when a developer asks a question about the codebase.
// Receives the full context (architecture + audit + handbook) stored in rawContext.
//
// NOTE: LLM created inside function (lazy init) — avoids dotenv timing bug.
// ─────────────────────────────────────────────────────────────────────────────

import { ChatGroq }             from '@langchain/groq'
import { PromptTemplate }         from '@langchain/core/prompts'

const PROMPT = `You are an expert software engineer and codebase advisor. Answer the developer's question about this codebase in detail, providing a deep, precise, and technically accurate analysis.

Use the provided codebase context:
=== ARCHITECTURE MAP ===
{architectureJSON}

=== CODE AUDIT & DANGER ZONES ===
{dangerJSON}

=== DEVELOPER HANDBOOK ===
{handbook}

=== USER'S QUESTION ===
{question}

Instructions:
- Explain the codebase mechanics in detail. Trace paths step-by-step through the layers.
- Reference exact filenames, functions, classes, and variable names where applicable.
- If they ask about a danger zone or potential bug, explain the vulnerability and provide a secure code fix or correction.
- Keep your tone professional, authoritative, and direct. Avoid generic advice—be specific to this project.
- If the context doesn't contain the necessary details, explicitly state: "Based on the analyzed codebase segment, there is not enough information to verify this."`

/**
 * askOracle — answers a developer question using the full analysis context
 *
 * @param {string} question  — developer's question string
 * @param {object} context   — rawContext from runChain (architectureJSON, dangerJSON, handbook)
 * @returns {string}         — answer string
 */
export async function askOracle(question, context) {
  // LLM created HERE (not at module level) so dotenv is fully loaded first
  const llm = new ChatGroq({
    apiKey:          process.env.GROQ_API_KEY,
    model:           'llama-3.3-70b-versatile',
    temperature:     0,
    maxTokens:       2048,   // allow ample space for detailed code blocks and step-by-step solutions
  })

  const formatted = await PromptTemplate
    .fromTemplate(PROMPT)
    .format({
      question,
      architectureJSON: JSON.stringify(context.architectureJSON || {}),
      dangerJSON:       JSON.stringify(context.dangerJSON       || {}),
      handbook:         context.handbook                         || 'Not available.',
    })

  const response = await llm.invoke(formatted)

  return response.content
}
