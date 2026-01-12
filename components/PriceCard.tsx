
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

const PriceCard: React.FC<{ price: number; change: number }> = ({ price, change }) => {
  const isPositive = change >= 0;
  
  // Mock chart data
  const data = Array.from({ length: 20 }, (_, i) => ({
    val: price + (Math.random() - 0.5) * 10
  }));

  return (
    <div className="glass-card rounded-2xl p-6 flex items-center justify-between overflow-hidden relative group">
      <div className="z-10">
        <p className="text-neutral-400 text-sm font-medium mb-1 uppercase tracking-wider">Spot Gold (XAU/USD)</p>
        <div className="flex items-baseline space-x-3">
          <h2 className="text-4xl font-bold">${price.toFixed(2)}</h2>
          <span className={`text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>
      </div>
      
      <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 group-hover:opacity-60 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis hide domain={['auto', 'auto']} />
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke={isPositive ? '#10b981' : '#ef4444'} 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceCard;
