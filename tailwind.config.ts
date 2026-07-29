import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        fresh: '#10b981',
        warning: '#f97316',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
};

export default config;
