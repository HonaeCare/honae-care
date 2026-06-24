import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#5B1820',
          light: '#7a2230',
          dark: '#3d1016',
          50:  '#fdf4f5',
          100: '#fae5e7',
          200: '#f3c0c4',
          300: '#e8929a',
          400: '#d45e6a',
          500: '#b83845',
          600: '#8f2530',
          700: '#5B1820',
          800: '#3d1016',
          900: '#24090d',
        },
        rose: {
          DEFAULT: '#F6D6D5',
          light: '#fbeaea',
          dark: '#e8b8b7',
        },
        ecru: {
          DEFAULT: '#FAF8F2',
          dark: '#f0ede2',
        },
        mustard: {
          DEFAULT: '#E2AE00',
          light: '#f0ca3a',
          dark: '#b88c00',
        },
      },
      fontFamily: {
        sans: ['Aeonik', 'var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Nyght Serif', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
