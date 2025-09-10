import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, ZoomIn, ZoomOut, Download, Heart, Share2 } from 'lucide-react';
import { useLanguage } from '../../../../hooks/useLanguage';
import { useTranslations } from '../../../../translations';
import { resolveImagePath } from '../../../../utils/imageResolver';
import { assets } from '../../../../assets/assets';

const GalleryTab = ({ car }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isAutoplayOn, setIsAutoplayOn] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Check if car has gallery property and that it contains valid images
  const hasGallery = car && car.gallery && Array.isArray(car.gallery) && car.gallery.length > 0;
  const hasImages = car && car.images && Array.isArray(car.images) && car.images.length > 0;
  
  // Create a combined array of images from multiple sources
  const allImages = useMemo(() => {
    const imageArray = [];
    
    // Always add main image first if it exists
    if (car?.image) {
      const resolvedMainImage = resolveImagePath(car.image);
      imageArray.push({ path: resolvedMainImage, alt: `${car.name} main view` });
    }
    
    // Add gallery images if they exist (new cars)
    if (hasGallery) {
      car.gallery.forEach((img, index) => {
        const resolvedPath = resolveImagePath(img.path || img);
        imageArray.push({
          path: resolvedPath,
          alt: img.alt || `${car.name} gallery image ${index + 1}`
        });
      });
    }
    // Check for galleryRef (old cars from assets)
    else if (car?.galleryRef) {
      try {
        const parts = car.galleryRef.split('.');
        let galleryObj = assets;
        for (const part of parts) {
          galleryObj = galleryObj[part];
        }
        
        if (galleryObj && typeof galleryObj === 'object') {
          Object.values(galleryObj).forEach((imgPath, index) => {
            if (typeof imgPath === 'string') {
              imageArray.push({
                path: imgPath,
                alt: `${car.name} gallery image ${index + 1}`
              });
            }
          });
        }
      } catch (error) {
        console.warn('Error resolving galleryRef:', car.galleryRef, error);
      }
    }
    
    // Add images array if it exists and we don't have enough images yet
    if (hasImages && imageArray.length < 6) {
      car.images.forEach((img, index) => {
        const resolvedPath = resolveImagePath(img);
        // Avoid duplicates
        if (!imageArray.some(existing => existing.path === resolvedPath)) {
          imageArray.push({
            path: resolvedPath,
            alt: `${car.name} image ${index + 1}`
          });
        }
      });
    }
    
    // If we still don't have enough images, create some variations of the main image
    if (imageArray.length < 3 && car?.image) {
      const mainImage = resolveImagePath(car.image);
      for (let i = imageArray.length; i < 3; i++) {
        imageArray.push({
          path: mainImage,
          alt: `${car.name} view ${i + 1}`
        });
      }
    }
    
    return imageArray;
  }, [hasGallery, hasImages, car?.image, car?.gallery, car?.images, car?.name, car?.galleryRef]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(`gallery-favorites-${car?.id}`);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, [car?.id]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (car?.id && favorites.length > 0) {
      localStorage.setItem(`gallery-favorites-${car?.id}`, JSON.stringify(favorites));
    }
  }, [favorites, car?.id]);

  // Auto-rotate images every 5 seconds (only when modal is closed and autoplay is on)
  useEffect(() => {
    if (allImages.length <= 1 || isModalOpen || !isAutoplayOn) return;
    
    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [allImages, isModalOpen, isAutoplayOn]);

  // Reset zoom when changing images
  useEffect(() => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [selectedImage]);

  // Function to handle thumbnail click with animation
  const handleThumbnailClick = useCallback((index) => {
    if (index === selectedImage) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage(index);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [selectedImage]);

  // Function to open modal with full-size image
  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setIsAutoplayOn(false); 
  }, []);

  // Function to close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
    setIsAutoplayOn(true); 
  }, []);

  // Navigation functions with animation
  const goToPrevious = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [allImages.length]);

  // Zoom functions
  const handleZoomIn = useCallback(() => {
    if (zoomLevel < 3) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    }
  }, [zoomLevel]);

  const handleZoomOut = useCallback(() => {
    if (zoomLevel > 1) {
      setZoomLevel(prev => Math.max(prev - 0.25, 1));
    }
  }, [zoomLevel]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          closeModal();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, selectedImage, closeModal, goToNext, goToPrevious, handleZoomIn, handleZoomOut]);

  // Handle mouse movement for panning when zoomed
  const handleMouseMove = useCallback((e) => {
    if (zoomLevel <= 1) return;
    
    // Only move the image if mouse button is pressed
    if (e.buttons === 1) {
      setImagePosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  }, [zoomLevel]);

  // Toggle favorite status - Fixed to properly stop event propagation
  const toggleFavorite = useCallback((index, e) => {
    // Always stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setFavorites(prev => {
      // Get array of all image indices
      const allIndices = allImages.map((_, i) => i);
      const allAreFavorited = allIndices.every(i => prev.includes(i));
      if (allAreFavorited) {
        // Unfavorite all
        return [];
      } else {
        // Favorite all
        return allIndices;
      }
    });
  }, [allImages]);

  // Function to handle image sharing 
  const handleShare = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (navigator.share) {
      navigator.share({
        title: `${car?.name || 'Amazing vehicle'} - Gallery`,
        text: `Check out this ${car?.name || 'amazing vehicle'}!`,
        url: window.location.href,
      })
      .catch(error => console.log('Error sharing', error));
    } else {
      // Fallback - copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
    }
  }, [car?.name]);

  // Function to handle image download 
  const handleDownload = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const link = document.createElement('a');
    link.href = allImages[selectedImage].path;
    link.download = `${car?.name || 'vehicle'}-image-${selectedImage}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [allImages, selectedImage, car?.name]);

  // Function to handle modal background click
  const handleModalBackgroundClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  }, [closeModal]);

  // Function to handle featured image click
  const handleFeatureClick = useCallback((e) => {
    e.stopPropagation();
    openModal();
  }, [openModal]);

  // Function to handle thumbnail image click with animation
  const handleThumbImageClick = useCallback((index, e) => {
    e.stopPropagation();
    if (index === selectedImage) {
      openModal();
      return;
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage(index);
      setTimeout(() => {
        setIsTransitioning(false);
        openModal();
      }, 50);
    }, 150);
  }, [selectedImage, openModal]);

  return (
    <div className="transition-all duration-500 relative overflow-hidden rounded-xl p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-black to-gray-900/60 z-0"></div>
      
      {/* Animated Glow Elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-2xl z-0 floating-light"></div>
      <div className="absolute bottom-0 left-32 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-2xl z-0 floating-light-slow"></div>

      {/* Content Container */}
      <div className="relative z-10">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white font-['Orbitron'] mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            {t('mediaGallery')}
              </span>
            </h2>
            <p className="text-2xs text-blue-200 font-['Orbitron']">
              {t('exploreDetails')}
            </p>
          </div>
          
          {/* Gallery Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAutoplayOn(prev => !prev)}
              className={`px-2 py-1 rounded text-xs font-['Orbitron'] transition-all ${
                isAutoplayOn 
                  ? 'bg-gradient-to-r from-white to-cyan-400 text-black shadow-md shadow-blue-500/20 cursor-pointer' 
                  : 'bg-gray-800/70 backdrop-blur-sm text-cyan-400 hover:bg-gray-700 hover:text-white cursor-pointer'
              }`}
              type="button"
            >
              {isAutoplayOn ? t('autoplayOn') : t('autoplayOff')}
            </button>
          </div>
        </div>
       
        {/* Horizontal Gallery Layout */}
        <div className="grid grid-cols-3 gap-3">
          {/* Featured Image */}
          <div 
            className="
              col-span-1 relative overflow-hidden rounded-md 
              border border-blue-900/80 
              bg-black/60 backdrop-blur-md
              w-full aspect-[4/3]
              shadow-lg shadow-blue-500/20
              cursor-pointer
              hover:border-blue-500/50 transition-all duration-300
              group
              before:content-[''] before:absolute before:border-t before:border-l before:border-blue-500/30 before:rounded-md
              after:content-[''] after:absolute before:inset-0 after:border-b after:border-r after:border-blue-500/30 after:rounded-md
            "
            onClick={handleFeatureClick}
          >
            {allImages.length > 0 ? (
              <>
                <img
                  src={allImages[0].path}
                  alt={allImages[0].alt}
                  className={`w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-sm text-white p-2 font-['Orbitron'] text-xl">
                  {car.name || "Featured"}
                </div>
                <button 
                  className="absolute right-2 top-2 bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-cyan-500/30 text-center cursor-pointer"
                  onClick={handleFeatureClick}
                  type="button"
                >
                  <span className="text-xs font-['Orbitron'] px-2 text-center">{t('showMore')}</span>
                </button>
                
                {/* Favorite Button */}
                <button 
                  onClick={(e) => toggleFavorite(0, e)}
                  className="absolute left-2 top-2 bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                  type="button"
                >
                  <Heart size={16} className={favorites.includes(0) ? 'fill-red-500 text-red-500' : ''} />
                </button>
              </>
            ) : (
              <img
                src={car.image || "/api/placeholder/800/600"}
                alt={car.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Additional Images */}
          {allImages.slice(1, 3).map((image, index) => (
            <div
              key={`featured-${index + 1}`}
              className="
                col-span-1 relative overflow-hidden rounded-md 
                border border-blue-900/80 
                bg-black/60 backdrop-blur-md
                w-full aspect-[4/3]
                shadow-lg shadow-blue-500/20
                cursor-pointer
                hover:border-blue-500/50 transition-all duration-300
                group
                before:content-[''] before:absolute before:border-t before:border-l before:border-blue-500/30 before:rounded-md
                after:content-[''] after:absolute before:inset-0 after:border-b after:border-r after:border-blue-500/30 after:rounded-md
              "
              onClick={(e) => handleThumbImageClick(index + 1, e)}
            >
              <img
                src={image.path}
                alt={image.alt}
                className={`w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                }`}
              />
              
              {/* Favorite Button */}
              <button 
                onClick={(e) => toggleFavorite(index + 1, e)}
                className="absolute left-2 top-2 bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                type="button"
              >
                <Heart size={16} className={favorites.includes(index + 1) ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>
          ))}

          {/* Fill in with placeholders if needed */}
          {allImages.length < 3 && 
            Array(3 - allImages.length).fill(0).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="
                  col-span-1 relative overflow-hidden rounded-md 
                  border border-blue-900/50 
                  bg-black/60 backdrop-blur-md
                  w-full aspect-[4/3]
                  shadow-lg shadow-blue-500/10
                "
              >
                <img
                  src="/api/placeholder/800/600"
                  alt="Gallery placeholder"
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
            ))
          }
        </div>
      </div>

      {/* Full-Size Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={handleModalBackgroundClick}
        >
          <div 
            className="
              relative w-full max-w-5xl max-h-[80vh]
              bg-black/80 backdrop-blur-md
              border border-blue-900/80
              rounded-lg
              shadow-lg shadow-blue-500/20
              overflow-hidden
              before:content-[''] before:absolute before:border-t before:border-l before:border-blue-500/30 before:rounded-lg
              after:content-[''] after:absolute before:inset-0 after:border-b after:border-r after:border-blue-500/30 after:rounded-lg
            "
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Image Container */}
            <div 
              className="w-full h-full flex items-center justify-center p-4 overflow-hidden"
              onMouseMove={handleMouseMove}
              style={{ cursor: zoomLevel > 1 ? 'grab' : 'default' }}
            >
              <div
                className="relative transition-transform duration-200"
                style={{ 
                  transform: `scale(${zoomLevel}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                  transition: zoomLevel === 1 ? 'transform 0.2s ease-out' : 'none'
                }}
              >
                <img
                  src={allImages[selectedImage].path}
                  alt={allImages[selectedImage].alt}
                  className={`max-w-full max-h-[70vh] object-contain transition-opacity duration-300 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                  draggable="false"
                />
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 cursor-pointer"
              type="button"
            >
              <X size={16} />
            </button>
            
            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-2 rounded-full transition-all duration-300 cursor-pointer"
                  type="button"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-2 rounded-full transition-all duration-300 cursor-pointer"
                  type="button"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
            
            {/* Image Actions Toolbar */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {/* Zoom Controls */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={zoomLevel >= 3}
                type="button"
              >
                <ZoomIn size={16} className={zoomLevel >= 3 ? 'opacity-50' : ''} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={zoomLevel <= 1}
                type="button"
              >
                <ZoomOut size={16} className={zoomLevel <= 1 ? 'opacity-50' : ''} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  resetZoom();
                }}
                className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={zoomLevel === 1}
                type="button"
              >
                <Maximize size={16} className={zoomLevel === 1 ? 'opacity-50' : ''} />
              </button>
              
              {/* Separator */}
              <div className="h-4 w-px bg-blue-800"></div>
    
              <button 
                onClick={(e) => handleDownload(e)}
                className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 cursor-pointer"
                type="button"
              >
                <Download size={16} />
              </button>
              <button 
                onClick={(e) => handleShare(e)}
                className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 cursor-pointer"
                type="button"
              >
                <Share2 size={16} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(selectedImage);
                }}
                className="bg-black/80 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-400 p-1 rounded-full transition-all duration-300 cursor-pointer"
                type="button"
              >
                <Heart size={16} className={favorites.includes(selectedImage) ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </div>
            
            {/* Image Counter Indicator */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm border border-cyan-500/30 px-3 py-1.5 rounded-full flex items-center justify-center">
              <span className="text-cyan-300 font-bold text-xs font-['Orbitron'] leading-none">
                {selectedImage + 1} / {allImages.length}
              </span>
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-black/70 backdrop-blur-md p-2">
              <div className="flex justify-center gap-2 overflow-x-auto no-scrollbar">
                {allImages.map((image, index) => (
                  <div
                    key={`modal-thumb-${index}`}
                    className={`
                      h-12 w-16 flex-shrink-0
                      bg-black/80 rounded-md overflow-hidden 
                      transition-all duration-300 cursor-pointer
                      border
                      ${selectedImage === index 
                        ? 'border-cyan-500 ring-2 ring-cyan-500/30 shadow-sm shadow-cyan-500/30 z-10 scale-110' 
                        : 'border-blue-900 hover:border-cyan-400 opacity-70 hover:opacity-100'
                      }
                      ${favorites.includes(index) ? 'ring-1 ring-red-500/30' : ''}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleThumbnailClick(index);
                    }}
                  >
                    <img
                      src={image.path}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryTab;