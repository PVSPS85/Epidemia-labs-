'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Play, Pause, RefreshCw, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Simulation Controls
  const [population, setPopulation] = useState(1000000);
  const [r0, setR0] = useState(2.5);
  const [days, setDays] = useState(100);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.runSimulation({ population, r0, days });
      setData(res.data);
    } catch (error) {
      console.error('Simulation failed', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const peakInfection = data.length > 0 ? Math.max(...data.map(d => d.infected)) : 0;
  const peakDay = data.length > 0 ? data.find(d => d.infected === peakInfection)?.day : 0;

  return (
    <div className="p-8 h-full flex flex-col z-10 relative">
      {/* Header & Controls */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Global Epidemic Analytics
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#00D1FF]/20 text-[#00D1FF] border border-[#00D1FF]/50 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D1FF]"></span>
              Live
            </span>
          </h2>
          <p className="text-gray-400 text-sm mt-1">Real-time epidemiological modeling and prediction engine.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#11141D] border border-[#1C212B] rounded-lg p-1 flex">
            <button className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1C212B] rounded shadow">SIR Model</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-gray-500 hover:text-white transition">SEIR Variant</button>
          </div>
        </div>
      </header>

      {/* Stat Chips */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#11141D] border border-[#1C212B] p-4 rounded-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#00D1FF]/10 rounded-full blur-xl group-hover:bg-[#00D1FF]/20 transition-all"></div>
          <span className="text-xs text-gray-400 font-mono">Population Base (N)</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-2xl font-bold text-white">{population.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="bg-[#11141D] border border-[#1C212B] p-4 rounded-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#A855F7]/10 rounded-full blur-xl group-hover:bg-[#A855F7]/20 transition-all"></div>
          <span className="text-xs text-gray-400 font-mono">Reproduction Rate (R₀)</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-2xl font-bold text-white">{r0.toFixed(2)}</span>
            <span className="text-xs text-[#00D1FF]">+0.4%</span>
          </div>
        </div>

        <div className="bg-[#11141D] border border-[#1C212B] p-4 rounded-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all"></div>
          <span className="text-xs text-gray-400 font-mono">Peak Infection Point</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-2xl font-bold text-white">Day {peakDay}</span>
            <span className="text-xs text-red-400">{Math.round(peakInfection).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#11141D] border border-[#1C212B] p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
          <span className="text-xs text-gray-400 font-mono">System Status</span>
          <div className="flex justify-between items-end mt-2">
            <span className="text-lg font-bold text-[#00D1FF] flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Computing...' : 'Calibrated'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="flex-1 bg-[#11141D] border border-[#1C212B] rounded-xl p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-semibold text-gray-300 font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Epidemic Curve Visualization
          </h3>
          <div className="flex items-center gap-3">
            <input 
              type="range" 
              min="1" max="5" step="0.1" 
              value={r0} 
              onChange={(e) => setR0(parseFloat(e.target.value))}
              onMouseUp={runSimulation}
              className="accent-[#00D1FF] w-32"
            />
            <button 
              onClick={() => { setIsPlaying(!isPlaying); if(!isPlaying) runSimulation(); }}
              className="w-8 h-8 rounded bg-[#00D1FF]/20 text-[#00D1FF] flex items-center justify-center hover:bg-[#00D1FF]/30 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSusceptible" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInfected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecovered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C212B" vertical={false} />
                <XAxis dataKey="day" stroke="#4B5563" tick={{fill: '#9CA3AF', fontSize: 12, fontFamily: 'monospace'}} tickFormatter={(v) => `D${v}`} />
                <YAxis stroke="#4B5563" tick={{fill: '#9CA3AF', fontSize: 12, fontFamily: 'monospace'}} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B0E14', borderColor: '#1C212B', borderRadius: '8px', color: '#fff', fontFamily: 'monospace' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Area type="monotone" dataKey="susceptible" name="Susceptible" stroke="#EAB308" fillOpacity={1} fill="url(#colorSusceptible)" />
                <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#22C55E" fillOpacity={1} fill="url(#colorRecovered)" />
                <Area type="monotone" dataKey="infected" name="Infected" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorInfected)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-mono">Initializing Neural Models...</div>
          )}
        </div>
      </div>
    </div>
  );
}
