/**
 * Image Utilities
 * Helper functions for working with optimized images
 */

/**
 * Get the base path for an image (without size suffix and extension)
 * @param {string} imageUrl - Full image URL
 * @returns {string} Base path
 */
export const getImageBasePath = (imageUrl) => {
  if (!imageUrl) return '';
  
  // Remove query parameters
  const cleanUrl = imageUrl.split('?')[0];
  
  // Remove size suffix (-thumbnail, -medium, -large, -full) and extension
  return cleanUrl.replace(/-(thumbnail|medium|large|full)\.(webp|jpg|jpeg|png)$/i, '');
};

/**
 * Get optimized image URL for a specific size
 * @param {string} imageUrl - Original or base image URL
 * @param {string} size - Size variant (thumbnail, medium, large, full)
 * @param {string} format - Image format (webp, jpeg)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, size = 'medium', format = 'webp') => {
  if (!imageUrl) return '';
  
  // If it's already a full URL with protocol
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    const basePath = getImageBasePath(imageUrl);
    return `${basePath}-${size}.${format}`;
  }
  
  // If it's a relative path
  const basePath = getImageBasePath(imageUrl);
  return `${basePath}-${size}.${format}`;
};

/**
 * Get srcset for responsive images
 * @param {string} imageUrl - Base image URL
 * @param {string} format - Image format (webp, jpeg)
 * @returns {string} srcset string
 */
export const getImageSrcSet = (imageUrl, format = 'webp') => {
  if (!imageUrl) return '';
  
  const basePath = getImageBasePath(imageUrl);
  
  return [
    `${basePath}-thumbnail.${format} 300w`,
    `${basePath}-medium.${format} 800w`,
    `${basePath}-large.${format} 1200w`,
    `${basePath}-full.${format} 1920w`
  ].join(', ');
};

/**
 * Get sizes attribute for responsive images
 * @param {string} breakpoints - Custom breakpoints or use default
 * @returns {string} sizes string
 */
export const getImageSizes = (breakpoints) => {
  if (breakpoints) return breakpoints;
  
  // Default responsive sizes
  return '(max-width: 640px) 300px, (max-width: 1024px) 800px, (max-width: 1536px) 1200px, 1920px';
};

/**
 * Preload critical images
 * @param {string} imageUrl - Image URL to preload
 * @param {string} size - Size variant
 */
export const preloadImage = (imageUrl, size = 'medium') => {
  if (!imageUrl) return;
  
  const webpUrl = getOptimizedImageUrl(imageUrl, size, 'webp');
  const jpegUrl = getOptimizedImageUrl(imageUrl, size, 'jpeg');
  
  // Create link elements for preloading
  const webpLink = document.createElement('link');
  webpLink.rel = 'preload';
  webpLink.as = 'image';
  webpLink.href = webpUrl;
  webpLink.type = 'image/webp';
  document.head.appendChild(webpLink);
  
  const jpegLink = document.createElement('link');
  jpegLink.rel = 'preload';
  jpegLink.as = 'image';
  jpegLink.href = jpegUrl;
  jpegLink.type = 'image/jpeg';
  document.head.appendChild(jpegLink);
};

/**
 * Check if browser supports WebP
 * @returns {Promise<boolean>}
 */
export const supportsWebP = async () => {
  if (!window.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(() => true, () => false);
};

/**
 * Get image dimensions from URL
 * @param {string} imageUrl - Image URL
 * @returns {Promise<{width: number, height: number}>}
 */
export const getImageDimensions = (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

export default {
  getImageBasePath,
  getOptimizedImageUrl,
  getImageSrcSet,
  getImageSizes,
  preloadImage,
  supportsWebP,
  getImageDimensions
};
