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
        brand: {
          terracotta: '#C75A3B',
          'peach-blush': '#F6D6C9',
          'warm-cream': '#FAF8F4',
          'slate-blue': '#5B6B7A',
          charcoal: '#2E2E2E',
          'midnight-blue': '#1E2A3A',
          'mustard-gold': '#D4A85A',
          'coral-orange': '#E07A5F',
          lavender: '#A89CEB',
          'blush-pink': '#F2C6C6',
          teal: '#7FB3B8',
          'forest-green': '#1E3A2F',
          success: '#2E7D6B',
          warning: '#E3B341',
          error: '#D96B6B',
          'stone-100': '#F8F7F4',
          'stone-300': '#E8E6E1',
          'stone-500': '#C9C7C3',
          'stone-700': '#6B6B6B'
        }
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['"Source Sans 3"', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(46, 46, 46, 0.06)',
        'premium': '0 10px 30px -5px rgba(199, 90, 59, 0.12)'
      }
    },
  },
  plugins: [],
}
