/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    container: false
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    container: {
      center: true,
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          padding: '0 10px',
          margin: '0 auto',
          '@screen md': {
            maxWidth: '740px',
            padding: 0,
          },
          '@screen lg': {
            maxWidth: '960px',
            padding: 0,
          },
          '@screen xl': {
            maxWidth: '1140px',
            padding: 0,
          },
        }
      })
    }
  ]
}
