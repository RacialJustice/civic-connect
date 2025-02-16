type CountryTheme = {
  variant: 'professional' | 'tint' | 'vibrant';
  primary: string;
  accent: string;
  appearance: 'light' | 'dark' | 'system';
  radius: number;
  description: string;
};

type CountryThemes = {
  [country: string]: CountryTheme;
};

export const countryThemes: CountryThemes = {
  Kenya: {
    variant: 'professional',
    primary: '#008000', 
    accent: '#000000', 
    appearance: 'light',
    radius: 0.75,
    description: 'Inspired by Kenyan national colors'
  },
  Tanzania: {
    variant: 'professional',
    primary: '#1EB53A', 
    accent: '#00A3DD', 
    appearance: 'system',
    radius: 0.5,
    description: 'Inspired by Tanzanian flag colors'
  },
  Uganda: {
    variant: 'professional',
    primary: '#FFCE00', 
    accent: '#000000', 
    appearance: 'light',
    radius: 0.5,
    description: 'Inspired by Ugandan flag colors'
  },
  default: {
    variant: 'professional',
    primary: '#1E40AF', 
    accent: '#1e293b', 
    appearance: 'system',
    radius: 0.5,
    description: 'Default theme'
  }
};

export function getCountryTheme(country?: string): CountryTheme {
  if (!country) return countryThemes.default;
  return countryThemes[country] || countryThemes.default;
}