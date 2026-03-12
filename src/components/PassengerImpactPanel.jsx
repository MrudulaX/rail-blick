import { useContext, useEffect, useState } from 'react';
import { CascadeContext } from '../context/CascadeContext';

// Reusable Animated Number Component
function AnimatedCounter({ targetValue, duration = 1500, label, colorClass="text-white" }) {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const initialValue = currentValue;
    const diff = targetValue - initialValue;

    if (diff === 0) return;

    const easeOutQuad = t => t * (2 - t);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCurrentValue(Math.floor(initialValue + diff * easeOutQuad(progress)));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrentValue(targetValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [targetValue]);

  return (
    <div className="bg-[#1a1a2e] border border-gray-800 rounded p-4 flex flex-col items-center justify-center">
      <div className={`text-4xl font-black tabular-nums tracking-tighter ${colorClass}`}>
        {currentValue.toLocaleString()}
      </div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 text-center">
        {label}
      </div>
    </div>
  );
}

export default function PassengerImpactPanel() {
  const { passengersAtRisk, trainsDisrupted, brokenConnections } = useContext(CascadeContext);

  return (
    <div className="bg-[#0a0a14] border border-gray-800 rounded-lg p-5">
      <div className="text-xs font-bold text-gray-400 tracking-widest mb-4 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        IMPACT TELEMETRY
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
           <AnimatedCounter targetValue={passengersAtRisk} label="Total Passengers Affected" colorClass="text-red-500" />
        </div>
        <AnimatedCounter targetValue={trainsDisrupted.length} label="Trains Disrupted" colorClass="text-orange-400" />
        <AnimatedCounter targetValue={brokenConnections} label="Connections Broken" colorClass="text-yellow-400" />
      </div>
    </div>
  );
}
