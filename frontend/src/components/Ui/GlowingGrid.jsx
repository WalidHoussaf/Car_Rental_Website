import React, { useEffect, useRef, useCallback } from 'react';

const GlowingGrid = ({ containerRef }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const gridPoints = useRef([]);
  const mousePosition = useRef({ x: null, y: null });


  // Initialize the grid
  const initGrid = useCallback((canvas, containerWidth, containerHeight) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = 40;
    const columns = Math.ceil(containerWidth / cellSize) + 1;
    const rows = Math.ceil(containerHeight / cellSize) + 1;
    
    gridPoints.current = [];
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        gridPoints.current.push({
          x: x * cellSize,
          y: y * cellSize,
          baseSize: 1,
          size: 1,
          alpha: 0.1 + Math.random() * 0.1,
          pulseSpeed: 0.005 + Math.random() * 0.005,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }
  }, []);


  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connection lines
    for (let i = 0; i < gridPoints.current.length; i++) {
      const point = gridPoints.current[i];
      point.size = point.baseSize + Math.sin(Date.now() * point.pulseSpeed + point.pulseOffset) * 0.5;
      
      for (let j = i + 1; j < gridPoints.current.length; j++) {
        const otherPoint = gridPoints.current[j];
        const dx = point.x - otherPoint.x;
        const dy = point.y - otherPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 60) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(otherPoint.x, otherPoint.y);
          
          const alpha = (1 - distance / 60) * 0.05;
          ctx.strokeStyle = `rgba(100, 255, 255, ${alpha})`;
          ctx.stroke();
        }
      }
    }
    
    // Draw points
    gridPoints.current.forEach(point => {
      // Check if the point is affected by the mouse position
      if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
        const dx = point.x - mousePosition.current.x;
        const dy = point.y - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const influence = 1 - distance / 100;
          const size = point.size + influence * 2;
          const alpha = point.alpha + influence * 0.2;
          
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 255, 255, ${alpha})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 255, 255, ${point.alpha})`;
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 255, 255, ${point.alpha})`;
        ctx.fill();
      }
    });
    
    
    animationFrameId.current = requestAnimationFrame(animate);
  }, []);

  const updateDimensions = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    const rect = container.getBoundingClientRect();
    const { width, height } = rect;
    
    canvas.width = width;
    canvas.height = height;
    
    // Reinitialize the grid with new dimensions
    initGrid(canvas, width, height);
  }, [containerRef, initGrid]);
  
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    mousePosition.current = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top
    };
  }, [containerRef]);
  
  
  // Effects to manage component lifecycle
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Initialize dimensions and grid
    updateDimensions();
    
    // Start animation
    animate();
    
    // Add event listeners
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('mousemove', handleMouseMove);

    
    // Observe container size changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);

      resizeObserver.disconnect();
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [containerRef, animate, updateDimensions, handleMouseMove]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default GlowingGrid; 