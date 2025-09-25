import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const BarChart = ({ 
  data = [], 
  labels = [], 
  height = 200, 
  showGrid = true,
  animate = true,
  className = '',
  title = '',
  subtitle = ''
}) => {
  const chartData = data.map((value, index) => ({
    name: labels[index] || `Day ${index + 1}`,
    value: value,
    index: index
  }));

  if (!data || data.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-800/30 rounded-lg border border-gray-700/50 ${className}`} style={{ height }}>
        <div className="text-gray-500 text-4xl mb-2">📊</div>
        <span className="text-gray-400 text-sm">No data available</span>
        <span className="text-gray-500 text-xs mt-1">Data will appear here once bookings are made</span>
      </div>
    );
  }

  const maxValue = Math.max(...data);
  const avgValue = data.reduce((a, b) => a + b, 0) / data.length;
  const totalValue = data.reduce((a, b) => a + b, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 shadow-xl">
          <div className="text-cyan-400 font-medium text-sm mb-1">
            Day {label}
          </div>
          <div className="text-white font-bold text-lg">
            {value} bookings
          </div>
          <div className="text-gray-400 text-xs mt-1">
            {percentage}% of total activity
          </div>
          <div className="text-gray-500 text-xs">
            {value > avgValue ? '↗️ Above average' : value < avgValue ? '↘️ Below average' : '➡️ Average'}
          </div>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (value) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return '#06b6d4'; 
    if (intensity > 0.6) return '#3b82f6';
    if (intensity > 0.4) return '#8b5cf6'; 
    if (intensity > 0.2) return '#6366f1'; 
    return '#64748b';
  };

  return (
    <div className={`${className}`}>
      {/* Chart Header */}
      {(title || subtitle) && (
        <div className="mb-4 px-2">
          {title && (
            <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm">{subtitle}</p>
          )}
        </div>
      )}

      {/* Statistics Bar */}
      <div className="grid grid-cols-4 gap-3 mb-4 px-2">
        <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/30">
          <div className="text-xs text-gray-400 mb-1">Peak</div>
          <div className="text-cyan-400 font-bold text-sm">{maxValue}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/30">
          <div className="text-xs text-gray-400 mb-1">Average</div>
          <div className="text-blue-400 font-bold text-sm">{avgValue.toFixed(1)}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/30">
          <div className="text-xs text-gray-400 mb-1">Total</div>
          <div className="text-green-400 font-bold text-sm">{totalValue}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/30">
          <div className="text-xs text-gray-400 mb-1">Days</div>
          <div className="text-purple-400 font-bold text-sm">{data.length}</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30" style={{ height: height - 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
            barCategoryGap="20%"
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)"
                horizontal={true}
                vertical={false}
              />
            )}
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: '#9CA3AF', 
                fontSize: 11,
                fontWeight: 500
              }}
              interval={Math.floor(data.length / 8)} 
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: '#9CA3AF', 
                fontSize: 11,
                fontWeight: 500
              }}
              domain={[0, 'dataMax + 1']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              animationDuration={animate ? 1000 : 0}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.value)}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-400 rounded"></div>
          <span className="text-xs text-gray-400">High Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-xs text-gray-400">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-500 rounded"></div>
          <span className="text-xs text-gray-400">Minimal</span>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
