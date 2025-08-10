module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue:{
          600:'#c997a3ff',
        },
        green:{
          600: '#a33535ff'
        },
        primary: {
          DEFAULT: '#c997a3ff',
          700: '#b25582',
          800: '#9d4a73',
        },
        secondary: {
          DEFAULT: '#581344',
          700: '#420e33',
        },
        accent: {
          DEFAULT: '#e6bad1',
          700: '#d79ab9',
        },
      },
    },
  },
  plugins: [],
};