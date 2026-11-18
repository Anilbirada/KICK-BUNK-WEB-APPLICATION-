/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // KICK BUNK Light Luxury Brand Design System
        primary: '#FAF8F2',       // Primary background (Ivory)
        secondary: '#F0E9DC',     // Secondary background (Cream)
        accent: '#C5A46D',        // Accent (Champagne Gold)
        terracotta: '#B66A4B',    // Secondary accent (Terracotta)
        heading: '#382D25',       // Headings (Deep Espresso Brown)
        body: '#77716A',          // Body text (Warm Taupe)

        // Semantic aliases
        ivory: '#FAF8F2',
        cream: '#F0E9DC',
        gold: {
          light: '#E2CA9E',
          DEFAULT: '#C5A46D',
          dark: '#A6834B',
        },
        clay: {
          light: '#CD8567',
          DEFAULT: '#B66A4B',
          dark: '#935136',
        },
        espresso: {
          light: '#4E3F34',
          DEFAULT: '#382D25',
          dark: '#241D17',
        },
        taupe: {
          light: '#918B84',
          DEFAULT: '#77716A',
          dark: '#58534C',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        inter: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        cinzel: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'luxury-soft': '0 4px 20px -2px rgba(56, 45, 37, 0.05), 0 2px 6px -1px rgba(56, 45, 37, 0.03)',
        'luxury-card': '0 12px 32px -4px rgba(56, 45, 37, 0.08), 0 4px 12px -2px rgba(56, 45, 37, 0.04)',
        'luxury-elevated': '0 24px 48px -12px rgba(56, 45, 37, 0.12), 0 8px 16px -4px rgba(56, 45, 37, 0.06)',
        'gold-glow': '0 0 24px -2px rgba(197, 164, 109, 0.35)',
        'terracotta-glow': '0 0 24px -2px rgba(182, 106, 75, 0.35)',
      },
    },
  },
  plugins: [],
};
