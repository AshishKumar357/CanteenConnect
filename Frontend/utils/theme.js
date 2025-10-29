const theme = {
  colors: {
    // Modern primary: purple-adjacent for a contemporary aesthetic
    primary: '#6d28d9', // purple-700
    onPrimary: '#ffffff',
    background: '#ffffff',
    card: '#f7f7fb',
    text: '#0f172a',
    muted: '#6b7280',
    accent: '#7c3aed',
    accentSoft: '#efe6ff',
    neutralLight: '#f2f2f6',
    neutralSoft: '#e6e6ea',
    border: '#eeeeee',
    danger: '#F44336',
    success: '#4CAF50',
    info: '#2196F3',
    warn: '#FFC107',
    gray: '#9E9E9E',

    // Meal-specific palette (colors reflect time-of-day: morning -> midday -> afternoon -> evening)
    mealBreakfast: '#4CAF6B', // bright, morning energy
    mealLunch: '#FFB84C',     // fresh midday Feel
    mealSnacks: '#FF7B6B',    // warm, snack pop vibe
    mealDinner: '#1F3B73',    // nighttime deep blue
  },

  // central shadow tokens for consistent elevation styling
  shadows: {
    default: 'rgba(0,0,0,0.12)',
    strong: 'rgba(0,0,0,0.18)'
  },

  radius: 10,
  spacing: 8,
};

export default theme;
