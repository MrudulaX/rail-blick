import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { Activity, AlertTriangle, Users, Radio, Shield } from 'lucide-react';

const CORRIDOR_NAMES = {
  C1: 'Delhi–Mumbai',
  C2: 'Delhi–Kolkata',
  C3: 'Mumbai–Chennai',
  C4: 'Delhi–Chennai',
  C5: 'Kolkata–Bangalore',
};

export default function MetricsDashboard({ viewMode, setViewMode }) {
  const { networkHealth, activeCascade, passengersAtRisk, isRunning, cascadeComplete } = useContext(CascadeContext);

  const healthColor =
    networkHealth > 80 ? '#22c55e' :
    networkHealth > 55 ? '#eab308' :
    networkHealth > 30 ? '#f97316' : '#ef4444';



  return (
    <div className="h-14 bg-[#080810] border-b border-[#1a1a2e] flex items-center justify-between px-5 shrink-0 relative overflow-hidden">

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.015) 2px, rgba(0,212,255,0.015) 4px)' }} />

      {/* ── Left: Brand + mode toggle ── */}
      <div className="flex items-center gap-5 z-10">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="w-5 h-5 text-cyan-400" />
            {isRunning && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
          <div className="flex items-baseline gap-0">
            <span className="text-lg font-black tracking-tighter text-cyan-400">RAIL</span>
            <span className="text-lg font-black tracking-tighter text-white">SENTINEL</span>
          </div>
          <span className="text-[9px] text-gray-600 tracking-widest hidden sm:block">v1.0</span>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-[#12121e] rounded-md p-0.5 border border-[#1e1e30]">
          <button
            onClick={() => setViewMode('operator')}
            className={`px-3 py-1 text-[10px] font-bold rounded tracking-widest transition-all duration-200 ${
              viewMode === 'operator'
                ? 'bg-cyan-500/20 text-cyan-400 shadow-inner'
                : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            OPERATOR
          </button>
          <button
            onClick={() => setViewMode('passenger')}
            className={`px-3 py-1 text-[10px] font-bold rounded tracking-widest transition-all duration-200 ${
              viewMode === 'passenger'
                ? 'bg-orange-500/20 text-orange-400 shadow-inner'
                : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            PASSENGER
          </button>
        </div>

        {/* Active cascade badge */}
        {activeCascade && (
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 px-2.5 py-1 rounded text-[10px] text-red-400 font-bold tracking-wider">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            {activeCascade.trigger_station} — {activeCascade.delay_min}MIN DELAY
          </div>
        )}
      </div>

      {/* ── Right: Metrics ── */}
      <div className="flex items-center gap-6 z-10">
        {/* Health */}
        <div className="flex items-center gap-2.5">
          <Activity className="w-3.5 h-3.5" style={{ color: healthColor }} />
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-600 tracking-widest leading-none">NETWORK HEALTH</span>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-20 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${networkHealth}%`, background: healthColor }}
                />
              </div>
              <span className="text-sm font-black tabular-nums leading-none" style={{ color: healthColor }}>
                {networkHealth}%
              </span>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-[#1a1a2e]" />

        {/* Active cascades */}
        <div className="flex items-center gap-2">
          <AlertTriangle className={`w-3.5 h-3.5 ${activeCascade ? 'text-orange-400' : 'text-gray-700'}`} />
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-600 tracking-widest leading-none">ACTIVE CASCADES</span>
            <span className={`text-sm font-black leading-none mt-0.5 ${activeCascade ? 'text-orange-400' : 'text-gray-700'}`}>
              {activeCascade ? '1' : '0'}
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="w-px h-6 bg-[#1a1a2e]" />

        {/* Passengers at risk */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all duration-500 ${
          passengersAtRisk > 0
            ? 'bg-red-900/20 border-red-900/40'
            : 'bg-[#0d0d1a] border-[#1a1a2e]'
        }`}>
          <Users className={`w-3.5 h-3.5 ${passengersAtRisk > 0 ? 'text-red-400' : 'text-gray-700'}`} />
          <div className="flex flex-col">
            <span className={`text-[9px] tracking-widest leading-none ${passengersAtRisk > 0 ? 'text-red-400' : 'text-gray-600'}`}>
              PASSENGERS AT RISK
            </span>
            <span className={`text-sm font-black tabular-nums leading-none mt-0.5 ${passengersAtRisk > 0 ? 'text-red-400' : 'text-gray-700'}`}>
              {passengersAtRisk.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status pill */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-widest border ${
          cascadeComplete
            ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10'
            : isRunning
            ? 'border-red-500/40 text-red-400 bg-red-500/10'
            : 'border-green-500/30 text-green-500 bg-green-500/10'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            cascadeComplete ? 'bg-yellow-400' : isRunning ? 'bg-red-500 animate-ping' : 'bg-green-500'
          }`} />
          {cascadeComplete ? 'CASCADE END' : isRunning ? 'LIVE' : 'NOMINAL'}
        </div>
      </div>
    </div>
  );
}
