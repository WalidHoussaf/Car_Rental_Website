import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Image Optimization Service
 * Handles image processing, compression, and generation of multiple sizes
 */

// Image size configurations
const IMAGE_SIZES = {
  thumbnail: { width: 300, height: 200, quality: 80 },
  medium: { width: 800, height: 600, quality: 85 },
  large: { width: 1200, height: 900, quality: 90 },
  full: { width: 1920, height: 1440, quality: 95 }
};

/**
 * Optimize and resize an image to multiple sizes
 * @param {string} inputPath - Path to the original image
 * @param {string} outputDir - Directory to save optimized images
 * @param {string} filename - Base filename (without extension)
 * @returns {Promise<Object>} Object containing paths to all generated images
 */
export const optimizeImage = async (inputPath, outputDir, filename) => {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Read the original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Generate optimized versions in different sizes
    const results = {};

    for (const [sizeName, config] of Object.entries(IMAGE_SIZES)) {
      // Calculate dimensions maintaining aspect ratio
      let { width, height } = config;
      
      // Don't upscale images
      if (metadata.width < width) {
        width = metadata.width;
        height = Math.round((metadata.width / config.width) * config.height);
      }

      // Generate WebP version (modern format)
      const webpPath = path.join(outputDir, `${filename}-${sizeName}.webp`);
      await image
        .clone()
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: config.quality })
        .toFile(webpPath);

      // Generate JPEG fallback
      const jpegPath = path.join(outputDir, `${filename}-${sizeName}.jpg`);
      await image
        .clone()
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: config.quality, progressive: true })
        .toFile(jpegPath);

      results[sizeName] = {
        webp: path.relative(path.join(__dirname, '..'), webpPath).replace(/\\/g, '/'),
        jpeg: path.relative(path.join(__dirname, '..'), jpegPath).replace(/\\/g, '/')
      };
    }

    return results;
  } catch (error) {
    console.error('Error optimizing image:', error);
    throw new Error(`Image optimization failed: ${error.message}`);
  }
};

/**
 * Delete all versions of an optimized image
 * @param {Object} imagePaths - Object containing paths to all image versions
 * @returns {Promise<void>}
 */
export const deleteOptimizedImages = async (imagePaths) => {
  try {
    const deletePromises = [];

    for (const size of Object.values(imagePaths)) {
      if (size.webp) {
        const webpFullPath = path.join(__dirname, '..', size.webp);
        deletePromises.push(
          fs.unlink(webpFullPath).catch(err => 
            console.error(`Failed to delete ${webpFullPath}:`, err.message)
          )
        );
      }
      if (size.jpeg) {
        const jpegFullPath = path.join(__dirname, '..', size.jpeg);
        deletePromises.push(
          fs.unlink(jpegFullPath).catch(err => 
            console.error(`Failed to delete ${jpegFullPath}:`, err.message)
          )
        );
      }
    }

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error deleting optimized images:', error);
    throw error;
  }
};

/**
 * Get image metadata
 * @param {string} imagePath - Path to the image
 * @returns {Promise<Object>} Image metadata
 */
export const getImageMetadata = async (imagePath) => {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha
    };
  } catch (error) {
    console.error('Error getting image metadata:', error);
    throw error;
  }
};

/**
 * Compress an image without resizing
 * @param {string} inputPath - Path to the original image
 * @param {string} outputPath - Path to save compressed image
 * @param {number} quality - Quality (1-100)
 * @returns {Promise<string>} Path to compressed image
 */
export const compressImage = async (inputPath, outputPath, quality = 85) => {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (metadata.format === 'png') {
      await image.png({ quality, compressionLevel: 9 }).toFile(outputPath);
    } else {
      await image.jpeg({ quality, progressive: true }).toFile(outputPath);
    }

    return outputPath;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

/**
 * Convert image to WebP format
 * @param {string} inputPath - Path to the original image
 * @param {string} outputPath - Path to save WebP image
 * @param {number} quality - Quality (1-100)
 * @returns {Promise<string>} Path to WebP image
 */
export const convertToWebP = async (inputPath, outputPath, quality = 85) => {
  try {
    await sharp(inputPath)
      .webp({ quality })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error('Error converting to WebP:', error);
    throw error;
  }
};

export default {
  optimizeImage,
  deleteOptimizedImages,
  getImageMetadata,
  compressImage,
  convertToWebP,
  IMAGE_SIZES
};
