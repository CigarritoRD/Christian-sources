/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Paleta base */
        bg: {
          DEFAULT: '#070A10',
          soft: '#0B0F19',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.10)',
        },
        brand: {
          DEFAULT: '#6366F1', // indigo-500
          soft: '#818CF8',    // indigo-400
        },
      },

      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.25)',
        card: '0 15px 40px rgba(0,0,0,0.35)',
      },

      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['0.95rem', { lineHeight: '1.5rem' }],
      },

      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
