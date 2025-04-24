/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom-bg': '#1a0f42',
        'custom-hover': '#0d1332',
        'custom-footer': '#693fef',
        'custom-card': '#241866',
        'custom-dateCharacter': '#8f48b6'
      },
      colors: {
        'primary-orange': '#f26064',
        'color-logo': '#d762ff'
      },
      fontFamily: {
        fortnite: ['"Anton"', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif']
      },
      blur: {
        xs: '5px', // o '0.5px'
      }
    }
  },
  plugins: [],
}
