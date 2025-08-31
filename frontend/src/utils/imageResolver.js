import { assets } from '../assets/assets';

/**
 * Resolves asset image paths to actual imported images
 * @param {string} imagePath - Path like "cars.car1" or direct URL
 * @returns {string} - Resolved image URL or original path
 */
export const resolveImagePath = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a direct URL, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('/') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Handle asset path resolution (e.g., "cars.car1")
  try {
    const parts = imagePath.split('.');
    let resolved = assets;
    
    for (const part of parts) {
      resolved = resolved[part];
      if (!resolved) break;
    }
    
    return resolved || null;
  } catch {
    return null;
  }
};

/**
 * Gets the best available image for a car object
 * @param {Object} car - Car object from database
 * @returns {string|null} - Resolved image URL or null
 */
export const getCarImage = (car) => {
  if (!car) return null;
  
  // Priority order: image field, first images array item, gallery first item
  const candidates = [
    car.image,
    Array.isArray(car.images) && car.images.length > 0 ? car.images[0] : null,
    Array.isArray(car.gallery) && car.gallery.length > 0 ? car.gallery[0]?.path : null
  ].filter(Boolean);
  
  for (const candidate of candidates) {
    const resolved = resolveImagePath(candidate);
    if (resolved) return resolved;
  }
  
  return null;
};
