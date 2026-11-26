import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#173c2e',
        brand: { DEFAULT: '#176b52', dark: '#0f513f', soft: '#e5eee5' },
        mint: { DEFAULT: '#d9e6d8', strong: '#bfd3c3' },
        canvas: '#f3f4ef',
        ink: { DEFAULT: '#18231d', soft: '#536158', faint: '#6b756c' },
        line: { DEFAULT: '#dfe3da', strong: '#c8d0c7' },
        warn: { DEFAULT: '#8a5a14', soft: '#faefd6' },
        danger: { DEFAULT: '#a63d2d', soft: '#f9e3e0' },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: { card: '0 1px 2px rgb(24 35 29 / 0.05)' },
    },
  },
  plugins: [forms],
}
