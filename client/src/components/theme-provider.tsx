import { createContext, useContext, useEffect } from 'react';
import { countryThemes, getCountryTheme } from '@/lib/themes';
import { useAuth } from '@/hooks/use-auth';

type ThemeContextType = {
  currentTheme: ReturnType<typeof getCountryTheme>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    const theme = getCountryTheme(user?.country);

    // Update theme.json values
    const themeConfig = {
      variant: theme.variant,
      primary: theme.primary,
      accent: theme.accent,
      appearance: theme.appearance,
      radius: theme.radius
    };

    // Update CSS variables for immediate effect
    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--accent', theme.accent);

    // Apply the accent color to text and borders
    document.documentElement.style.setProperty('--accent-foreground', theme.accent);

  }, [user?.country]);

  return (
    <ThemeContext.Provider value={{ currentTheme: getCountryTheme(user?.country) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}