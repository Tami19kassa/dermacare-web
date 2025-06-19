/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this path is correct
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'gemini-blue': '#1a73e8',
        'gemini-bg-light': '#f8f9fa',
        'gemini-surface-light': '#ffffff',
        'gemini-bg-dark': '#1f1f1f',
        'gemini-surface-dark': '#2d2d2d',
        'gemini-text-light': '#202124',
        'gemini-text-secondary-light': '#5f6368',
        'gemini-text-dark': '#e8eaed',
        'gemini-text-secondary-dark': '#9aa0a6',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}