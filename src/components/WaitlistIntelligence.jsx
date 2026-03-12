import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const before = payload.find((p) => p.dataKey === 'before');
  const after  = payload.find((p) => p.dataKey === 'after');
  const drop   = before && after ? Math.round((before.value - after.value) * 100) : 0;
  return (
    <div className="bg-[#0a0a14] border border-[#2a2a3e] rounded p-3 font-mono text-xs">
      <div className="text-cyan-400 font-bold mb-2">Train {label}</div>
      <div className="text-green-400">Before: {(before?.value * 100)?.toFixed(0)}%</div>
      <div className="text-red-400">After:  {(after?.value * 100)?.toFixed(0)}%</div>
      <div className="text-orange-400 mt-1 font-bold">▼ {drop}pp drop</div>
    </div>
  );
}

export default function WaitlistIntelligence() {
  const { waitlistUpdates, data, activeCascade } = useContext(CascadeContext);

  if (!activeCascade) return null;

  const updates = Object.entries(waitlistUpdates);
  if (updates.length === 0) {
    return (
      <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-lg p-5">
        <div className="text-[10px] font-bold text-gray-500 tracking-widest mb-3 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" />
          CONFIRMATION PROBABILITY COLLAPSE
        </div>
        <div className="text-xs text-gray-700 text-center py-4">Awaiting cascade propagation...</div>
      </div>
    );
  }

  const chartData = updates.slice(0, 6).map(([num, vals]) => {
    const train = data.trains.find((t) => t.number === num);
    return {
      train: num,
      name: train?.name?.split(' ').slice(0, 2).join(' ') || num,
      before: Number(vals.before?.toFixed(2) || 0),
      after:  Number(vals.after?.toFixed(2) || 0),
      drop:   ((vals.before || 0) - (vals.after || 0)),
    };
  }).sort((a, b) => b.drop - a.drop);

  return (
    <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a2e]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-[10px] font-bold tracking-widest text-gray-500">CONFIRMATION PROBABILITY COLLAPSE</span>
        </div>
        <div className="text-[9px] text-orange-400 font-bold">{updates.length} trains affected</div>
      </div>

      <div className="p-4">
        {/* Summary rows */}
        <div className="space-y-2 mb-4">
          {chartData.slice(0, 4).map((d) => {
            const dropPct = Math.round(d.drop * 100);
            return (
              <div key={d.train} className="flex items-center gap-3">
                <span className="w-14 text-[10px] text-gray-400 font-mono flex-shrink-0">{d.train}</span>
                <div className="flex-1 relative h-5 bg-[#1a1a2e] rounded overflow-hidden">
                  {/* Before bar */}
                  <div
                    className="absolute top-0 left-0 h-full bg-green-600/40 rounded transition-all duration-700"
                    style={{ width: `${d.before * 100}%` }}
                  />
                  {/* After bar */}
                  <div
                    className="absolute top-0 left-0 h-full bg-red-600/70 rounded transition-all duration-700"
                    style={{ width: `${d.after * 100}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 w-16 flex-shrink-0 justify-end">
                  <ChevronDown className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] text-red-400 font-bold">{dropPct}pp</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" vertical={false} />
              <XAxis dataKey="train" stroke="#333344" tick={{ fill: '#555566', fontSize: 9, fontFamily: 'monospace' }} />
              <YAxis stroke="#333344" tick={{ fill: '#555566', fontSize: 9 }} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="before" name="Before" fill="#22c55e" radius={[2, 2, 0, 0]} />
              <Bar dataKey="after"  name="After"  fill="#ef4444"  radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-500 rounded-sm" />
            <span className="text-[9px] text-gray-600">Before cascade</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-sm" />
            <span className="text-[9px] text-gray-600">After cascade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
