/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom-bg': '#101553',
        'custom-hover': '#0d1332',
        'custom-footer': '#693fef',
        
      },
      colors: {
        'primary-orange': '#f26064',
        'color-logo': '#d762ff'
      },
      fontFamily: {
        fortnite: ['"Anton"', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif']
      },
    },
  },
  plugins: [],
}
