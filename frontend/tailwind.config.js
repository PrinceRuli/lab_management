/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          500: '#8b5cf6',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        status: {
          available: '#10b981',
          occupied: '#ef4444',
          maintenance: '#f59e0b',
          pending: '#fbbf24',
        }
      },
      fontFamily: {
        'heading': ['Inter', 'ui-sans-serif', 'system-ui'],
        'body': ['Poppins', 'ui-sans-serif', 'system-ui'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'lg': '0.75rem',
        'xl': '1rem',
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide")
  ],
}