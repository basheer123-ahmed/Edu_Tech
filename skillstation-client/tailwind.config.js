/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF6B00",
          hover: "#E66000",
          light: "#FFF0E6",
        },
        secondary: {
          DEFAULT: "#0A192F",
          light: "#112240",
          lighter: "#233554",
        },
        accent: "#64FFDA",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
