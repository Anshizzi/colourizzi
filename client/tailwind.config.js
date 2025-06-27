module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        orangeCamlin: '#ff5f00',
        purpleBase: '#5416e1',
        goldHighlight: '#ffd700',
      },
      fontFamily: {
        heading: ['"Clash Display"', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      // Add blur values for the glass effect
      blur: {
        xs: '2px',
        '100': '100px',
        '120': '120px',
      }
    },
  },
  plugins: [],
}