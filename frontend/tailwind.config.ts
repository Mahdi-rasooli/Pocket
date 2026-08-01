import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#10b981',
          light: '#34d399',
          dark: '#059669',
        },
        surface: {
          DEFAULT: '#0f1115',
          card: '#161a21',
          border: '#232833',
        },
      },
    },
  },
  plugins: [],
};

export default config;
