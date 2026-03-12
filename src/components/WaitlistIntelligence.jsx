import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function WaitlistIntelligence() {
  const { activeCascade } = useContext(CascadeContext);

  // Mock data - in reality, Dev 3 computes this by calling Dev 1's XGBoost logic
  const mockWaitlistData = [
    { train: '12952', before: 82, after: 41 },
    { train: '12954', before: 67, after: 34 },
    { train: '12926', before: 59, after: 18 },
    { train: '12216', before: 45, after: 12 },
  ];

  if (!activeCascade) return null;

  return (
    <div className="bg-[#0a0a14] border border-gray-800 rounded-lg p-5">
      <div className="text-xs font-bold text-gray-400 tracking-widest mb-4">CONFIRMATION PROBABILITY COLLAPSE</div>
      
      <div className="h-64 mt-4 text-xs font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockWaitlistData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333344" vertical={false} />
            <XAxis dataKey="train" stroke="#888899" tick={{fill: '#888899'}} />
            <YAxis stroke="#888899" tick={{fill: '#888899'}} dx={-5} />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: '#0a0a14', borderColor: '#333344', color: '#fff' }}
              itemStyle={{ fontFamily: 'monospace' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            <Bar dataKey="before" name="WL Conf. Before" fill="#22c55e" radius={[2, 2, 0, 0]} />
            <Bar dataKey="after" name="WL Conf. After" fill="#ef4444" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
