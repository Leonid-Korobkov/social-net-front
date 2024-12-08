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
    //         primary: "#6048CA",
    //         secondary: "#006FEE",
    //         background:"#EBE7D9",
    //         foreground: "#212121",
    //         default: "#212121",
    //         "default-200": "#ccccce"
    //       }
    //     },
    //     dark: {
    //       colors: {
    //         primary: "#3D2996",
    //         secondary: "#006FEE",
    //         background: "#212121",
    //         foreground: "#EBE7D9",
    //         default: "#565660"
    //       }
    //     },
    //   }
    // }
  ),
  ]
}

