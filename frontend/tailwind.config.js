/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#131A2B',
        inksoft: '#3A4360',
        brandbg: '#F5F6F8',
        border: '#E3E6EC',
        muted: '#7C8393',
        nanny: '#127475',
        nannylight: '#DCEFEF',
        maid: '#B8752E',
        maidlight: '#F6E8D6',
        success: '#1E8E5A',
        successlight: '#E4F5EC',
        danger: '#C1433C',
        dangerlight: '#FBE9E8',
        warning: '#B7791F',
        warninglight: '#FBF0DC',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,26,43,0.04), 0 8px 24px rgba(19,26,43,0.06)',
      },
    },
  },
  plugins: [],
};
