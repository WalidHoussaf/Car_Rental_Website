import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DonutChart = ({ 
  data = [], 
  labels = [], 
  colors = ['#8F5300', '#101D42', '#285943', '#2E1F47', '#6E0C18'], 
  size = 200,
  showLabels = true,
  className = ''
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-800/50 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-400 text-sm">No data available</span>
      </div>
    );
  }

  const total = data.reduce((sum, value) => sum + value, 0);
  
  // Transform data for Recharts
  const chartData = data.map((value, index) => ({
    name: labels[index] || `Item ${index + 1}`,
    value: value,
    color: colors[index % colors.length]
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-600/50 rounded-lg px-3 py-2 shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="text-white text-sm font-medium">{data.payload.name}</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">{data.value}</div>
            <div className="text-xs text-gray-400">{((data.value / total) * 100).toFixed(0)}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {/* Legend on the left */}
      {showLabels && (
        <div className="space-y-2 flex-shrink-0">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-3 text-sm min-w-32">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-300 text-xs">{item.name}</span>
              </div>
              <span className="text-white text-xs font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Donut chart on the right */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Total display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={size * 0.25}
              outerRadius={size * 0.4}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
              stroke="#FFFFFF"
              strokeWidth={1}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-70 transition-opacity duration-200 cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonutChart;
