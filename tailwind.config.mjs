/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f7ff',
          100: '#f0edff',
          200: '#e4ddff',
          300: '#d2c2ff',
          400: '#b899ff',
          500: '#7f6ded',
          600: '#6c59d6',
          700: '#5b47c7',
          800: '#4c38b3',
          900: '#3d2a99'
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#dc68cd',
          600: '#c454b8',
          700: '#a840a3',
          800: '#8b2f8f',
          900: '#6d1f7b'
        },
        'gradient-start': '#7f6ded',
        'gradient-end': '#dc68cd'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7f6ded, #dc68cd)',
        'gradient-fuchsia': 'linear-gradient(135deg, #7f6ded, #dc68cd)',
        'gradient-brand': 'linear-gradient(135deg, #7f6ded, #dc68cd)'
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
} 