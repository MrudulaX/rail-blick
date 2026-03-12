import { useState } from 'react';
import RailMap from './components/RailMap';
import MetricsDashboard from './components/MetricsDashboard';
import ScenarioSelector from './components/ScenarioSelector';
import PassengerImpactPanel from './components/PassengerImpactPanel';
import WaitlistIntelligence from './components/WaitlistIntelligence';
import AlternativeRoutes from './components/AlternativeRoutes';
import CascadeTimeline from './components/CascadeTimeline';
import { CascadeProvider } from './context/CascadeContext';

function AppLayout() {
  const [viewMode, setViewMode] = useState('operator'); // 'operator' or 'passenger'

  return (
    <div className="h-screen w-screen bg-[#07070f] text-gray-300 flex flex-col font-mono overflow-hidden">
      
      {/* Top Bar - 100% width */}
      <MetricsDashboard viewMode={viewMode} setViewMode={setViewMode} />

      {/* Main Content Area - Split 60/40 */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Side: Map Container (60%) */}
        <div className="w-[60%] flex flex-col border-r border-gray-800 relative">
          
          {/* Scenario Overlay - Floating over map */}
          <div className="absolute top-4 left-4 z-10 w-[95%]">
             <ScenarioSelector />
          </div>

          <div className="flex-1 bg-[#0a0a14] z-0">
            <RailMap />
          </div>

          {/* Bottom Timeline Overlay */}
          <div className="h-24 bg-[#0d0d1a] border-t border-gray-800 z-10 w-full overflow-x-auto shadow-2xl">
             <CascadeTimeline />
          </div>
        </div>

        {/* Right Side: Intelligence Panels (40%) */}
        <div className="w-[40%] bg-[#0d0d1a] overflow-y-auto hidden-scrollbar flex flex-col">
          <div className="p-6 space-y-6">
            <PassengerImpactPanel />
            <WaitlistIntelligence />
            <AlternativeRoutes />
            {/* Dev 3 will inject AssistantPanel.jsx here later */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CascadeProvider>
      <AppLayout />
    </CascadeProvider>
  );
}
