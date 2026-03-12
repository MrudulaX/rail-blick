import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { Clock, CheckCircle } from 'lucide-react';

const STATUS_COLORS = {
  red:    { bg: 'bg-red-500',    text: 'text-red-400',    border: 'border-red-500',    delay: 'text-red-300' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', delay: 'text-orange-300' },
  yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400', border: 'border-yellow-500', delay: 'text-yellow-300' },
  normal: { bg: 'bg-gray-700',   text: 'text-gray-500',   border: 'border-gray-700',   delay: 'text-gray-600' },
};

export default function CascadeTimeline() {
  const { activeCascade, stationStatus, stationsAffected, data } = useContext(CascadeContext);

  if (!activeCascade) {
    return (
      <div className="h-full flex items-center justify-center gap-3 px-6 text-gray-700">
        <CheckCircle className="w-4 h-4 text-green-900" />
        <span className="text-[10px] tracking-widest font-bold">ALL CORRIDORS NOMINAL — SELECT A SCENARIO TO SIMULATE PROPAGATION</span>
      </div>
    );
  }

  const steps = activeCascade.propagation;

  return (
    <div className="h-full flex flex-col px-4 py-2">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-3 h-3 text-gray-500" />
        <span className="text-[9px] font-bold tracking-widest text-gray-600">CASCADE PROPAGATION TIMELINE</span>
        <span className="text-[9px] text-gray-700 ml-auto">
          {stationsAffected.length}/{steps.length} stations hit
        </span>
      </div>

      {/* Timeline row */}
      <div className="flex items-center gap-0 flex-1 min-w-0 overflow-x-auto hidden-scrollbar">
        {steps.map((step, i) => {
          const status  = stationStatus[step.station_code] || 'normal';
          const isHit   = stationsAffected.includes(step.station_code);
          const isTrig  = i === 0;
          const cfg     = STATUS_COLORS[status];
          const stn     = data.stations.find(s => s.code === step.station_code);

          return (
            <div key={step.station_code} className="flex items-center min-w-0">
              {/* Station pill */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Delay badge above */}
                <div className={`text-[9px] font-bold mb-1 tabular-nums ${isHit ? cfg.delay : 'text-gray-700'}`}>
                  {isHit ? `+${step.delay_added}m` : `+${step.delay_added}m`}
                </div>

                {/* Circle */}
                <div className={`
                  relative w-8 h-8 rounded-full border-2 flex items-center justify-center text-[9px] font-black transition-all duration-500
                  ${isHit ? `${cfg.bg} ${cfg.border} text-white shadow-lg` : 'bg-[#1a1a2e] border-[#2a2a3e] text-gray-600'}
                  ${isTrig && isHit ? 'scale-110' : ''}
                `}>
                  {isTrig ? '⚡' : isHit ? '●' : '○'}
                  {/* Pulse ring for trigger */}
                  {isTrig && isHit && (
                    <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-60" />
                  )}
                </div>

                {/* Station code below */}
                <div className={`text-[9px] font-bold mt-1 ${isHit ? cfg.text : 'text-gray-700'}`}>
                  {step.station_code}
                </div>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 flex-shrink-0 transition-all duration-700 ${
                  isHit && stationsAffected.includes(steps[i + 1]?.station_code)
                    ? 'bg-orange-500'
                    : isHit
                    ? 'bg-gradient-to-r from-orange-500 to-gray-700'
                    : 'bg-[#1a1a2e]'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
