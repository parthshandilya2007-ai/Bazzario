/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#282A66', // navbar, hero, footer, headings
        'primary-hover': '#1F2052',
        accent: '#FF6B4A', // CTA buttons, discount badges, "Admin" pill
        'accent-hover': '#E85837',
        success: '#12855F', // rating pill, in-stock, delivered
        warning: '#C77700',
        danger: '#C0392B',
        surface: '#FFFFFF',
        background: '#F7F6F3', // page background (warm off-white)
        border: '#E6E3DD',
        'text-primary': '#1A1A1F',
        'text-muted': '#6B6B77',
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        pill: '999px',
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
