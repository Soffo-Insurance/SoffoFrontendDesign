/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'inria-serif': ['"Inria Serif"', 'serif'],
        apple: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
        canela: ['Canela', 'Georgia', 'serif'],
      },
      boxShadow: {
        // Softer but more spread input shadow
        'input': '0 6px 18px rgba(0,0,0,0.04), 0 14px 40px rgba(0,0,0,0.03)',
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
        'soft-md': '0 2px 4px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
        'soft-lg': '0 4px 6px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.05)',
        'soft-button': '0 1px 2px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.04)',
        'soft-button-hover': '0 2px 4px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
}
