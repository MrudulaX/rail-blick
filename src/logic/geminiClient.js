import { buildSystemPrompt } from '../prompts/system_prompt_template.js';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL   = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent`;

const FALLBACK_RESPONSES = {
  operator_0: "Hold 12952 at BPL for 18 minutes to allow platform clearance at NDLS. Reroute 12622 via Nagpur loop to prevent cascade reaching BZA. Estimated corridor recovery: 2.5 hours.",
  operator_1: "Cascade risk CRITICAL on C4. Issue speed advisories NDLS–NGP segment immediately. 12616 and 12622 are priority — 1,368 combined passengers at risk. Recommend 25-min departure hold on 22692.",
  operator_2: "Delay 22692 departure from NDLS by 25 min. This breaks the cascade lock at BPL and prevents secondary delay to 12622, reducing passenger impact by ~400.",
  passenger_0: "Your WL/12 on 12952 dropped from 74% → 38% due to the NGP cascade. Switch to 22210 Mumbai Duronto (71% confirmation). Book now — the window closes in 2 hours.",
  passenger_1: "Best alternative: 22210 Mumbai Duronto, NDLS 22:10, 71% confirmation. Second option: 12926 Paschim Express — slower but 89% SL confirmation. Avoid 12952 today.",
  passenger_2: "Your 12953 → 12274 connection at NDLS has a 40-min window. Sufficient if 12953 recovers partially. If delay exceeds 90 min, cancel and rebook 12274 for next day.",
};

export const DEMO_QUERIES = {
  operator: [
    "Which scheduling change reduces this cascade the most?",
    "What is the current risk level for the C4 corridor?",
    "Which trains should I prioritize for recovery?",
  ],
  passenger: [
    "My WL/12 on 12952 — should I cancel?",
    "What's the best alternative train to Mumbai right now?",
    "Will my connection at NDLS still work?",
  ],
};

/**
 * Send a message to Gemini with live cascade context injected.
 *
 * @param {string}   userMessage   - What the user typed or the pre-baked query
 * @param {object}   cascadeState  - Current state from CascadeContext
 * @param {string}   mode          - 'operator' | 'passenger'
 * @param {function} onChunk       - Called with each streamed text chunk (string)
 * @param {function} onDone        - Called when stream finishes (receives full text)
 * @param {function} onError       - Called on unrecoverable error
 */
export async function sendMessage(userMessage, cascadeState, mode, onChunk, onDone, onError) {
  if (!GEMINI_API_KEY) {
    console.warn('[RailSentinel] No Gemini API key — using fallback response.');
    simulateFallback(`${mode}_0`, onChunk, onDone);
    return;
  }

  const systemInstruction = buildSystemPrompt(cascadeState, mode);
  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}&alt=sse`;

  const body = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 200,
      temperature: 0.4,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API ${response.status}: ${errText}`);
    }

    const reader  = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText  = '';
    let buffer    = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const chunk  = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunk) {
            fullText += chunk;
            onChunk(chunk);
          }
        } catch {
        }
      }
    }

    onDone(fullText);

  } catch (err) {
    console.error('[RailSentinel] Gemini API failed:', err.message);
    simulateFallback(`${mode}_0`, onChunk, onDone);
    if (onError) onError(err);
  }
}

function simulateFallback(key, onChunk, onDone) {
  const text = FALLBACK_RESPONSES[key] || FALLBACK_RESPONSES['operator_0'];
  let i = 0;

  const interval = setInterval(() => {
    if (i >= text.length) {
      clearInterval(interval);
      onDone(text);
      return;
    }
    onChunk(text.slice(i, i + 3));
    i += 3;
  }, 25);
}
