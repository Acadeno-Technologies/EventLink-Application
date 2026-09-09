/**
 * Cloudinary Direct Client-Side Upload Utility
 * Allows uploading event banners, logos, and posters directly to Cloudinary CDN.
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

// Read from localStorage first, then fallback to Vite environment variables
export const getCloudinaryConfig = (): CloudinaryConfig => {
  const localCloud = typeof window !== 'undefined' ? localStorage.getItem('CLOUDINARY_CLOUD_NAME') : null;
  const localPreset = typeof window !== 'undefined' ? localStorage.getItem('CLOUDINARY_UPLOAD_PRESET') : null;

  return {
    cloudName: localCloud || import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: localPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  };
};

export const setStoredCloudinaryConfig = (cloudName: string, uploadPreset: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('CLOUDINARY_CLOUD_NAME', cloudName.trim());
    localStorage.setItem('CLOUDINARY_UPLOAD_PRESET', uploadPreset.trim());
  }
};

/**
 * Upload a file directly to Cloudinary using an unsigned upload preset.
 * @param file The Image file selected by the user.
 * @param customConfig Optional override for cloudName and uploadPreset.
 * @returns The secure HTTPS URL of the uploaded image on Cloudinary (https://res.cloudinary.com/...)
 */
export async function uploadImageToCloudinary(
  file: File,
  customConfig?: Partial<CloudinaryConfig>
): Promise<string> {
  const config = {
    ...getCloudinaryConfig(),
    ...customConfig,
  };

  if (!config.cloudName || !config.uploadPreset) {
    throw new Error('Please configure your Cloudinary Cloud Name and Unsigned Upload Preset.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);
  formData.append('folder', 'acadeno_events');

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Cloudinary upload failed (Status ${response.status})`);
  }

  const data = await response.json();
  // Returns: https://res.cloudinary.com/<cloud>/image/upload/...
  return data.secure_url as string;
}
