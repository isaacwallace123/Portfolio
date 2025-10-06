// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background))',
        brand: 'rgb(var(--color-brand))',
        foreground: 'rgb(var(--color-foreground))',
        muted: 'rgb(var(--color-muted))',
        border: 'rgb(var(--color-border))',
        accent: 'rgb(var(--color-accent))',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
