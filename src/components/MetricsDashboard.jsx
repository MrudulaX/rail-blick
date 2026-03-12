import React from 'react';

export default function MetricsDashboard() {
  // Mock data for Phase 4
  const healthScore = 84; 
  const activeCascades = 1;
  const totalRisk = '14.2K';

  return (
    <div className="h-14 bg-cyber-panel border border-cyber-border rounded-lg px-6 flex justify-between items-center">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-cyber-accent animate-pulse"></div>
        <h1 className="text-cyber-white font-bold tracking-widest text-sm">
          RAILSENTINEL <span className="text-cyber-accent">OS</span>
        </h1>
      </div>

      {/* Metrics */}
      <div className="flex gap-8">
        <div className="flex flex-col items-end">
          <span className="text-cyber-muted text-[9px] tracking-widest">NETWORK HEALTH</span>
          <span className={`font-mono font-bold text-sm ${healthScore > 90 ? 'text-[#00FF87]' : healthScore > 70 ? 'text-[#FFD700]' : 'text-[#FF4444]'}`}>
            {healthScore}%
          </span>
        </div>
        
        <div className="flex flex-col items-end border-l border-cyber-border pl-8">
          <span className="text-cyber-muted text-[9px] tracking-widest">ACTIVE CASCADES</span>
          <span className="font-mono font-bold text-sm text-cyber-danger">{activeCascades}</span>
        </div>

        <div className="flex flex-col items-end border-l border-cyber-border pl-8">
          <span className="text-cyber-muted text-[9px] tracking-widest">TTL PAX RISK</span>
          <span className="font-mono font-bold text-sm text-cyber-white">{totalRisk}</span>
        </div>
      </div>
    </div>
  );
}
