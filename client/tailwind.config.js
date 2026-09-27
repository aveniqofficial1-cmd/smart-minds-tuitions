/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030816',
          900: '#050C1A',
          850: '#081426',
          800: '#0A1A33',
          700: '#0F274C',
          600: '#173B73',
          500: '#1F4F9A',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FDFBF2',
          100: '#F9F4DE',
          200: '#F3E8B8',
          300: '#EBD98E',
          400: '#E2C964',
          500: '#D4AF37',
          600: '#B89326',
          700: '#94741B',
          800: '#735715',
          900: '#523C0E',
        },
        cream: {
          50: '#FEFCF9',
          100: '#FAF8F5',
          200: '#F5EFEB',
          300: '#ECE2D8',
          400: '#DFD0C2',
          500: '#D1BEAC',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-sm': '0 2px 10px rgba(212, 175, 55, 0.15)',
        'gold-md': '0 4px 20px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 8px 30px rgba(212, 175, 55, 0.35)',
        'premium': '0 10px 35px -5px rgba(5, 12, 26, 0.08), 0 0 0 1px rgba(0,0,0,0.03)',
        'card-hover': '0 20px 40px -10px rgba(5, 12, 26, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F3C64F 0%, #D4AF37 50%, #B89326 100%)',
        'gold-shine': 'linear-gradient(90deg, #D4AF37, #FFF2A8, #D4AF37)',
        'navy-gradient': 'linear-gradient(180deg, #050C1A 0%, #081426 50%, #0A1A33 100%)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
