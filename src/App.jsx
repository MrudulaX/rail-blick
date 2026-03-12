import React from 'react';
import RailMap from './components/RailMap';
import PassengerImpactPanel from './components/PassengerImpactPanel';
import WaitlistIntelligence from './components/WaitlistIntelligence';
import AlternativeRoutes from './components/AlternativeRoutes';
import ScenarioSelector from './components/ScenarioSelector';
import MetricsDashboard from './components/MetricsDashboard';

export default function App() {
  return (
    <div className="h-screen w-screen bg-cyber-bg p-4 flex flex-col gap-4 overflow-hidden">
      
      {/* Top Header */}
      <MetricsDashboard />
      
      {/* Main 60/40 Split */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* LEFT COLUMN: Map (60%) */}
        <div className="col-span-7 h-full">
          <RailMap />
        </div>
        
        {/* RIGHT COLUMN: Intelligence Panels (40%) */}
        <div className="col-span-5 h-full overflow-y-auto pr-2 custom-scrollbar flex flex-col pb-10">
          <PassengerImpactPanel />
          <WaitlistIntelligence />
          <AlternativeRoutes />
          <ScenarioSelector />
        </div>
        
      </div>
    </div>
  );
}
