import React from 'react';

const mockAlternatives = [
  { rank: 1, train: '12926 Paschim Exp', route: 'NDLS → BCT', risk: 'LOW', wl: 'WL/12' },
  { rank: 2, train: '12215 Garib Rath', route: 'DEE → BDTS', risk: 'MED', wl: 'WL/45' },
  { rank: 3, train: '19024 FZR BCT Janta', route: 'NDLS → BCT', risk: 'HIGH', wl: 'RAC/10' }
];

export default function AlternativeRoutes() {
  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5 mt-4">
      <h3 className="text-cyber-accent text-[11px] tracking-widest uppercase mb-4">
        Alternative Route Inference
      </h3>
      
      <div className="flex flex-col gap-2">
        {mockAlternatives.map(alt => (
          <div key={alt.rank} className="bg-cyber-card border border-cyber-border rounded p-3 flex justify-between items-center">
            <div>
              <div className="text-cyber-white text-xs font-bold font-mono">#{alt.rank} {alt.train}</div>
              <div className="text-cyber-muted text-[10px]">{alt.route} | {alt.wl}</div>
            </div>
            
            {/* Risk Badge */}
            <span className={`text-[9px] font-bold px-2 py-1 rounded tracking-widest ${
              alt.risk === 'LOW' ? 'bg-[#00FF8722] text-[#00FF87]' :
              alt.risk === 'MED' ? 'bg-[#FFD70022] text-[#FFD700]' :
              'bg-[#FF444422] text-[#FF4444]'
            }`}>
              {alt.risk} RISK
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
