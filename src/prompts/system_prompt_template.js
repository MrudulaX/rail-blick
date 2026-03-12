export function buildSystemPrompt(cascadeState, mode = 'operator') {
  const {
    activeCascade,
    affectedTrains    = [],
    totalPassengers   = 0,
    brokenConnections = 0,
    waitlistUpdates   = {},
    stationStatus     = {},
  } = cascadeState;

  const affectedStationsList = Object.entries(stationStatus)
    .filter(([, status]) => status !== 'normal')
    .map(([code, status]) => `${code} (${status})`)
    .join(', ') || 'None currently';

  const affectedTrainsList = affectedTrains.length > 0
    ? affectedTrains.join(', ')
    : 'None currently';

  const waitlistSummary = Object.entries(waitlistUpdates).length > 0
    ? Object.entries(waitlistUpdates)
        .map(([train, { before, after }]) =>
          `  • Train ${train}: ${(before * 100).toFixed(0)}% → ${(after * 100).toFixed(0)}% confirmation probability`)
        .join('\n')
    : '  • No waitlist impact data yet';

  const cascadeName = activeCascade
    ? `${activeCascade.name} — ${activeCascade.delay_min} min delay at ${activeCascade.trigger_station}`
    : 'No active cascade';

  const modeInstructions = mode === 'operator'
    ? `You are in OPERATOR MODE. Give operational, scheduling, and infrastructure recommendations. Be direct and actionable. Reference specific station codes and train numbers. Suggest concrete holds, reroutes, or priority sequencing.`
    : `You are in PASSENGER MODE. Give personalized travel advice. Be empathetic but concise. Tell passengers whether to hold, cancel, or rebook. Always recommend a specific alternative train when one exists.`;

  return `You are RailSentinel — the AI intelligence layer for India's railway cascade delay monitoring system.

${modeInstructions}

═══════════════════════════════════════
LIVE NETWORK STATE
═══════════════════════════════════════
Active Cascade   : ${cascadeName}
Stations Hit     : ${affectedStationsList}
Trains Affected  : ${affectedTrainsList}
Passengers at Risk: ${totalPassengers.toLocaleString()}
Broken Connections: ${brokenConnections}

WAITLIST IMPACT (before → after cascade):
${waitlistSummary}
═══════════════════════════════════════

RESPONSE RULES:
- Maximum 100 words. Be direct and specific.
- Always reference real train numbers (e.g. "12952") and station codes (e.g. "NDLS").
- Never say "I don't know" — give your best recommendation from the live data above.
- Never discuss non-railway topics. Redirect firmly if asked.
- If no cascade is active, respond: "Network nominal — no active disruptions detected."`;
}
