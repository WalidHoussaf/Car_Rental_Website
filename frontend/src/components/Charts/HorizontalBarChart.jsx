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

const HorizontalBarChart = ({ 
  data = [], 
  height = 300, 
  showGrid = true,
  animate = true,
  className = '',
  title = '',
  subtitle = ''
}) => {
  // Transform data for Recharts
  const chartData = data.map((item, index) => ({
    name: item.label,
    value: item.value,
    index: index
  }));

  if (!data || data.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-800/30 rounded-lg border border-gray-700/50 ${className}`} style={{ height }}>
        <div className="text-gray-500 text-4xl mb-2">📍</div>
        <span className="text-gray-400 text-sm">No location data available</span>
        <span className="text-gray-500 text-xs mt-1">Data will appear here once bookings are made</span>
      </div>
    );
  }

  // Calculate statistics
  const maxValue = Math.max(...data.map(item => item.value));
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 shadow-xl">
          <div className="text-cyan-400 font-medium text-sm mb-1">
            {label}
          </div>
          <div className="text-white font-bold text-lg">
            {value} bookings
          </div>
          <div className="text-gray-400 text-xs mt-1">
            {percentage}% of total bookings
          </div>
          <div className="text-gray-500 text-xs">
            📍 Pickup location
          </div>
        </div>
      );
    }
    return null;
  };

  // Generate colors based on ranking
  const getBarColor = (index) => {
    const colors = [
      '#06b6d4', // 1st place - cyan
      '#3b82f6', // 2nd place - blue
      '#8b5cf6', // 3rd place - purple
      '#6366f1', // 4th place - indigo
      '#64748b'  // 5th place - gray
    ];
    return colors[index] || '#64748b';
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
      <div className="grid grid-cols-3 gap-3 mb-4 px-2">
        <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/30">
          <div className="text-xs text-gray-400 mb-1">Top Location</div>
          <div className="text-cyan-400 font-bold text-sm truncate">{data[0]?.label || 'N/A'}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/30">
          <div className="text-xs text-gray-400 mb-1">Peak Bookings</div>
          <div className="text-blue-400 font-bold text-sm">{maxValue}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700/30">
          <div className="text-xs text-gray-400 mb-1">Locations</div>
          <div className="text-green-400 font-bold text-sm">{data.length}</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/30" style={{ height: height - 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            layout="horizontal"
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 80,
              bottom: 20,
            }}
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)"
                horizontal={false}
                vertical={true}
              />
            )}
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: '#9CA3AF', 
                fontSize: 11,
                fontWeight: 500
              }}
              domain={[0, 'dataMax + 1']}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: '#9CA3AF', 
                fontSize: 11,
                fontWeight: 500
              }}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              animationDuration={animate ? 1000 : 0}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(index)}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>

      {/* Ranking Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-400 rounded"></div>
          <span className="text-xs text-gray-400">#1 Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-400">#2-3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded"></div>
          <span className="text-xs text-gray-400">#4-5</span>
        </div>
      </div>
    </div>
  );
};

export default HorizontalBarChart;
