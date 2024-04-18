/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        secondary: '#e07e2d',
        primary: '#902de0',
        primaryHover: '#6a21a6',
        backgroundColor: '#ededed'
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        poppins: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
}
