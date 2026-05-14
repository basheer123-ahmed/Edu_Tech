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
          bg: "#F3EAFD",
          secondary: "#EBDDFF",
          card: "#FFFFFF",
          border: "#DCC7FF",
          primary: "#9333EA",
          accent: "#C084FC",
          hover: "#E9D7FF",
          text: {
            primary: "#1E1B4B",
            secondary: "#6B7280"
          }
        },
        primary: {
          DEFAULT: "#9333EA",
          hover: "#7E22CE",
          light: "#F3EAFD",
        },
        secondary: {
          DEFAULT: "#1E1B4B",
          light: "#312E81",
          lighter: "#4338CA",
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.75)',
          dark: 'rgba(15, 23, 42, 0.75)',
          sidebar: 'rgba(255, 255, 255, 0.85)',
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
        'premium-gradient': 'linear-gradient(to right, #9333EA, #EC4899)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'soft-lavender': 'linear-gradient(135deg, #F3EAFD 0%, #EBDDFF 100%)',
      }
    },
  },
  plugins: [],
}
