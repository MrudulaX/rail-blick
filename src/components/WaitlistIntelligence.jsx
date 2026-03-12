import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data: P(confirmation) before vs after the delay cascade hits
const mockWaitlistData = [
  { train: '12951 Rajdhani', before: 82, after: 31 },
  { train: '12269 Duronto', before: 75, after: 12 },
  { train: '12002 Shatabdi', before: 94, after: 44 },
  { train: '12627 Karnataka', before: 50, after: 5 }
];

export default function WaitlistIntelligence() {
  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-5 mt-4">
      <h3 className="text-cyber-accent text-[11px] tracking-widest uppercase mb-4">
        Waitlist Confirmation Risk Analysis (XGBoost)
      </h3>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockWaitlistData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <XAxis dataKey="train" stroke="#4a4a6a" fontSize={10} tickLine={false} />
            <YAxis stroke="#4a4a6a" fontSize={10} tickLine={false} tickFormatter={(val) => `${val}%`} />
            <Tooltip 
              cursor={{ fill: '#252535' }}
              contentStyle={{ backgroundColor: '#10101a', border: '1px solid #1a1a28', fontSize: '11px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            <Bar dataKey="before" name="Before Cascade" fill="#00FF87" radius={[2, 2, 0, 0]} />
            <Bar dataKey="after" name="After Cascade" fill="#FF4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
