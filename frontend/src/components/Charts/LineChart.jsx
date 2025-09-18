import React from 'react';

const LineChart = ({ 
  data = [], 
  labels = [], 
  width = 400, 
  height = 200, 
  color = '#06b6d4', 
  fillColor = 'rgba(6, 182, 212, 0.1)',
  showGrid = true,
  showDots = true,
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
  const minValue = 0; 
  const range = Math.max(1, maxValue - minValue);
  
  // Generate path for line
  const generatePath = () => {
    const points = data.map((value, index) => {
      const x = padding + (index * chartWidth) / Math.max(1, data.length - 1);
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  // Generate area path for fill
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

  // Generate grid lines and Y-axis labels
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
    
    // Vertical grid lines
    const verticalCount = Math.min(data.length - 1, 6);
    for (let i = 0; i <= verticalCount; i++) {
      const x = padding + (i * chartWidth) / Math.max(1, verticalCount);
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={padding}
          x2={x}
          y2={padding + chartHeight}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      );
    }
    
    return lines;
  };

  // Generate Y-axis labels
  const generateYAxisLabels = () => {
    const labels = [];
    const gridCount = 5;
    
    for (let i = 0; i <= gridCount; i++) {
      const value = Math.round((maxValue * (gridCount - i)) / gridCount);
      const y = padding + (i * chartHeight) / gridCount;
      
      labels.push(
        <text
          key={`y-label-${i}`}
          x={padding - 10}
          y={y + 4}
          textAnchor="end"
          fontSize="12"
          fill="rgba(156, 163, 175, 0.8)"
          className="font-['Orbitron']"
        >
          {value}
        </text>
      );
    }
    
    return labels;
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid */}
        {showGrid && generateGridLines()}
        
        {/* Y-axis labels */}
        {generateYAxisLabels()}
        
        {/* Area fill */}
        <path
          d={generateAreaPath()}
          fill={fillColor}
          className={animate ? 'animate-pulse' : ''}
        />
        
        {/* Line */}
        <path
          d={generatePath()}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animate ? 'animate-pulse' : ''}
        />
        
        {/* Dots */}
        {showDots && data.map((value, index) => {
          const x = padding + (index * chartWidth) / Math.max(1, data.length - 1);
          const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill={color}
              stroke="white"
              strokeWidth="2"
              className="hover:r-6 transition-all duration-200"
            />
          );
        })}
      </svg>
      
      {/* Labels */}
      {labels.length > 0 && (
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-400 px-10">
          {labels.map((label, index) => {
            // Show every label if 6 or fewer, otherwise show every other label
            const shouldShow = labels.length <= 6 || index % 2 === 0 || index === labels.length - 1;
            return (
              <span 
                key={index} 
                className={`truncate max-w-16 ${shouldShow ? 'opacity-100' : 'opacity-0'}`}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LineChart;
