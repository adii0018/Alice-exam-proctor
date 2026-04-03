import { useState } from 'react';
import { getUserAvatar, getUserInitials, AVATAR_STYLES } from '../../utils/avatarGenerator';

/**
 * UserAvatar Component
 * Displays user avatar with DiceBear integration and fallback to initials
 */
const UserAvatar = ({
  user,
  size = 40,
  style = AVATAR_STYLES.ADVENTURER,
  className = '',
  showBorder = false,
  borderColor = '#30363d',
  fallbackGradient = 'linear-gradient(135deg, #3b82f6, #9333ea)',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const avatarUrl = getUserAvatar(user, style, { size: size * 2 }); // 2x for retina
  const initials = getUserInitials(user);

  // Debug logging
  console.log('UserAvatar Debug:', {
    user,
    avatarUrl,
    initials,
    style,
    imageError,
    imageLoaded
  });

  const handleImageLoad = () => {
    console.log('✅ Avatar loaded successfully:', avatarUrl);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.error('❌ Avatar failed to load:', avatarUrl, e);
    setImageError(true);
    setImageLoaded(false);
  };

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: onClick ? 'pointer' : 'default',
    border: showBorder ? `2px solid ${borderColor}` : 'none',
    transition: 'transform 0.2s ease',
  };

  const fallbackStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: fallbackGradient || 'linear-gradient(135deg, #3b82f6, #9333ea)',
    color: 'white',
    fontWeight: 600,
    fontSize: `${size * 0.4}px`,
  };

  return (
    <div
      className={className}
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.transform = 'scale(1)')}
    >
      {!imageError ? (
        <>
          <img
            src={avatarUrl}
            alt={user?.username || user?.name || 'User'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none',
            }}
          />
          {!imageLoaded && (
            <div style={fallbackStyle}>
              {initials}
            </div>
          )}
        </>
      ) : (
        <div style={fallbackStyle}>
          {initials}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
