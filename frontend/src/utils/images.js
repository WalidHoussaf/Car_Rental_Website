import { assets } from '../assets/assets';

export const resolveImagePath = (imagePath) => {
  if (!imagePath) return null;

  // Full URL or root-relative path
  if (typeof imagePath === 'string' && (imagePath.startsWith('http') || imagePath.startsWith('/'))) {
    return imagePath;
  }

  // Dot-notation into assets (e.g., "cars.bmw")
  if (typeof imagePath === 'string' && imagePath.includes('.')) {
    try {
      const parts = imagePath.split('.');
      let node = assets;
      for (const key of parts) node = node?.[key];
      if (typeof node === 'string') return node;
    } catch {
      // ignore and fall-through
    }
  }
  return imagePath;
};
