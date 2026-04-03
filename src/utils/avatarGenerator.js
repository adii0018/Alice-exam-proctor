/**
 * Avatar Generator using DiceBear API
 * Generates unique, consistent avatars based on user identifier
 */

// Available DiceBear styles
export const AVATAR_STYLES = {
  ADVENTURER: 'adventurer', // Default - best looking!
  LORELEI: 'lorelei',
  AVATAAARS: 'avataaars',
  BOTTTS: 'bottts',
  INITIALS: 'initials',
  PIXEL_ART: 'pixel-art',
  BIG_SMILE: 'big-smile',
  THUMBS: 'thumbs',
  NOTIONISTS: 'notionists',
  PERSONAS: 'personas',
};

/**
 * Generate avatar URL using DiceBear API
 * @param {string} seed - Unique identifier (username, email, or user ID)
 * @param {string} style - Avatar style from AVATAR_STYLES
 * @param {Object} options - Additional options
 * @returns {string} Avatar URL
 */
export const generateAvatarUrl = (
  seed,
  style = AVATAR_STYLES.ADVENTURER,
  options = {}
) => {
  if (!seed) {
    seed = 'default-user';
  }

  const {
    size = 128,
    ...otherOptions
  } = options;

  // Build query parameters - simplified
  const params = new URLSearchParams({
    seed: seed.toString(),
    ...otherOptions,
  });

  // Using DiceBear API v9 (latest stable)
  const url = `https://api.dicebear.com/9.x/${style}/svg?${params.toString()}`;
  
  console.log('🎨 Generated Avatar URL:', url);
  
  return url;
};

/**
 * Generate avatar URL based on user object
 * @param {Object} user - User object with username, email, or id
 * @param {string} style - Avatar style
 * @param {Object} options - Additional options
 * @returns {string} Avatar URL
 */
export const getUserAvatar = (user, style = AVATAR_STYLES.ADVENTURER, options = {}) => {
  if (!user) return generateAvatarUrl('guest', style, options);
  
  // Use username, email, or id as seed for consistency
  const seed = user.username || user.email || user.name || user.id || 'user';
  
  return generateAvatarUrl(seed, style, options);
};

/**
 * Get user initials for fallback
 * @param {Object} user - User object
 * @returns {string} User initials
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  if (user.name) {
    const names = user.name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
  
  if (user.username) {
    return user.username[0].toUpperCase();
  }
  
  if (user.email) {
    return user.email[0].toUpperCase();
  }
  
  return 'U';
};

/**
 * Preload avatar image
 * @param {string} url - Avatar URL
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const preloadAvatar = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
};

export default {
  generateAvatarUrl,
  getUserAvatar,
  getUserInitials,
  preloadAvatar,
  AVATAR_STYLES,
};
