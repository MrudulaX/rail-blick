import React, { useState } from 'react';

const mockScenarios = [
  { id: 'S1', trigger: 'NDLS', name: 'New Delhi Severe Congestion', delay: '120 min', impact: '~14k passengers' },
  { id: 'S2', trigger: 'NGP', name: 'Nagpur Signal Failure', delay: '180 min', impact: '~22k passengers' },
  { id: 'S3', trigger: 'BCT', name: 'Mumbai Platform Closure', delay: '90 min', impact: '~8k passengers' }
];

// In Phase 4, onScenarioClick will trigger the actual cascade context
export default function ScenarioSelector({ onScenarioClick }) {
  const [activeId, setActiveId] = useState(null);

  const handleClick = (scenario) => {
    setActiveId(scenario.id);
    if (onScenarioClick) onScenarioClick(scenario);
  };

  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5 mt-4">
      <h3 className="text-cyber-muted text-[11px] tracking-widest uppercase mb-4">
        Select Cascade Scenario
      </h3>
      
      <div className="flex flex-col gap-2">
        {mockScenarios.map(s => (
          <button
            key={s.id}
            onClick={() => handleClick(s)}
            className={`w-full text-left p-3 rounded-md border transition-all ${
              activeId === s.id 
                ? 'bg-cyber-accent/10 border-cyber-accent border-l-4 border-l-cyber-accent' 
                : 'bg-cyber-card border-cyber-border hover:border-cyber-muted'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs font-bold ${activeId === s.id ? 'text-cyber-accent' : 'text-cyber-white'}`}>
                {s.name}
              </span>
              <span className="text-[10px] text-cyber-danger bg-cyber-danger/10 px-2 py-0.5 rounded">
                {s.delay}
              </span>
            </div>
            <div className="text-[10px] text-cyber-muted">
              Origin: {s.trigger} | Est. Impact: {s.impact}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
