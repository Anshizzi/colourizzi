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
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      blur: {
        xs: '2px',
        '100': '100px',
        '120': '120px',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
