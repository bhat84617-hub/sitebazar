/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#e4e9f0',
        'base-dark': '#c9d0da',
        accent: '#6c63ff',
        'accent-dark': '#5a52e0',
        ink: '#4a4a52',
        'ink-soft': '#7a7a85'
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        neu: '9px 9px 18px #b7bcc7, -9px -9px 18px #ffffff',
        'neu-sm': '5px 5px 10px #b7bcc7, -5px -5px 10px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #b7bcc7, inset -4px -4px 8px #ffffff',
        'neu-lg': '14px 14px 28px #b7bcc7, -14px -14px 28px #ffffff'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(14px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease forwards'
      }
    }
  },
  plugins: []
};
