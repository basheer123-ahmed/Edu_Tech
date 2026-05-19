/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        skillstation: {
          bg: "#FFF8FC",
          secondary: "#FAF5FF",
          card: "#FFFFFF",
          border: "rgba(255,255,255,0.45)",
          primary: "#A855F7",
          accent: "#F472B6",
          hover: "#FFF0F8",
          text: {
            primary: "#1F2937",
            secondary: "#6B7280"
          }
        },
        primary: {
          DEFAULT: "#A855F7",
          hover: "#9333EA",
          light: "#FFF8FC",
        },
        secondary: {
          DEFAULT: "#1F2937",
          light: "#374151",
          lighter: "#4B5563",
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.65)',
          dark: 'rgba(15, 23, 42, 0.65)',
          sidebar: 'rgba(255, 255, 255, 0.18)',
        },
        violet: {
          50: '#FFF5FA',
          100: '#FDF2F8',
          200: '#FBCFE8',
          300: '#F472B6',
          400: '#EC4899',
          500: '#D946EF',
          600: '#A855F7',
          700: '#9333EA',
          800: '#7E22CE',
          900: '#6B21A8',
          950: '#4C1D95',
        },
        purple: {
          50: '#FFF5FA',
          100: '#FDF2F8',
          200: '#FBCFE8',
          300: '#F472B6',
          400: '#EC4899',
          500: '#D946EF',
          600: '#A855F7',
          700: '#9333EA',
          800: '#7E22CE',
          900: '#6B21A8',
          950: '#4C1D95',
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center bottom'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(135deg, #F472B6, #F43F5E)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'soft-lavender': 'linear-gradient(135deg, #FFF0F6 0%, #FFF8FA 50%, #F5EEF6 100%)',
      }
    },
  },
  plugins: [],
}
