import React from 'react';
import RailMap from './components/RailMap';
import PassengerImpactPanel from './components/PassengerImpactPanel';
import WaitlistIntelligence from './components/WaitlistIntelligence';
import ScenarioSelector from './components/ScenarioSelector';

export default function App() {
  return (
    <div className="h-screen w-screen bg-cyber-bg p-4 flex flex-col gap-4 overflow-hidden">
      {/* Top Header Placeholder (MetricsDashboard goes here later) */}
      <header className="h-12 bg-cyber-panel border border-cyber-border rounded-lg flex items-center px-6">
        <h1 className="text-cyber-white font-bold tracking-widest text-sm">RAILSENTINEL <span className="text-cyber-accent">OS</span></h1>
      </header>
      
      {/* Main 60/40 Split */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* LEFT COLUMN: Map (60%) */}
        <div className="col-span-7 h-full">
          <RailMap />
        </div>
        
        {/* RIGHT COLUMN: Intelligence Panels (40%) */}
        <div className="col-span-5 h-full overflow-y-auto pr-2 custom-scrollbar flex flex-col">
          <PassengerImpactPanel />
          <WaitlistIntelligence />
          <ScenarioSelector />
        </div>
        
      </div>
    </div>
  );
}
