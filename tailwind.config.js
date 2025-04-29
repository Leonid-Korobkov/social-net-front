/** @type {import('tailwindcss').Config} */
import { heroui } from '@heroui/react'

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        'border-flow': {
          '0%': { 'background-position': '200% 0' },
          '100%': { 'background-position': '-200% 0' }
        }
      },
      animation: {
        'border-flow': 'border-flow 3s linear infinite'
      }
    }
  },
  darkMode: 'class',
  plugins: [heroui()]
}
