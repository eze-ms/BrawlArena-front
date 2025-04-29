/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'custom-hover': '#10346f',
        'custom-footer': '#693fef',
        'custom-card': '#241866',
        'custom-dateCharacter': '#8f48b6',
        'custom-interface': '#15417f',
        'custom-progress': '#51ef8e',
        'custom-piece': '#172554'
      },
      backgroundImage: {
        'custom-bg': "url('/src/assets/background.webp')",
      },
      colors: {
        'primary-orange': '#f26064',
        'color-logo': '#d762ff',
        'custom-border': '#5d80b8',
      },
      fontFamily: {
        fortnite: ['"Anton"', 'sans-serif'],
        exo: ['"Exo 2"', 'sans-serif'],
      },
      blur: {
        xs: '5px',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
}
