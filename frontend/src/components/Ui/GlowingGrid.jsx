import React, { useEffect, useRef } from 'react';

const GlowingGrid = ({ containerRef }) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const gridPoints = useRef([]);
  const mousePosition = useRef({ x: null, y: null });
  const hoverEffects = useRef([]);

  // Initialiser la grille
  const initGrid = (canvas, containerWidth, containerHeight) => {
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
          alpha: 0.3 + Math.random() * 0.2,
          pulseSpeed: 0.005 + Math.random() * 0.005,
          pulseOffset: Math.random() * Math.PI * 2,
        });
      }
    }
  };
  
  // Créer un effet de brillance sur les clics
  const createHoverEffect = (x, y) => {
    hoverEffects.current.push({
      x,
      y,
      radius: 5,
      maxRadius: 100,
      alpha: 0.8,
      growing: true
    });
  };

  // Boucle d'animation
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner les lignes de connexion
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
          
          const alpha = (1 - distance / 60) * 0.15;
          ctx.strokeStyle = `rgba(100, 255, 255, ${alpha})`;
          ctx.stroke();
        }
      }
    }
    
    // Dessiner les points
    gridPoints.current.forEach(point => {
      // Vérifier si le point est affecté par la position de la souris
      if (mousePosition.current.x !== null && mousePosition.current.y !== null) {
        const dx = point.x - mousePosition.current.x;
        const dy = point.y - mousePosition.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          const influence = 1 - distance / 100;
          const size = point.size + influence * 2;
          const alpha = point.alpha + influence * 0.5;
          
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
    
    // Animer les effets de survol
    for (let i = hoverEffects.current.length - 1; i >= 0; i--) {
      const effect = hoverEffects.current[i];
      
      ctx.beginPath();
      ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
      
      const gradient = ctx.createRadialGradient(
        effect.x, effect.y, 0,
        effect.x, effect.y, effect.radius
      );
      
      gradient.addColorStop(0, `rgba(255, 255, 255, ${effect.alpha})`);
      gradient.addColorStop(0.5, `rgba(100, 255, 255, ${effect.alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(100, 255, 255, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      if (effect.growing) {
        effect.radius += 1;
        effect.alpha -= 0.01;
        
        if (effect.radius >= effect.maxRadius) {
          effect.growing = false;
        }
      } else {
        effect.alpha -= 0.02;
      }
      
      if (effect.alpha <= 0) {
        hoverEffects.current.splice(i, 1);
      }
    }
    
    animationFrameId.current = requestAnimationFrame(animate);
  };
  
  const updateDimensions = () => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const container = containerRef.current;
    const canvas = canvasRef.current;
    
    const rect = container.getBoundingClientRect();
    const { width, height } = rect;
    
    canvas.width = width;
    canvas.height = height;
    
    // Réinitialiser la grille avec les nouvelles dimensions
    initGrid(canvas, width, height);
  };
  
  const handleMouseMove = (e) => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    mousePosition.current = {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top
    };
  };
  
  const handleClick = (e) => {
    if (!containerRef.current || !canvasRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;
    
    createHoverEffect(x, y);
  };
  
  // Effets pour gérer le cycle de vie du composant
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    
    // Initialiser les dimensions et la grille
    updateDimensions();
    
    // Démarrer l'animation
    animate();
    
    // Ajouter les écouteurs d'événements
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    // Observer les changements de taille du conteneur
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    // Nettoyage
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      resizeObserver.disconnect();
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default GlowingGrid; 