/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        'primary-dark': '#4f46e5',
        secondary: '#ec4899',
        background: '#111827',
        surface: '#1f2937',
        'surface-light': '#374151'
      }
    }
  },
  plugins: []
};
