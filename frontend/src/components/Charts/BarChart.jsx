import React from 'react';

const BarChart = ({ 
  data = [], 
  labels = [], 
  width = 400, 
  height = 200, 
  color = '#06b6d4',
  showGrid = true,
  showValues = true,
  animate = true,
  className = ''
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-800/50 rounded-lg ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-sm">No data available</span>
      </div>
    );
  }

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxValue = Math.max(...data);
  const barWidth = chartWidth / data.length * 0.8;
  const barSpacing = chartWidth / data.length * 0.2;

  // Generate grid lines
  const generateGridLines = () => {
    const lines = [];
    const gridCount = 5;
    
    // Horizontal grid lines
    for (let i = 0; i <= gridCount; i++) {
      const y = padding + (i * chartHeight) / gridCount;
      lines.push(
        <line
          key={`h-${i}`}
          x1={padding}
          y1={y}
          x2={padding + chartWidth}
          y2={y}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      );
    }
    
    return lines;
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid */}
        {showGrid && generateGridLines()}
        
        {/* Bars */}
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * chartHeight;
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = padding + chartHeight - barHeight;
          
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx="4"
                className={`hover:opacity-80 transition-all duration-200 ${animate ? 'animate-pulse' : ''}`}
              />
              {showValues && value > 0 && (
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-300"
                >
                  {value}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Labels */}
      {labels.length > 0 && (
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400 px-10">
          {labels.map((label, index) => (
            <span key={index} className="truncate max-w-16 text-center">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarChart;
