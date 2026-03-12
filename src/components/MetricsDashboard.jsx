import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { Activity, Users, AlertTriangle } from 'lucide-react';

export default function MetricsDashboard({ viewMode, setViewMode }) {
  const { networkHealth, activeCascade, passengersAtRisk } = useContext(CascadeContext);

  // Health color logic
  const healthColor = networkHealth > 90 ? 'text-green-500' : networkHealth > 70 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="h-16 bg-[#0a0a14] border-b border-gray-800 flex items-center justify-between px-6 shrink-0">
      
      {/* Brand & Mode Toggle */}
      <div className="flex items-center gap-6">
        <div className="text-xl font-bold tracking-tighter text-white uppercase flex items-center gap-2">
          <span className="text-cyan-400">RAIL</span>SENTINEL
        </div>
        
        <div className="flex bg-[#1a1a2e] rounded p-1 border border-gray-800">
          <button 
            className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'operator' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setViewMode('operator')}
          >
            OPERATOR OPS
          </button>
          <button 
            className={`px-4 py-1 text-xs font-bold rounded ${viewMode === 'passenger' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => setViewMode('passenger')}
          >
            PASSENGER COMMS
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${healthColor}`} />
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 tracking-widest">NETWORK HEALTH</span>
            <span className={`text-sm font-bold ${healthColor}`}>{networkHealth}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-500 tracking-widest">ACTIVE CASCADES</span>
            <span className="text-sm font-bold text-white">{activeCascade ? 1 : 0}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-red-900/20 border border-red-900/50 px-4 py-2 rounded">
          <Users className="w-4 h-4 text-red-500" />
          <div className="flex flex-col">
            <span className="text-[9px] text-red-400 tracking-widest">PASSENGERS AT RISK</span>
            <span className="text-sm font-bold text-red-500">{passengersAtRisk.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
