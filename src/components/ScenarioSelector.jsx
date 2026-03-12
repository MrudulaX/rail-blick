import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { Play } from 'lucide-react';

export default function ScenarioSelector() {
  const { data, activeCascade, triggerScenario } = useContext(CascadeContext);

  // Get first 10 scenarios
  const scenarios = data.scenarios?.slice(0, 5) || []; // Just 5 for UI spacing right now

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 hidden-scrollbar">
      {scenarios.map((scenario) => {
        const isActive = activeCascade?.id === scenario.id;
        return (
          <div 
            key={scenario.id}
            onClick={() => triggerScenario(scenario.id)}
            className={`
              flex-shrink-0 w-64 bg-[#0a0a14]/90 backdrop-blur border rounded-lg p-3 cursor-pointer transition-all hover:-translate-y-1
              ${isActive ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gray-800 hover:border-gray-500'}
            `}
          >
            <div className="text-[10px] text-gray-500 tracking-widest mb-1">{scenario.id.toUpperCase()}</div>
            <div className="text-sm font-bold text-white truncate">{scenario.name}</div>
            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs">
                <span className="text-gray-400">{scenario.trigger_station}</span> · <span className="text-orange-400 font-bold">{scenario.delay_min}m</span>
              </div>
              <button className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {isActive ? <div className="w-2 h-2 bg-white rounded-sm" /> : <Play className="w-3 h-3 ml-0.5" />}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
