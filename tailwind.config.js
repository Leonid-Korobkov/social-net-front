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
    extend: {},
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

