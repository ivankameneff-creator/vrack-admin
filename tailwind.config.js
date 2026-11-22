/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vrack: {
          amber: '#e69d24',
          gold: '#f59e0b',
          dark: '#181614',
          card: '#24201c',
          cardHover: '#2e2a25',
          border: '#3d362e',
          textMuted: '#a89f91',
        }
      }
    },
  },
  plugins: [],
}
