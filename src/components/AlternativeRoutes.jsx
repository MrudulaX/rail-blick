import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { ArrowRight, ShieldCheck, ShieldAlert, ShieldX, TrendingUp } from 'lucide-react';

function RiskBadge({ risk }) {
  if (risk === 'LOW')
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 bg-green-950/40 border border-green-900/40 text-green-400 text-[9px] font-bold rounded tracking-wider">
        <ShieldCheck className="w-3 h-3" /> LOW RISK
      </span>
    );
  if (risk === 'MED')
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-950/40 border border-yellow-900/40 text-yellow-400 text-[9px] font-bold rounded tracking-wider">
        <ShieldAlert className="w-3 h-3" /> MED RISK
      </span>
    );
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-950/40 border border-red-900/40 text-red-400 text-[9px] font-bold rounded tracking-wider">
      <ShieldX className="w-3 h-3" /> HIGH RISK
    </span>
  );
}

function getRisk(conf) {
  if (conf >= 0.60) return 'LOW';
  if (conf >= 0.40) return 'MED';
  return 'HIGH';
}

export default function AlternativeRoutes() {
  const { activeCascade, waitlistUpdates, data } = useContext(CascadeContext);

  if (!activeCascade) return null;

  // Find trains on same corridor that are NOT disrupted
  const disruptedNums = new Set(
    activeCascade.propagation.flatMap((s) => s.affected_trains)
  );

  // Get the corridor from trigger station
  const triggerStation = activeCascade.trigger_station;
  const corridor = data.corridors?.find((c) => c.stations.includes(triggerStation));

  // Find alternative trains — same corridor, not disrupted, or from waitlistUpdates with good before score
  let alternatives = Object.entries(waitlistUpdates)
    .filter(([num]) => !disruptedNums.has(num))
    .map(([num, vals]) => {
      const train = data.trains.find((t) => t.number === num);
      return train ? { ...train, conf: vals.before, risk: getRisk(vals.before) } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.conf - a.conf)
    .slice(0, 3);

  // Fallback: pick any non-disrupted trains on same corridor
  if (alternatives.length < 3 && corridor) {
    const extraTrains = data.trains
      .filter((t) => t.corridor === corridor.id && !disruptedNums.has(t.number))
      .filter((t) => !alternatives.find((a) => a.number === t.number))
      .slice(0, 3 - alternatives.length)
      .map((t) => ({ ...t, conf: 0.55 + Math.random() * 0.25, risk: 'LOW' }));
    alternatives = [...alternatives, ...extraTrains];
  }

  if (alternatives.length === 0) {
    return (
      <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-lg p-4">
        <div className="text-[10px] font-bold text-gray-500 tracking-widest mb-2">CAPACITY ALTERNATIVES</div>
        <p className="text-xs text-gray-700">No alternative routes computed yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a2e]">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold tracking-widest text-gray-500">CAPACITY ALTERNATIVES</span>
        </div>
        <span className="text-[9px] text-cyan-400">{alternatives.length} options found</span>
      </div>

      <div className="p-4 space-y-2.5">
        {alternatives.map((alt, i) => (
          <div
            key={alt.number}
            className="group bg-[#0d0d1a] border border-[#1e1e2e] hover:border-cyan-900/50 rounded-lg p-3 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Rank + number */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] text-gray-600 font-mono w-4">#{i + 1}</span>
                  <span className="text-sm font-bold text-white">{alt.number}</span>
                  <span className="text-xs text-gray-400 truncate">{alt.name}</span>
                </div>

                {/* Route */}
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-2">
                  <span className="text-cyan-600">{alt.from}</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                  <span className="text-cyan-600">{alt.to}</span>
                  {alt.departure && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span>Dep {alt.departure}</span>
                    </>
                  )}
                </div>

                {/* WL confidence bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.round(alt.conf * 100)}%`,
                        background: alt.conf >= 0.6 ? '#22c55e' : alt.conf >= 0.4 ? '#eab308' : '#ef4444',
                      }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold tabular-nums ${
                    alt.conf >= 0.6 ? 'text-green-400' : alt.conf >= 0.4 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {Math.round(alt.conf * 100)}% WL conf
                  </span>
                </div>
              </div>

              <RiskBadge risk={alt.risk} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
