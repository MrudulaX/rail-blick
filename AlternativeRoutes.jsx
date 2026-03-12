import { useContext } from 'react';
import { CascadeContext } from '../context/CascadeContext';
import { ArrowRight, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function AlternativeRoutes() {
  const { activeCascade } = useContext(CascadeContext);

  if (!activeCascade) return null;

  const mockAlternatives = [
    { id: '22210', name: 'Mumbai Duronto', time: '22:10 dept', conf: 71, risk: 'LOW' },
    { id: '12909', name: 'Garib Rath', time: '17:30 dept', conf: 48, risk: 'MED' },
    { id: '12925', name: 'Paschim Express', time: '11:25 dept', conf: 38, risk: 'HIGH' },
  ];

  return (
    <div className="bg-[#0a0a14] border border-gray-800 rounded-lg p-5">
       <div className="text-xs font-bold text-gray-400 tracking-widest mb-4">CAPACITY ALTERNATIVES</div>
       
       <div className="space-y-3">
         {mockAlternatives.map((alt) => (
           <div key={alt.id} className="bg-[#1a1a2e] border border-gray-800 p-3 rounded flex justify-between items-center hover:border-cyan-500/50 cursor-pointer transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">{alt.id}</span>
                  <span className="text-xs text-gray-400">{alt.name}</span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                   {alt.time} <ArrowRight className="w-3 h-3" /> {alt.conf}% WL Conf.
                </div>
              </div>
              
              <div className={`px-2 py-1 flex items-center gap-1 rounded text-[10px] font-bold ${
                alt.risk === 'LOW' ? 'bg-green-500/20 text-green-400' : 
                alt.risk === 'MED' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-500'
              }`}>
                {alt.risk === 'LOW' ? <ShieldCheck className="w-3 h-3"/> : <ShieldAlert className="w-3 h-3"/>}
                {alt.risk} RISK
              </div>
           </div>
         ))}
       </div>
    </div>
  )
}
