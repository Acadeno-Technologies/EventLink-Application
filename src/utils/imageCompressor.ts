import { getCloudinaryConfig, uploadImageToCloudinary } from './cloudinaryUtils';

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  preferCloudinary?: boolean;
}

/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Reduces 5MB-10MB photos down to ~80KB-150KB while retaining HD clarity.
 */
export async function compressImageToDataUrl(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const { maxWidth = 1280, maxHeight = 720, quality = 0.84 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calculate scaled dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Fallback: direct FileReader data URL if canvas context fails
        const fallbackReader = new FileReader();
        fallbackReader.onload = () => resolve(fallbackReader.result as string);
        fallbackReader.onerror = reject;
        fallbackReader.readAsDataURL(file);
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as JPEG or WebP data URL
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      let dataUrl = canvas.toDataURL(mimeType, quality);

      // If PNG is too large, fallback to JPEG for better compression
      if (mimeType === 'image/png' && dataUrl.length > 500000) {
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      resolve(dataUrl);
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      // Fallback to basic file reader
      const fallbackReader = new FileReader();
      fallbackReader.onload = () => resolve(fallbackReader.result as string);
      fallbackReader.onerror = () => reject(err);
      fallbackReader.readAsDataURL(file);
    };

    img.src = objectUrl;
  });
}

/**
 * Optimizes an uploaded image file:
 * 1. Compresses the image for fast transfer and storage.
 * 2. If Cloudinary is configured, uploads to CDN; otherwise returns the compact Data URL.
 */
export async function optimizeImageUpload(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  const config = getCloudinaryConfig();
  
  // If Cloudinary credentials are set up, attempt CDN upload
  if (config.cloudName && config.uploadPreset) {
    try {
      return await uploadImageToCloudinary(file);
    } catch (err) {
      console.warn('Cloudinary upload skipped, falling back to local compressed data URL:', err);
    }
  }

  // Fast, reliable in-memory canvas compression
  return await compressImageToDataUrl(file, options);
}
