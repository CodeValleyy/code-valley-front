/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryTailwind: '#902de0',
        primary: '#902de0',
        primaryLight: '#b13df5',
        primaryHover: '#6a21a6',
        secondaryTailwind: '#e07e2d',
        secondaryHover: '#b06221',

        backgroundColor: '#ededed',
        textPrimary: '#1a1a1a',
        textSecondary: '#4a4a4a',

        darkBackground: '#1a1a1a',
        darkTextPrimary: '#ededed',
        darkTextSecondary: '#a8a8a8',
        darkPrimary: '#7158e0',
        darkSecondary: '#d98b2d'
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        poppins: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: [],
  darkMode: 'class'
}
