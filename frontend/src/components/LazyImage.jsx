import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage Component
 * Implements lazy loading with Intersection Observer
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  sizes = 'medium', // thumbnail, medium, large, full
  placeholder = '/patterns/grid-pattern.svg',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const currentRef = imgRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Generate image sources based on size
  const getImageSources = () => {
    if (!src) return { webp: placeholder, jpeg: placeholder };

    // If src is already a full URL or doesn't need optimization
    if (src.startsWith('http') || src.startsWith('data:')) {
      return { webp: src, jpeg: src };
    }

    // Remove file extension
    const basePath = src.replace(/\.[^/.]+$/, '');

    return {
      webp: `${basePath}-${sizes}.webp`,
      jpeg: `${basePath}-${sizes}.jpg`
    };
  };

  const { webp, jpeg } = getImageSources();

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) onError(e);
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: '#0f1419' }}
    >
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="animate-pulse">
            <svg
              className="w-12 h-12 text-cyan-500/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Error placeholder */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/20 to-gray-900">
          <div className="text-center">
            <svg
              className="w-12 h-12 text-red-500/50 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs text-gray-500">Failed to load image</p>
          </div>
        </div>
      )}

      {/* Actual image with WebP and fallback */}
      {isInView && !hasError && (
        <picture>
          <source srcSet={webp} type="image/webp" />
          <source srcSet={jpeg} type="image/jpeg" />
          <img
            src={jpeg}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            {...props}
          />
        </picture>
      )}
    </div>
  );
};

export default LazyImage;
