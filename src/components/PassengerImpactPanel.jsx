import { useContext, useEffect, useState, useRef } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { Users, Train, Link2, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

function AnimatedCounter({ targetValue, duration = 1200, colorClass = 'text-white' }) {
  const [current, setCurrent] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const diff  = targetValue - start;
    if (diff === 0) return;

    const startTime = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const val = Math.floor(start + diff * easeOut(t));
      setCurrent(val);
      if (t < 1) requestAnimationFrame(step);
      else { setCurrent(targetValue); prevRef.current = targetValue; }
    };

    requestAnimationFrame(step);
  }, [targetValue, duration]);

  return (
    <span className={`text-3xl font-black tabular-nums tracking-tighter ${colorClass}`}>
      {current.toLocaleString()}
    </span>
  );
}

function MetricCard({ icon: Icon, value, label, colorClass, bgClass, borderClass, sublabel }) {
  return (
    <div className={`${bgClass} ${borderClass} border rounded-lg p-4 flex flex-col gap-1.5`}>
      <div className="flex items-center justify-between">
        <span className={`text-[9px] tracking-widest font-bold ${colorClass} opacity-70`}>{label}</span>
        <Icon className={`w-3.5 h-3.5 ${colorClass} opacity-60`} />
      </div>
      <AnimatedCounter targetValue={value} colorClass={colorClass} />
      {sublabel && <span className="text-[10px] text-gray-600">{sublabel}</span>}
    </div>
  );
}

export default function PassengerImpactPanel() {
  const { passengersAtRisk, trainsDisrupted, brokenConnections, activeCascade, isRunning, cascadeComplete } = useContext(CascadeContext);

  const isNominal = !activeCascade;

  return (
    <div className="bg-[#0a0a14] border border-[#1a1a2e] rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a2e]">
        <div className="flex items-center gap-2">
          <TrendingDown className={`w-3.5 h-3.5 ${isRunning ? 'text-red-400 animate-pulse' : 'text-gray-600'}`} />
          <span className="text-[10px] font-bold tracking-widest text-gray-500">IMPACT TELEMETRY</span>
        </div>
        {isNominal ? (
          <div className="flex items-center gap-1.5 text-[9px] text-green-500 font-bold tracking-wider">
            <CheckCircle className="w-3 h-3" />
            NOMINAL
          </div>
        ) : cascadeComplete ? (
          <div className="flex items-center gap-1.5 text-[9px] text-yellow-400 font-bold tracking-wider">
            <AlertCircle className="w-3 h-3" />
            CASCADE COMPLETE
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[9px] text-red-400 font-bold tracking-wider">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            LIVE
          </div>
        )}
      </div>

      {/* Metric cards */}
      <div className="p-4 space-y-3">
        <MetricCard
          icon={Users}
          value={passengersAtRisk}
          label="TOTAL PASSENGERS AFFECTED"
          colorClass="text-red-400"
          bgClass="bg-red-950/20"
          borderClass="border-red-900/30"
          sublabel={passengersAtRisk > 10000 ? '⚠ Mass disruption event' : passengersAtRisk > 0 ? 'Impact propagating...' : 'No passengers at risk'}
        />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Train}
            value={trainsDisrupted.length}
            label="TRAINS DISRUPTED"
            colorClass="text-orange-400"
            bgClass="bg-orange-950/20"
            borderClass="border-orange-900/30"
          />
          <MetricCard
            icon={Link2}
            value={brokenConnections}
            label="CONNECTIONS BROKEN"
            colorClass="text-yellow-400"
            bgClass="bg-yellow-950/20"
            borderClass="border-yellow-900/30"
          />
        </div>

        {/* Disrupted train tags */}
        {trainsDisrupted.length > 0 && (
          <div>
            <div className="text-[9px] text-gray-600 tracking-widest mb-2">DISRUPTED SERVICES</div>
            <div className="flex flex-wrap gap-1.5">
              {trainsDisrupted.slice(0, 8).map((train) => (
                <span
                  key={train.number}
                  className="px-2 py-0.5 bg-[#1a1a2e] border border-orange-900/40 rounded text-[10px] text-orange-300 font-mono"
                >
                  {train.number} · {train.name.split(' ').slice(0, 2).join(' ')}
                </span>
              ))}
              {trainsDisrupted.length > 8 && (
                <span className="px-2 py-0.5 text-[10px] text-gray-600">+{trainsDisrupted.length - 8} more</span>
              )}
            </div>
          </div>
        )}

        {/* Idle state */}
        {isNominal && (
          <div className="flex flex-col items-center justify-center py-4 text-gray-700">
            <CheckCircle className="w-8 h-8 mb-2 text-green-900" />
            <p className="text-xs text-center">All corridors nominal.<br/>Select a scenario to begin simulation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
