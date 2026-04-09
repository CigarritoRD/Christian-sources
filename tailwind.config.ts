/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#070A10',
          soft: '#0B0F19',
        },

        surface: {
          DEFAULT: 'rgba(255,255,255,0.05)',
          hover: 'rgba(255,255,255,0.08)',
          border: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.12)',
        },

        brand: {
          primary: '#007473',
          accent: '#00ABC7',
          gray: '#808080',
          ink: '#0b1f1e',
          paper: '#f7fbfb',
        },

        neutral: {
          light: '#E6F2F2',
          muted: '#A0B3B3',
        },

        text: {
          primary: '#EAF4F4',
          secondary: '#A0B3B3',
        },
      },

      fontFamily: {
        heading: ['"Montserrat"', 'system-ui', 'sans-serif'],
        body: ['"EB Garamond"', 'ui-serif', 'Georgia', 'serif'],
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

      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },

      transitionTimingFunction: {
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}