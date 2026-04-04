// Modern Light Theme Colors for Teacher Dashboard
// Based on GitHub's design system

export const teacherTheme = {
  light: {
    // Background colors
    bg: {
      primary: '#f6f8fa',      // Main background
      surface: '#ffffff',       // Cards, containers
      elevated: '#ffffff',      // Elevated surfaces
      hover: '#f6f8fa',        // Hover states
      active: 'rgba(45,164,78,0.08)', // Active states
    },
    
    // Border colors
    border: {
      default: '#d0d7de',      // Standard borders
      subtle: '#d0d7de',       // Subtle borders
      muted: 'rgba(208,215,222,0.5)', // Very subtle
    },
    
    // Text colors
    text: {
      primary: '#1f2328',      // Main text
      secondary: '#57606a',    // Secondary text
      muted: '#57606a',        // Muted text
      placeholder: '#57606a',  // Placeholder text
    },
    
    // Accent colors
    accent: {
      primary: '#2da44e',      // Primary green
      hover: '#2c974b',        // Hover state
      light: 'rgba(45,164,78,0.08)', // Light background
      border: 'rgba(45,164,78,0.2)',  // Border
    },
    
    // Status colors
    status: {
      success: '#2da44e',
      error: '#d1242f',
      warning: '#bf8700',
      info: '#0969da',
    },
    
    // Interactive elements
    interactive: {
      iconColor: '#57606a',
      iconHover: '#1f2328',
    },
    
    // Shadows
    shadow: {
      sm: '0 1px 3px rgba(31,35,40,0.04)',
      md: '0 8px 24px rgba(31,35,40,0.12)',
      lg: '0 16px 48px rgba(31,35,40,0.16)',
    },
    
    // Typography
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif',
    }
  },
  
  dark: {
    // Background colors
    bg: {
      primary: '#0d1117',
      surface: '#161b22',
      elevated: '#161b22',
      hover: '#21262d',
      active: 'rgba(46,160,67,0.1)',
    },
    
    // Border colors
    border: {
      default: '#30363d',
      subtle: '#21262d',
      muted: 'rgba(48,54,61,0.5)',
    },
    
    // Text colors
    text: {
      primary: '#e6edf3',
      secondary: '#8b949e',
      muted: '#6e7681',
      placeholder: '#6e7681',
    },
    
    // Accent colors
    accent: {
      primary: '#3fb950',
      hover: '#2ea043',
      light: 'rgba(46,160,67,0.1)',
      border: 'rgba(46,160,67,0.2)',
    },
    
    // Status colors
    status: {
      success: '#3fb950',
      error: '#f85149',
      warning: '#d29922',
      info: '#388bfd',
    },
    
    // Interactive elements
    interactive: {
      iconColor: '#8b949e',
      iconHover: '#e6edf3',
    },
    
    // Shadows
    shadow: {
      sm: 'none',
      md: '0 8px 32px rgba(0,0,0,0.2)',
      lg: '0 16px 64px rgba(0,0,0,0.3)',
    },
    
    // Typography
    font: {
      family: undefined, // Use default
    }
  }
};

// Helper function to get theme
export const getTeacherTheme = (darkMode) => {
  return darkMode ? teacherTheme.dark : teacherTheme.light;
};
