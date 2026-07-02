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
  
  // Match: (prefix ending in /upload/)(optional existing transformations/)(version segment /v1234/ and everything after)
  const versionMatch = url.match(/(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:(.*)\/)?(v\d+\/.*)/);
  if (versionMatch) {
    const prefix = versionMatch[1];
    const versionAndRest = versionMatch[3];
    return `${prefix}${transformation}/${versionAndRest}`;
  }

  // Fallback if no version number segment is found (e.g. upload/public_id)
  const fallbackMatch = url.match(/(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
  if (fallbackMatch) {
    const prefix = fallbackMatch[1];
    const rest = fallbackMatch[2];
    
    // If the first segment of rest contains common transformation parameters (like c_ or w_ or h_ or ar_ or q_),
    // we replace it. Otherwise, we prepend the transformation.
    const parts = rest.split('/');
    if (parts[0] && (parts[0].includes('_') || parts[0].includes(':') || parts[0].includes(','))) {
      parts[0] = transformation;
      return `${prefix}${parts.join('/')}`;
    } else {
      return `${prefix}${transformation}/${rest}`;
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

  const versionMatch = url.match(/(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(?:(.*)\/)?(v\d+\/.*)/);
  if (versionMatch) {
    const prefix = versionMatch[1];
    const versionAndRest = versionMatch[3];
    return `${prefix}${versionAndRest}`;
  }

  const fallbackMatch = url.match(/(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)/);
  if (fallbackMatch) {
    const prefix = fallbackMatch[1];
    const rest = fallbackMatch[2];
    const parts = rest.split('/');
    if (parts[0] && (parts[0].includes('_') || parts[0].includes(':') || parts[0].includes(','))) {
      parts.shift();
      return `${prefix}${parts.join('/')}`;
    }
  }

  return url;
};
