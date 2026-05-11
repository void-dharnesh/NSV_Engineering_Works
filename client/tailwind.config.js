/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: '#202124',
        ink: '#1A1B1F',
        panel: '#2A2C31',
        elevated: '#32353B',
        cream: '#F5F2EB',
        smoke: '#B7B1A7',
        muted: '#8E8A83',
        copper: '#C77A35',
        gold: '#F29D38',
        copperDark: '#A96328',
        line: '#3B3E45',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 22px 70px rgba(0, 0, 0, 0.28)',
        copper: '0 0 0 1px rgba(199, 122, 53, 0.28), 0 18px 48px rgba(0, 0, 0, 0.24)',
      },
    },
  },
  plugins: [],
};
