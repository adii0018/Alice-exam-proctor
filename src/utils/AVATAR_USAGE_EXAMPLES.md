# Avatar System - Usage Examples

## Quick Start

```jsx
import UserAvatar from '../components/common/UserAvatar';
import { AVATAR_STYLES } from '../utils/avatarGenerator';

// Basic usage
<UserAvatar user={user} />

// With custom size
<UserAvatar user={user} size={64} />

// With specific style
<UserAvatar 
  user={user} 
  size={48}
  style={AVATAR_STYLES.LORELEI}
/>
```

## Common Use Cases

### 1. Navbar Profile
```jsx
<UserAvatar
  user={user}
  size={40}
  style={AVATAR_STYLES.INITIALS}
  showBorder={darkMode}
  borderColor="#30363d"
  onClick={() => navigate('/profile')}
/>
```

### 2. User List / Table
```jsx
{users.map(user => (
  <div key={user.id} className="flex items-center gap-3">
    <UserAvatar 
      user={user} 
      size={48}
      style={AVATAR_STYLES.AVATAAARS}
      showBorder={true}
    />
    <div>
      <p>{user.name}</p>
      <p className="text-sm text-gray-500">{user.email}</p>
    </div>
  </div>
))}
```

### 3. Profile Page (Large)
```jsx
<UserAvatar
  user={user}
  size={128}
  style={AVATAR_STYLES.LORELEI}
  showBorder={true}
  borderColor="#e5e7eb"
  className="shadow-xl"
/>
```

### 4. Comment / Chat Message
```jsx
<div className="flex gap-2">
  <UserAvatar 
    user={message.author} 
    size={32}
    style={AVATAR_STYLES.PIXEL_ART}
  />
  <div className="flex-1">
    <p className="font-semibold">{message.author.name}</p>
    <p>{message.text}</p>
  </div>
</div>
```

### 5. Notification Badge
```jsx
<div className="relative">
  <UserAvatar user={user} size={40} />
  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
</div>
```

## Available Avatar Styles

```jsx
import { AVATAR_STYLES } from '../utils/avatarGenerator';

AVATAR_STYLES.INITIALS      // Text-based (default, lightweight)
AVATAR_STYLES.LORELEI        // Illustrated female characters
AVATAR_STYLES.AVATAAARS      // Cartoon-style (Sketch-like)
AVATAR_STYLES.BOTTTS         // Robot avatars (fun!)
AVATAR_STYLES.PIXEL_ART      // 8-bit retro style
AVATAR_STYLES.ADVENTURER     // Adventure game characters
AVATAR_STYLES.BIG_SMILE      // Happy faces
AVATAR_STYLES.THUMBS         // Thumbs up style
AVATAR_STYLES.NOTIONISTS     // Notion-style professional
AVATAR_STYLES.PERSONAS       // Professional personas
```

## Utility Functions

### Generate Avatar URL Directly
```jsx
import { generateAvatarUrl, AVATAR_STYLES } from '../utils/avatarGenerator';

const avatarUrl = generateAvatarUrl(
  'john.doe',                    // seed (username/email)
  AVATAR_STYLES.LORELEI,         // style
  { size: 128, radius: 50 }      // options
);

// Use in img tag
<img src={avatarUrl} alt="Avatar" />
```

### Get User Initials (Fallback)
```jsx
import { getUserInitials } from '../utils/avatarGenerator';

const initials = getUserInitials(user);
// Returns: "JD" for "John Doe"
```

### Preload Avatar
```jsx
import { preloadAvatar, getUserAvatar } from '../utils/avatarGenerator';

const avatarUrl = getUserAvatar(user);
preloadAvatar(avatarUrl)
  .then(() => console.log('Avatar loaded'))
  .catch(() => console.log('Failed to load'));
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `user` | Object | required | User object with username/email/name |
| `size` | Number | 40 | Avatar size in pixels |
| `style` | String | INITIALS | DiceBear style (see AVATAR_STYLES) |
| `className` | String | '' | Additional CSS classes |
| `showBorder` | Boolean | false | Show border around avatar |
| `borderColor` | String | '#30363d' | Border color (if showBorder=true) |
| `fallbackGradient` | String | gradient | CSS gradient for fallback |
| `onClick` | Function | undefined | Click handler |

## Best Practices

1. **Use INITIALS for performance** — Fastest to load, smallest payload
2. **Match style to context** — Professional (NOTIONISTS) for business, fun (BOTTTS) for casual
3. **Consistent sizing** — Use 32px (small), 40px (medium), 64px (large), 128px (profile)
4. **Always provide user object** — Even if minimal, ensures consistent generation
5. **Test fallback** — Component gracefully falls back to initials if API fails

## Performance Tips

- Avatars are cached by browser (same URL = same image)
- Use 2x size for retina displays (handled automatically)
- DiceBear API is fast (~50-100ms response time)
- Fallback to initials is instant (no network request)

## Customization

### Custom Colors
```jsx
// For INITIALS style, you can customize background
<UserAvatar
  user={user}
  style={AVATAR_STYLES.INITIALS}
  fallbackGradient="linear-gradient(135deg, #667eea, #764ba2)"
/>
```

### Dark Mode Support
```jsx
const { darkMode } = useTheme();

<UserAvatar
  user={user}
  showBorder={darkMode}
  borderColor={darkMode ? '#30363d' : '#e5e7eb'}
  fallbackGradient={darkMode 
    ? undefined 
    : 'linear-gradient(135deg, #3b82f6, #9333ea)'
  }
/>
```

## Troubleshooting

**Avatar not showing?**
- Check user object has username/email/id
- Verify internet connection (DiceBear is external API)
- Component will fallback to initials automatically

**Want offline support?**
- Use INITIALS style (no external API)
- Or pre-generate and cache avatar URLs

**Need different style per role?**
```jsx
const getAvatarStyle = (role) => {
  switch(role) {
    case 'admin': return AVATAR_STYLES.PERSONAS;
    case 'teacher': return AVATAR_STYLES.NOTIONISTS;
    case 'student': return AVATAR_STYLES.AVATAAARS;
    default: return AVATAR_STYLES.INITIALS;
  }
};

<UserAvatar user={user} style={getAvatarStyle(user.role)} />
```
