/**
 * Cloudinary Direct Client-Side Upload Utility
 * Allows uploading event banners, logos, and posters directly to Cloudinary CDN.
 */

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
}

// Read from Vite environment variables if defined
export const getCloudinaryConfig = (): CloudinaryConfig => {
  return {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'acadeno',
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'eventlink_preset',
  };
};

/**
 * Upload a file directly to Cloudinary using an unsigned upload preset.
 * @param file The Image file selected by the user.
 * @param customConfig Optional override for cloudName and uploadPreset.
 * @returns The secure HTTPS URL of the uploaded image on Cloudinary.
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
    throw new Error('Cloudinary Cloud Name and Upload Preset are required.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', config.uploadPreset);
  formData.append('folder', 'eventlink_banners');

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`;

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Upload failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.secure_url as string;
}
