/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F7F4EF',
        cream: '#EDE9E1',
        gold: {
          DEFAULT: '#B8965A',
          light: '#D4AC6E',
          dark: '#9A7B4A',
        },
        charcoal: '#1C1C1C',
        slate: '#3D3D3D',
        muted: '#8A8278',
        white: '#FEFEFE',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'title': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'subtitle': ['1.25rem', { lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'elegant': '2px',
      },
      transitionDuration: {
        'luxury': '300ms',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'elegant': '0 4px 20px -2px rgba(28, 28, 28, 0.12)',
      },
    },
  },
  plugins: [],
}
