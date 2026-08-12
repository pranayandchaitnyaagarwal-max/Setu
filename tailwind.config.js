import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Helvetica Neue',
          'Segoe UI',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        ink: '#000000',
        cloud: '#ffffff',
        silver: '#f5f5f7',
        mist: '#e8e8ed',
        glass: 'rgba(255, 255, 255, 0.72)',
      },
      maxWidth: {
        content: '72rem',
      },
      boxShadow: {
        card: '0 8px 40px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.12)',
      },
      letterSpacing: {
        tightest: '-0.05em',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}