/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CareerBridge primary — deep indigo
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // CareerBridge secondary — electric violet
        secondary: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // CareerBridge accent — cyan (used sparingly)
        accent: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
        },
        // Semantic surface colors
        surface: {
          DEFAULT: '#F8FAFC',
          dark:    '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient':   'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'brand-gradient-r': 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
        'hero-gradient':    'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #ecfeff 100%)',
        'hero-gradient-dark': 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 50%, #0f172a 100%)',
      },
      boxShadow: {
        'brand':    '0 4px 24px -4px rgba(79, 70, 229, 0.25)',
        'brand-lg': '0 8px 40px -8px rgba(79, 70, 229, 0.35)',
        'card':     '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px -4px rgba(0,0,0,0.10)',
      },
      animation: {
        'fade-in':  'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
