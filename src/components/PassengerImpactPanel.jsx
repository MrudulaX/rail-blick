import React, { useState, useEffect } from 'react';

// A helper component to animate numbers rolling up
const AnimatedCounter = ({ label, value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Simple animation: increment towards the target value
    const increment = Math.ceil(value / 20) || 1;
    if (displayValue < value) {
      const timer = setTimeout(() => {
        setDisplayValue(prev => Math.min(prev + increment, value));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-md p-4 flex flex-col items-center justify-center">
      <span className="text-cyber-muted text-[10px] tracking-widest uppercase mb-2">{label}</span>
      <span className="text-cyber-accent text-3xl font-bold font-mono">
        {displayValue.toLocaleString()}
      </span>
    </div>
  );
};

export default function PassengerImpactPanel() {
  // TODO: In Phase 4, these numbers will come from CascadeContext
  // For now, we hardcode some mock values that you can manually test changing
  const mockImpact = {
    passengers: 14250,
    trains: 8,
    connections: 312
  };

  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5">
      <h3 className="text-cyber-danger text-[11px] tracking-widest uppercase mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyber-danger animate-pulse"></span>
        Live Impact Assessment
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        <AnimatedCounter label="Passengers Affected" value={mockImpact.passengers} />
        <AnimatedCounter label="Trains Disrupted" value={mockImpact.trains} />
        <AnimatedCounter label="Connections Broken" value={mockImpact.connections} />
      </div>
    </div>
  );
}
