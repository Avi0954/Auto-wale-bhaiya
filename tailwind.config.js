/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        auto: {
          green: '#1EB854', // Meter green
          dark: '#0a0a0a', // Night road
          yellow: '#FFD700', // Auto yellow accent
          text: '#E5E5E5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Or Outfit if requested later
      }
    },
  },
  plugins: [],
}
