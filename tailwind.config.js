/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        'border-flow': {
          '0%': { 'background-position': '200% 0' },
          '100%': { 'background-position': '-200% 0' },
        },
      },
      animation: {
        'border-flow': 'border-flow 3s linear infinite',
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(
    //   {
    //   addCommonColors: true,
    //   themes: {
    //     light: {
    //       colors: {
    //         primary: "#9353D3",
    //         secondary: "#006FEE",
    //       }
    //     },
    //     dark: {
    //       colors: {
    //         primary: "#7827C8",
    //         secondary: "#006FEE"
    //       }
    //     },
    //   }
    // }
  ),
  ]
}

