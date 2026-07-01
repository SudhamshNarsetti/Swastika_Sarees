/**
 * Utility functions for handling Cloudinary image URLs and applying/removing transformations.
 */

/**
 * Injects or replaces Cloudinary transformation parameters in an image URL.
 * 
 * @param {string} url - The original Cloudinary image URL.
 * @param {string} transformation - The transformation string (e.g., 'ar_2:3,c_fill,g_face').
 * @returns {string} - The transformed image URL.
 */
export const getCloudinaryTransformedUrl = (url, transformation) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com') || !url.includes('/image/upload/')) return url;
  
  const match = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
  if (match) {
    const prefix = match[1];
    const rest = match[2];
    const parts = rest.split('/');
    if (parts[0] && parts[0].match(/^v\d+$/)) {
      // No existing transformation
      return `${prefix}${transformation}/${rest}`;
    } else {
      // Existing transformation exists, replace it
      parts[0] = transformation;
      return `${prefix}${parts.join('/')}`;
    }
  }
  return url;
};

/**
 * Removes transformation parameters from a Cloudinary image URL, returning the original image URL.
 * 
 * @param {string} url - The Cloudinary image URL.
 * @returns {string} - The clean image URL without transformations.
 */
export const removeCloudinaryTransformation = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('cloudinary.com') || !url.includes('/image/upload/')) return url;
  
  const match = url.match(/(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
  if (match) {
    const prefix = match[1];
    const rest = match[2];
    const parts = rest.split('/');
    if (parts[0] && !parts[0].match(/^v\d+$/)) {
      // It's a transformation, remove it
      parts.shift();
      return `${prefix}${parts.join('/')}`;
    }
  }
  return url;
};
