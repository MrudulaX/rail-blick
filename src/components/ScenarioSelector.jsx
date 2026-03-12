import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { Play, Square, RotateCcw, Zap } from 'lucide-react';

const SEVERITY_CONFIG = {
  low:    { label: 'LOW',    color: '#22c55e', bg: 'bg-green-950/30',  border: 'border-green-900/30'  },
  medium: { label: 'MED',    color: '#eab308', bg: 'bg-yellow-950/30', border: 'border-yellow-900/30' },
  high:   { label: 'HIGH',   color: '#f97316', bg: 'bg-orange-950/30', border: 'border-orange-900/30' },
  critical:{ label: 'CRIT', color: '#ef4444', bg: 'bg-red-950/30',    border: 'border-red-900/40'   },
};

function getSeverity(delayMin) {
  if (delayMin >= 130) return SEVERITY_CONFIG.critical;
  if (delayMin >= 100) return SEVERITY_CONFIG.high;
  if (delayMin >= 80)  return SEVERITY_CONFIG.medium;
  return SEVERITY_CONFIG.low;
}

export default function ScenarioSelector() {
  const { data, activeCascade, triggerScenario, stopScenario, resetCascade, isRunning } = useContext(CascadeContext);
  const scenarios = data.scenarios || [];

  return (
    <div className="bg-[#08080f]/95 backdrop-blur-sm border border-[#1a1a2e] rounded-lg p-3">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-[10px] font-bold tracking-widest text-gray-500">CASCADE SCENARIOS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-700">{scenarios.length} scenarios</span>
          {activeCascade && (
            <button
              onClick={resetCascade}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded text-[9px] text-gray-400 hover:text-cyan-400 hover:border-cyan-900/50 transition-all font-bold tracking-wider"
            >
              <RotateCcw className="w-3 h-3" />
              RESET
            </button>
          )}
        </div>
      </div>

      {/* Scenario cards scrollable row */}
      <div className="flex gap-2.5 overflow-x-auto hidden-scrollbar pb-1">
        {scenarios.map((scenario) => {
          const isActive = activeCascade?.id === scenario.id;
          const sev      = getSeverity(scenario.delay_min);

          return (
            <div
              key={scenario.id}
              onClick={() => !isRunning || isActive ? (isActive ? null : triggerScenario(scenario.id)) : triggerScenario(scenario.id)}
              className={`
                flex-shrink-0 w-52 rounded-lg p-3 cursor-pointer transition-all duration-200 border
                ${isActive
                  ? `${sev.bg} ${sev.border} shadow-lg`
                  : 'bg-[#0d0d1a] border-[#1e1e2e] hover:border-gray-600 hover:-translate-y-0.5'
                }
              `}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-gray-600 tracking-widest font-mono">{scenario.id}</span>
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded tracking-wider"
                  style={{ color: sev.color, background: `${sev.color}18`, border: `1px solid ${sev.color}30` }}
                >
                  {sev.label}
                </span>
              </div>

              {/* Name */}
              <div className="text-xs font-bold text-white leading-tight mb-2 line-clamp-2">
                {scenario.name}
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-mono">{scenario.trigger_station}</span>
                  <span className="text-[10px]" style={{ color: sev.color }}>+{scenario.delay_min} min</span>
                </div>
                <button
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-red-500 text-white scale-110'
                      : 'bg-[#1a1a2e] text-gray-500 hover:bg-[#252535] hover:text-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    isActive ? resetCascade() : triggerScenario(scenario.id);
                  }}
                >
                  {isActive
                    ? <Square className="w-3 h-3" />
                    : <Play className="w-3 h-3 ml-0.5" />
                  }
                </button>
              </div>

              {/* Propagation count */}
              <div className="mt-2 text-[9px] text-gray-700">
                {scenario.propagation.length} stations · {[...new Set(scenario.propagation.flatMap(p => p.affected_trains))].length} trains
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
