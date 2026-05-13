import { SimulationResult } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

interface Props {
  data: SimulationResult[];
  loading: boolean;
}

export default function SIRGraph({ data, loading }: Props) {
  if (loading && data.length === 0) {
    return <div className="h-[400px] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
          <XAxis 
            dataKey="day" 
            stroke="#A1A1AA" 
            tick={{ fill: '#A1A1AA' }} 
            tickMargin={10} 
            tickLine={false} 
          />
          <YAxis 
            stroke="#A1A1AA" 
            tick={{ fill: '#A1A1AA' }} 
            tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#121214', borderColor: '#27272A', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          
          <Line type="monotone" dataKey="susceptible" name="Susceptible" stroke="#3B82F6" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="infected" name="Infected" stroke="#EF4444" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="recovered" name="Recovered" stroke="#10B981" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
