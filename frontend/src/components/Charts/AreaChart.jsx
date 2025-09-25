import React from 'react';

const AreaChart = ({ 
  data = [], 
  labels = [], 
  width = 400, 
  height = 200, 
  color = '#06b6d4',
  fillColor = 'rgba(6, 182, 212, 0.2)',
  showGrid = true,
  showLine = true,
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
  const minValue = Math.min(...data);
  const range = Math.max(1, maxValue - minValue);

  const generateAreaPath = () => {
    const points = data.map((value, index) => {
      const x = padding + (index * chartWidth) / Math.max(1, data.length - 1);
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });
    
    const firstX = padding;
    const lastX = padding + chartWidth;
    const bottomY = padding + chartHeight;
    
    return `M ${firstX},${bottomY} L ${points.join(' L ')} L ${lastX},${bottomY} Z`;
  };

  const generateLinePath = () => {
    const points = data.map((value, index) => {
      const x = padding + (index * chartWidth) / Math.max(1, data.length - 1);
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  const generateGridLines = () => {
    const lines = [];
    const gridCount = 5;
    
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
        
        {/* Area fill */}
        <path
          d={generateAreaPath()}
          fill={fillColor}
          className={animate ? 'animate-pulse' : ''}
        />
        
        {/* Line */}
        {showLine && (
          <path
            d={generateLinePath()}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      
      {/* Labels */}
      {labels.length > 0 && (
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400 px-10">
          {labels.map((label, index) => (
            <span key={index} className="truncate max-w-16">
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AreaChart;
