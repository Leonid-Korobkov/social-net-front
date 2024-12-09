/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
    //         primary: "#7154f2",
    //         secondary: "#006FEE",
    //         background:"#EBE7D9",
    //         foreground: "#212121",
    //         default: "#212121",
    //         "default-200": "#ccccce",
    //         content1: "#EBE7D9"
    //       }
    //     },
    //     dark: {
    //       colors: {
    //         primary: "#3D2996",
    //         secondary: "#006FEE",
    //         background: "#212121",
    //         foreground: "#EBE7D9",
    //         default: "#565660",
    //         content1: "#212121"
    //       }
    //     },
    //   }
    // }
  ),
  ]
}

