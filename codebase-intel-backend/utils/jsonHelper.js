// utils/jsonHelper.js
// ─────────────────────────────────────────────────────────────────────────────
// LLMs sometimes wrap their JSON output in ```json ... ``` markdown fences
// even when you explicitly tell them not to.
// This helper strips those fences and parses safely so the app never crashes.
//
// If JSON.parse fails, it returns { raw: text, parseError: true }
// so the chain can continue with degraded output rather than crash.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * safeParseJSON — strips markdown fences and parses JSON from LLM output
 *
 * @param {string} text  — raw string from LLM response
 * @returns {object}     — parsed JSON object, or { raw, parseError: true }
 */
export function safeParseJSON(text) {
  try {
    // Remove ```json ... ``` or ``` ... ``` fences
    const clean = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim()

    return JSON.parse(clean)

  } catch (err) {
    // JSON.parse failed — degrade gracefully instead of throwing
    console.warn('[jsonHelper] JSON parse failed. Returning raw text wrapper.')
    console.warn('[jsonHelper] Raw text (first 200 chars):', text?.slice(0, 200))

    return {
      raw:        text,
      parseError: true,
      hint:       'LLM returned non-JSON. Check prompt or reduce input size.'
    }
  }
}

/**
 * isParseError — check if a safeParseJSON result is an error object
 *
 * @param {*} obj
 * @returns {boolean}
 */
export function isParseError(obj) {
  return obj && obj.parseError === true
}
