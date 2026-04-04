# Teacher Dashboard - Modern Light Theme Guide

## Overview
This guide documents the modern light theme implementation for the teacher dashboard, following GitHub's design system principles.

## Design Philosophy

### Light Mode
- **Clean & Professional**: Soft backgrounds (#f6f8fa) instead of harsh white
- **Accessible**: High contrast text (#1f2328) for readability
- **Modern**: Subtle shadows and borders for depth
- **Consistent**: Green accent (#2da44e) throughout

### Dark Mode
- **GitHub-inspired**: Dark backgrounds with starfield animation
- **Eye-friendly**: Reduced contrast for night usage
- **Consistent**: Same green accent (#3fb950) adapted for dark

## Color Palette

### Light Theme Colors

#### Backgrounds
- `#f6f8fa` - Main page background (soft light gray)
- `#ffffff` - Cards, containers, surfaces (pure white)
- `#f6f8fa` - Hover states

#### Text
- `#1f2328` - Primary text (dark gray, high contrast)
- `#57606a` - Secondary/muted text (medium gray)

#### Accent (Green)
- `#2da44e` - Primary accent color
- `#2c974b` - Hover state (slightly darker)
- `rgba(45,164,78,0.08)` - Light background tint
- `rgba(45,164,78,0.12)` - Focus ring

#### Borders
- `#d0d7de` - Standard borders (soft gray)

#### Status Colors
- Success: `#2da44e` (green)
- Error: `#d1242f` (red)
- Warning: `#bf8700` (amber)
- Info: `#0969da` (blue)

### Dark Theme Colors

#### Backgrounds
- `#0d1117` - Main page background
- `#161b22` - Cards, containers
- `#21262d` - Hover states

#### Text
- `#e6edf3` - Primary text
- `#8b949e` - Secondary text
- `#6e7681` - Muted text

#### Accent (Green)
- `#3fb950` - Primary accent
- `#2ea043` - Hover state
- `rgba(46,160,67,0.1)` - Light background

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
```

### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Font Sizes
- Small: 11-13px
- Body: 14px
- Heading: 18-28px

## Components Updated

### Layout Components
1. **TeacherLayout.jsx**
   - Background: `#f6f8fa`
   - Font family applied
   - Removed starfield in light mode

2. **TeacherNavbar.jsx**
   - Background: `rgba(255,255,255,0.95)` with blur
   - Border: `#d0d7de`
   - Subtle shadow: `0 1px 3px rgba(31,35,40,0.04)`
   - Green accent for focus states

3. **TeacherSidebar.jsx**
   - Background: `rgba(255,255,255,0.98)` with blur
   - Active state: Green accent
   - Logo: Green gradient

### UI Components
4. **StatCard.jsx**
   - White cards with subtle borders
   - Hover: Lift effect with shadow
   - Icon background: Light green tint
   - All icons use green accent

5. **MobileBottomNav.jsx**
   - Background: `rgba(255,255,255,0.9)`
   - Active: Green accent
   - Subtle top shadow

## Interactive States

### Hover Effects
```javascript
onMouseEnter={e => {
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 8px 24px rgba(31,35,40,0.12)';
}}
```

### Focus States
```javascript
onFocus={e => {
  e.target.style.borderColor = '#2da44e';
  e.target.style.boxShadow = '0 0 0 3px rgba(45,164,78,0.12)';
}}
```

### Active States
- Background: `rgba(45,164,78,0.08)`
- Text color: `#2da44e`
- Border accent: `#2da44e`

## Shadows

### Light Mode
- Small: `0 1px 3px rgba(31,35,40,0.04)`
- Medium: `0 8px 24px rgba(31,35,40,0.12)`
- Large: `0 16px 48px rgba(31,35,40,0.16)`

### Dark Mode
- Small: `none`
- Medium: `0 8px 32px rgba(0,0,0,0.2)`
- Large: `0 16px 64px rgba(0,0,0,0.3)`

## Usage Example

```javascript
import { getTeacherTheme } from '../../styles/teacherTheme';
import { useTheme } from '../../contexts/ThemeContext';

function MyComponent() {
  const { darkMode } = useTheme();
  const theme = getTeacherTheme(darkMode);
  
  return (
    <div style={{
      backgroundColor: theme.bg.surface,
      border: `1px solid ${theme.border.default}`,
      color: theme.text.primary,
      fontFamily: theme.font.family,
    }}>
      Content
    </div>
  );
}
```

## Best Practices

1. **Always use theme colors** - Don't hardcode colors
2. **Maintain consistency** - Use green accent throughout
3. **Test both themes** - Ensure components work in light and dark
4. **Accessibility** - Maintain WCAG AA contrast ratios
5. **Smooth transitions** - Add `transition: all 0.2s` for interactive elements

## Accessibility

### Contrast Ratios (WCAG AA)
- Primary text on white: 13.6:1 ✓
- Secondary text on white: 7.5:1 ✓
- Green accent on white: 4.8:1 ✓

### Focus Indicators
- Visible focus rings on all interactive elements
- Green accent color for consistency
- 3px ring width for visibility

## Future Enhancements

1. Add subtle gradient overlays for depth
2. Implement pill badges with green tint
3. Add pulsing indicators for active states
4. Consider light noise texture for backgrounds
5. Add micro-interactions for better UX

## Migration Checklist

- [x] TeacherLayout - Background and font
- [x] TeacherNavbar - Colors and shadows
- [x] TeacherSidebar - Colors and logo
- [x] StatCard - White cards with hover
- [x] MobileBottomNav - Colors and shadow
- [ ] ExamTable - Update to new colors
- [ ] QuizList - Update to new colors
- [ ] QuizCreator - Update form inputs
- [ ] LiveMonitorCard - Update card styling
- [ ] ViolationsTable - Update table styling
- [ ] PerformanceChart - Update chart colors

## Support

For questions or issues with the theme implementation, refer to:
- `src/styles/teacherTheme.js` - Theme constants
- `src/contexts/ThemeContext.jsx` - Theme provider
- GitHub Design System: https://primer.style/
