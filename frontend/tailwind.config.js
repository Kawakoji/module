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
        app: {
          bg: '#0a0a0f',
          surface: '#13131f',
          border: '#2a2a35',
        },
        accent: {
          primary: '#7c3aed',
          primaryHover: '#6d28d9',
        },
      },
    },
  },
  plugins: [],
}










