import { useState } from 'react';
import { CascadeProvider } from './context/CascadeContext';
import RailMap from './components/RailMap';
import MetricsDashboard from './components/MetricsDashboard';
import ScenarioSelector from './components/ScenarioSelector';
import PassengerImpactPanel from './components/PassengerImpactPanel';
import WaitlistIntelligence from './components/WaitlistIntelligence';
import AlternativeRoutes from './components/AlternativeRoutes';
import CascadeTimeline from './components/CascadeTimeline';
import AssistantPanel from './components/AssistantPanel';

function AppLayout() {
  const [viewMode, setViewMode] = useState('operator');

  return (
    <div className="h-screen w-screen bg-[#07070f] text-gray-300 flex flex-col font-mono overflow-hidden">

      {/* ── Top Bar ── */}
      <MetricsDashboard viewMode={viewMode} setViewMode={setViewMode} />

      {/* ── Main Content: 60/40 split ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Map + Timeline ── */}
        <div className="w-[60%] flex flex-col border-r border-[#1a1a2e] relative">

          {/* Scenario Selector floating over map */}
          <div className="absolute top-3 left-3 right-3 z-[1000]">
            <ScenarioSelector />
          </div>

          {/* Map */}
          <div className="flex-1 bg-[#0a0a14]">
            <RailMap />
          </div>

          {/* Timeline strip */}
          <div className="h-[88px] bg-[#0a0a10] border-t border-[#1a1a2e] z-10 shrink-0">
            <CascadeTimeline />
          </div>
        </div>

        {/* ── Right: Intelligence Panels ── */}
        <div className="w-[40%] bg-[#0b0b14] overflow-y-auto thin-scrollbar flex flex-col">
          <div className="p-4 space-y-4">
            <PassengerImpactPanel />
            <WaitlistIntelligence />
            <AlternativeRoutes />
            <AssistantPanel viewMode={viewMode} />
            {/* Spacer at bottom */}
            <div className="h-2" />
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
