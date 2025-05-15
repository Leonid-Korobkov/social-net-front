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
      },
      screens: {
        touchDevice: { raw: '(hover: none)' },
        hoverDevice: { raw: '(hover: hover)' }
      }
    }
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        default: {
          extend: 'light',
          colors: {
            secondary: {
              '50': '#dfedfd',
              '100': '#b3d4fa',
              '200': '#86bbf7',
              '300': '#59a1f4',
              '400': '#2d88f1',
              '500': '#006fee',
              '600': '#005cc4',
              '700': '#00489b',
              '800': '#003571',
              '900': '#002147',
              foreground: '#fff',
              DEFAULT: '#006fee'
            },
            primary: {
              '50': '#eee4f8',
              '100': '#d7bfef',
              '200': '#bf99e5',
              '300': '#a773db',
              '400': '#904ed2',
              '500': '#7828c8',
              '600': '#6321a5',
              '700': '#4e1a82',
              '800': '#39135f',
              '900': '#240c3c',
              foreground: '#fff',
              DEFAULT: '#7828c8'
            }
          }
        },
        'default-dark': {
          extend: 'dark',
          colors: {
            secondary: {
              '50': '#002147',
              '100': '#003571',
              '200': '#00489b',
              '300': '#005cc4',
              '400': '#006fee',
              '500': '#2d88f1',
              '600': '#59a1f4',
              '700': '#86bbf7',
              '800': '#b3d4fa',
              '900': '#dfedfd',
              foreground: '#fff',
              DEFAULT: '#006fee'
            },
            primary: {
              '50': '#240c3c',
              '100': '#39135f',
              '200': '#4e1a82',
              '300': '#6321a5',
              '400': '#7828c8',
              '500': '#904ed2',
              '600': '#a773db',
              '700': '#bf99e5',
              '800': '#d7bfef',
              '900': '#eee4f8',
              foreground: '#fff',
              DEFAULT: '#7828c8'
            }
          }
        },
        purple: {
          extend: 'light',
          colors: {
            default: {
              '50': '#f0eff8',
              '100': '#dcd8ee',
              '200': '#c7c1e3',
              '300': '#b2aad9',
              '400': '#9e93cf',
              '500': '#897cc5',
              '600': '#7166a3',
              '700': '#595180',
              '800': '#413b5e',
              '900': '#29253b',
              foreground: '#000',
              DEFAULT: '#897cc5'
            },
            primary: {
              '50': '#eee4f8',
              '100': '#d7bfef',
              '200': '#bf99e5',
              '300': '#a773db',
              '400': '#904ed2',
              '500': '#7828c8',
              '600': '#6321a5',
              '700': '#4e1a82',
              '800': '#39135f',
              '900': '#240c3c',
              foreground: '#fff',
              DEFAULT: '#7828c8'
            },
            secondary: {
              '50': '#e9edff',
              '100': '#cbd4ff',
              '200': '#adbcff',
              '300': '#8fa3ff',
              '400': '#708aff',
              '500': '#5271ff',
              '600': '#445dd2',
              '700': '#3549a6',
              '800': '#273679',
              '900': '#19224d',
              foreground: '#000',
              DEFAULT: '#5271ff'
            },
            success: {
              '50': '#e3f8ef',
              '100': '#bbedd8',
              '200': '#93e3c1',
              '300': '#6bd9ab',
              '400': '#43ce94',
              '500': '#1bc47d',
              '600': '#16a267',
              '700': '#127f51',
              '800': '#0d5d3b',
              '900': '#083b26',
              foreground: '#000',
              DEFAULT: '#1bc47d'
            },
            warning: {
              '50': '#fff5df',
              '100': '#ffe8b3',
              '200': '#ffda86',
              '300': '#ffcc59',
              '400': '#ffbf2d',
              '500': '#ffb100',
              '600': '#d29200',
              '700': '#a67300',
              '800': '#795400',
              '900': '#4d3500',
              foreground: '#000',
              DEFAULT: '#ffb100'
            },
            danger: {
              '50': '#ffe9e9',
              '100': '#ffcaca',
              '200': '#ffabab',
              '300': '#ff8d8d',
              '400': '#ff6e6e',
              '500': '#ff4f4f',
              '600': '#d24141',
              '700': '#a63333',
              '800': '#792626',
              '900': '#4d1818',
              foreground: '#000',
              DEFAULT: '#ff4f4f'
            },
            background: '#f9f7fd',
            foreground: '#4a3d77',
            content1: {
              DEFAULT: '#f2e8ff',
              foreground: '#000'
            },
            content2: {
              DEFAULT: '#e8daff',
              foreground: '#000'
            },
            content3: {
              DEFAULT: '#dccbff',
              foreground: '#000'
            },
            content4: {
              DEFAULT: '#cfbcff',
              foreground: '#000'
            },
            focus: '#7828c8',
            overlay: '#000000'
          }
        },
        'purple-dark': {
          extend: 'dark',
          colors: {
            default: {
              '50': '#08070b',
              '100': '#100d15',
              '200': '#181420',
              '300': '#201a2a',
              '400': '#71717a',
              '500': '#534d5d',
              '600': '#d4d4d8',
              '700': '#a9a6ae',
              '800': '#d4d3d7',
              '900': '#ffffff',
              foreground: '#fff',
              DEFAULT: '#71717a'
            },
            primary: {
              '50': '#2c193f',
              '100': '#462764',
              '200': '#603689',
              '300': '#7944ae',
              '400': '#9353d3',
              '500': '#a671db',
              '600': '#b98fe2',
              '700': '#ccadea',
              '800': '#dfcbf2',
              '900': '#f2eafa',
              foreground: '#fff',
              DEFAULT: '#9353d3'
            },
            secondary: {
              '50': '#1e254d',
              '100': '#2f3a79',
              '200': '#404fa6',
              '300': '#5265d2',
              '400': '#637aff',
              '500': '#7e91ff',
              '600': '#9aa9ff',
              '700': '#b5c0ff',
              '800': '#d0d7ff',
              '900': '#eceeff',
              foreground: '#000',
              DEFAULT: '#637aff'
            },
            success: {
              '50': '#0b412a',
              '100': '#116743',
              '200': '#178d5c',
              '300': '#1db374',
              '400': '#23d98d',
              '500': '#4ae0a1',
              '600': '#70e6b5',
              '700': '#97edc9',
              '800': '#bdf4dd',
              '900': '#e4faf1',
              foreground: '#000',
              DEFAULT: '#23d98d'
            },
            warning: {
              '50': '#4d3d11',
              '100': '#79601c',
              '200': '#a68326',
              '300': '#d2a730',
              '400': '#ffca3a',
              '500': '#ffd35c',
              '600': '#ffdd7f',
              '700': '#ffe6a1',
              '800': '#ffefc4',
              '900': '#fff8e6',
              foreground: '#000',
              DEFAULT: '#ffca3a'
            },
            danger: {
              '50': '#4d2020',
              '100': '#793333',
              '200': '#a64646',
              '300': '#d25858',
              '400': '#ff6b6b',
              '500': '#ff8585',
              '600': '#ff9f9f',
              '700': '#ffb9b9',
              '800': '#ffd3d3',
              '900': '#ffeded',
              foreground: '#000',
              DEFAULT: '#ff6b6b'
            },
            background: '#1b1526',
            foreground: '#d0aaff',
            content1: {
              DEFAULT: '#392a4a',
              foreground: '#fff'
            },
            content2: {
              DEFAULT: '#4c3560',
              foreground: '#fff'
            },
            content3: {
              DEFAULT: '#5e4180',
              foreground: '#fff'
            },
            content4: {
              DEFAULT: '#704ea0',
              foreground: '#fff'
            },
            focus: '#9353d3',
            overlay: '#ffffff'
          }
        },
        monochrome: {
          extend: 'light',
          colors: {
            default: {
              '50': '#f1f1f1',
              '100': '#dddddd',
              '200': '#cacaca',
              '300': '#b6b6b6',
              '400': '#a3a3a3',
              '500': '#8f8f8f',
              '600': '#767676',
              '700': '#5d5d5d',
              '800': '#444444',
              '900': '#2b2b2b',
              foreground: '#000',
              DEFAULT: '#8f8f8f'
            },
            primary: {
              '50': '#dfdfdf',
              '100': '#b3b3b3',
              '200': '#868686',
              '300': '#595959',
              '400': '#2d2d2d',
              '500': '#000000',
              '600': '#000000',
              '700': '#000000',
              '800': '#000000',
              '900': '#000000',
              foreground: '#fff',
              DEFAULT: '#000000'
            },
            secondary: {
              '50': '#f9f8fc',
              '100': '#f1edf8',
              '200': '#e9e3f5',
              '300': '#e1d9f1',
              '400': '#d9ceed',
              '500': '#d1c4e9',
              '600': '#aca2c0',
              '700': '#887f97',
              '800': '#635d6f',
              '900': '#3f3b46',
              foreground: '#000',
              DEFAULT: '#d1c4e9'
            },
            success: {
              '50': '#eff8f0',
              '100': '#d9eeda',
              '200': '#c3e4c5',
              '300': '#addbaf',
              '400': '#97d19a',
              '500': '#81c784',
              '600': '#6aa46d',
              '700': '#548156',
              '800': '#3d5f3f',
              '900': '#273c28',
              foreground: '#000',
              DEFAULT: '#81c784'
            },
            warning: {
              '50': '#fff6e9',
              '100': '#ffe9ca',
              '200': '#ffddaa',
              '300': '#ffd08b',
              '400': '#ffc46c',
              '500': '#ffb74d',
              '600': '#d29740',
              '700': '#a67732',
              '800': '#795725',
              '900': '#4d3717',
              foreground: '#000',
              DEFAULT: '#ffb74d'
            },
            danger: {
              '50': '#fceeee',
              '100': '#f7d5d5',
              '200': '#f3bdbd',
              '300': '#eea4a4',
              '400': '#ea8c8c',
              '500': '#e57373',
              '600': '#bd5f5f',
              '700': '#954b4b',
              '800': '#6d3737',
              '900': '#452323',
              foreground: '#000',
              DEFAULT: '#e57373'
            },
            background: '#ffffff',
            foreground: '#4a4a4a',
            content1: {
              DEFAULT: '#f0f0f0',
              foreground: '#000'
            },
            content2: {
              DEFAULT: '#e6e6e6',
              foreground: '#000'
            },
            content3: {
              DEFAULT: '#dcdcdc',
              foreground: '#000'
            },
            content4: {
              DEFAULT: '#d2d2d2',
              foreground: '#000'
            },
            focus: '#db924b',
            overlay: '#000000'
          }
        },
        'monochrome-dark': {
          extend: 'dark',
          colors: {
            default: {
              '50': '#1d1d1d',
              '100': '#393939',
              '200': '#565656',
              '300': '#727272',
              '400': '#8f8f8f',
              '500': '#a5a5a5',
              '600': '#bcbcbc',
              '700': '#d2d2d2',
              '800': '#e9e9e9',
              '900': '#ffffff',
              foreground: '#000',
              DEFAULT: '#8f8f8f'
            },
            primary: {
              '50': '#4d4d4d',
              '100': '#797979',
              '200': '#a6a6a6',
              '300': '#d2d2d2',
              '400': '#ffffff',
              '500': '#ffffff',
              '600': '#ffffff',
              '700': '#ffffff',
              '800': '#ffffff',
              '900': '#ffffff',
              foreground: '#000',
              DEFAULT: '#ffffff'
            },
            secondary: {
              '50': '#1c1c1c',
              '100': '#2d2d2d',
              '200': '#3d3d3d',
              '300': '#4e4e4e',
              '400': '#5e5e5e',
              '500': '#7a7a7a',
              '600': '#969696',
              '700': '#b3b3b3',
              '800': '#cfcfcf',
              '900': '#ebebeb',
              foreground: '#fff',
              DEFAULT: '#5e5e5e'
            },
            success: {
              '50': '#112b12',
              '100': '#1b431d',
              '200': '#245c27',
              '300': '#2e7532',
              '400': '#388e3c',
              '500': '#5ba25e',
              '600': '#7eb680',
              '700': '#a0c9a2',
              '800': '#c3ddc5',
              '900': '#e6f1e7',
              foreground: '#000',
              DEFAULT: '#388e3c'
            },
            warning: {
              '50': '#4a2500',
              '100': '#743b00',
              '200': '#9f5100',
              '300': '#ca6600',
              '400': '#f57c00',
              '500': '#f7932d',
              '600': '#f9aa59',
              '700': '#fac186',
              '800': '#fcd8b3',
              '900': '#feefdf',
              foreground: '#000',
              DEFAULT: '#f57c00'
            },
            danger: {
              '50': '#3f0e0e',
              '100': '#641616',
              '200': '#891f1f',
              '300': '#ae2727',
              '400': '#d32f2f',
              '500': '#db5353',
              '600': '#e27878',
              '700': '#ea9c9c',
              '800': '#f2c1c1',
              '900': '#fae5e5',
              foreground: '#fff',
              DEFAULT: '#d32f2f'
            },
            background: '#000000',
            foreground: '#b0b0b0',
            content1: {
              DEFAULT: '#2a2a2a',
              foreground: '#fff'
            },
            content2: {
              DEFAULT: '#3b3b3b',
              foreground: '#fff'
            },
            content3: {
              DEFAULT: '#4c4c4c',
              foreground: '#fff'
            },
            content4: {
              DEFAULT: '#5d5d5d',
              foreground: '#fff'
            },
            focus: '#000000',
            overlay: '#ffffff'
          }
        },
        brown: {
          extend: 'light',
          colors: {
            default: {
              '50': '#f6f5f4',
              '100': '#e9e7e5',
              '200': '#dbd9d6',
              '300': '#cecbc6',
              '400': '#c1bdb7',
              '500': '#b4afa8',
              '600': '#95908b',
              '700': '#75726d',
              '800': '#565350',
              '900': '#363532',
              foreground: '#000',
              DEFAULT: '#b4afa8'
            },
            primary: {
              '50': '#fbf1e9',
              '100': '#f4dec9',
              '200': '#eecbaa',
              '300': '#e8b88a',
              '400': '#e1a56b',
              '500': '#db924b',
              '600': '#b5783e',
              '700': '#8e5f31',
              '800': '#684524',
              '900': '#422c17',
              foreground: '#000',
              DEFAULT: '#db924b'
            },
            secondary: {
              '50': '#eaf0f0',
              '100': '#cedadb',
              '200': '#b1c5c6',
              '300': '#94afb0',
              '400': '#779a9b',
              '500': '#5a8486',
              '600': '#4a6d6f',
              '700': '#3b5657',
              '800': '#2b3f40',
              '900': '#1b2828',
              foreground: '#000',
              DEFAULT: '#5a8486'
            },
            success: {
              '50': '#f3f6f0',
              '100': '#e2e9db',
              '200': '#d0ddc6',
              '300': '#bfd0b1',
              '400': '#aec49c',
              '500': '#9db787',
              '600': '#82976f',
              '700': '#667758',
              '800': '#4b5740',
              '900': '#2f3729',
              foreground: '#000',
              DEFAULT: '#9db787'
            },
            warning: {
              '50': '#fff9eb',
              '100': '#fff2cf',
              '200': '#ffeab3',
              '300': '#ffe297',
              '400': '#ffda7b',
              '500': '#ffd25f',
              '600': '#d2ad4e',
              '700': '#a6893e',
              '800': '#79642d',
              '900': '#4d3f1d',
              foreground: '#000',
              DEFAULT: '#ffd25f'
            },
            danger: {
              '50': '#fff2ef',
              '100': '#fedfd9',
              '200': '#fecdc3',
              '300': '#fdbaad',
              '400': '#fda897',
              '500': '#fc9581',
              '600': '#d07b6a',
              '700': '#a46154',
              '800': '#78473d',
              '900': '#4c2d27',
              foreground: '#000',
              DEFAULT: '#fc9581'
            },
            background: '#fffbf6',
            foreground: '#a27225',
            content1: {
              DEFAULT: '#fff2e0',
              foreground: '#000'
            },
            content2: {
              DEFAULT: '#ffe9cc',
              foreground: '#000'
            },
            content3: {
              DEFAULT: '#ffe0b8',
              foreground: '#000'
            },
            content4: {
              DEFAULT: '#ffd7a3',
              foreground: '#000'
            },
            focus: '#db924b',
            overlay: '#000000'
          }
        },
        'brown-dark': {
          extend: 'dark',
          colors: {
            default: {
              '50': '#0d0b0d',
              '100': '#1a161a',
              '200': '#272227',
              '300': '#342d34',
              '400': '#413841',
              '500': '#676067',
              '600': '#8d888d',
              '700': '#b3afb3',
              '800': '#d9d7d9',
              '900': '#ffffff',
              foreground: '#fff',
              DEFAULT: '#413841'
            },
            primary: {
              '50': '#422c17',
              '100': '#684524',
              '200': '#8e5f31',
              '300': '#b5783e',
              '400': '#db924b',
              '500': '#e1a56b',
              '600': '#e8b88a',
              '700': '#eecbaa',
              '800': '#f4dec9',
              '900': '#fbf1e9',
              foreground: '#000',
              DEFAULT: '#db924b'
            },
            secondary: {
              '50': '#1b2828',
              '100': '#2b3f40',
              '200': '#3b5657',
              '300': '#4a6d6f',
              '400': '#5a8486',
              '500': '#779a9b',
              '600': '#94afb0',
              '700': '#b1c5c6',
              '800': '#cedadb',
              '900': '#eaf0f0',
              foreground: '#000',
              DEFAULT: '#5a8486'
            },
            success: {
              '50': '#2f3729',
              '100': '#4b5740',
              '200': '#667758',
              '300': '#82976f',
              '400': '#9db787',
              '500': '#aec49c',
              '600': '#bfd0b1',
              '700': '#d0ddc6',
              '800': '#e2e9db',
              '900': '#f3f6f0',
              foreground: '#000',
              DEFAULT: '#9db787'
            },
            warning: {
              '50': '#4d3f1d',
              '100': '#79642d',
              '200': '#a6893e',
              '300': '#d2ad4e',
              '400': '#ffd25f',
              '500': '#ffda7b',
              '600': '#ffe297',
              '700': '#ffeab3',
              '800': '#fff2cf',
              '900': '#fff9eb',
              foreground: '#000',
              DEFAULT: '#ffd25f'
            },
            danger: {
              '50': '#4c2d27',
              '100': '#78473d',
              '200': '#a46154',
              '300': '#d07b6a',
              '400': '#fc9581',
              '500': '#fda897',
              '600': '#fdbaad',
              '700': '#fecdc3',
              '800': '#fedfd9',
              '900': '#fff2ef',
              foreground: '#000',
              DEFAULT: '#fc9581'
            },
            background: '#20161F',
            foreground: '#c59f60',
            content1: {
              DEFAULT: '#2c1f2b',
              foreground: '#fff'
            },
            content2: {
              DEFAULT: '#3e2b3c',
              foreground: '#fff'
            },
            content3: {
              DEFAULT: '#50374d',
              foreground: '#fff'
            },
            content4: {
              DEFAULT: '#62435f',
              foreground: '#fff'
            },
            focus: '#db924b',
            overlay: '#ffffff'
          }
        },
        green: {
          extend: 'light',
          colors: {
            default: {
              '50': '#f6f8f7',
              '100': '#eaefec',
              '200': '#dee5e0',
              '300': '#d2dcd5',
              '400': '#c5d2c9',
              '500': '#b9c9be',
              '600': '#99a69d',
              '700': '#78837c',
              '800': '#585f5a',
              '900': '#383c39',
              foreground: '#000',
              DEFAULT: '#b9c9be'
            },
            primary: {
              '50': '#ecf9f0',
              '100': '#d1f0dc',
              '200': '#b6e7c7',
              '300': '#9cdeb3',
              '400': '#81d59e',
              '500': '#66cc8a',
              '600': '#54a872',
              '700': '#42855a',
              '800': '#306142',
              '900': '#1f3d29',
              foreground: '#000',
              DEFAULT: '#66cc8a'
            },
            secondary: {
              '50': '#e6efff',
              '100': '#c3d8fe',
              '200': '#a0c1fd',
              '300': '#7daafc',
              '400': '#5a93fc',
              '500': '#377cfb',
              '600': '#2d66cf',
              '700': '#2451a3',
              '800': '#1a3b77',
              '900': '#11254b',
              foreground: '#000',
              DEFAULT: '#377cfb'
            },
            success: {
              '50': '#dff4ed',
              '100': '#b3e5d4',
              '200': '#86d6ba',
              '300': '#59c7a1',
              '400': '#2db887',
              '500': '#00a96e',
              '600': '#008b5b',
              '700': '#006e48',
              '800': '#005034',
              '900': '#003321',
              foreground: '#000',
              DEFAULT: '#00a96e'
            },
            warning: {
              '50': '#fff7df',
              '100': '#ffecb3',
              '200': '#ffe086',
              '300': '#ffd559',
              '400': '#ffc92d',
              '500': '#ffbe00',
              '600': '#d29d00',
              '700': '#a67c00',
              '800': '#795a00',
              '900': '#4d3900',
              foreground: '#000',
              DEFAULT: '#ffbe00'
            },
            danger: {
              '50': '#ffeaeb',
              '100': '#ffcdd0',
              '200': '#ffb0b4',
              '300': '#ff9298',
              '400': '#ff757d',
              '500': '#ff5861',
              '600': '#d24950',
              '700': '#a6393f',
              '800': '#792a2e',
              '900': '#4d1a1d',
              foreground: '#000',
              DEFAULT: '#ff5861'
            },
            background: '#f6fffa',
            foreground: '#004c1b',
            content1: {
              DEFAULT: '#e0f5e8',
              foreground: '#000'
            },
            content2: {
              DEFAULT: '#c2ebd0',
              foreground: '#000'
            },
            content3: {
              DEFAULT: '#a3e0b9',
              foreground: '#000'
            },
            content4: {
              DEFAULT: '#85d6a1',
              foreground: '#000'
            },
            focus: '#66cc8a',
            overlay: '#000000'
          }
        },
        'green-dark': {
          extend: 'dark',
          colors: {
            default: {
              '50': '#0e100e',
              '100': '#1d211d',
              '200': '#2b312b',
              '300': '#3a423a',
              '400': '#485248',
              '500': '#6d756d',
              '600': '#919791',
              '700': '#b6bab6',
              '800': '#dadcda',
              '900': '#ffffff',
              foreground: '#fff',
              DEFAULT: '#485248'
            },
            primary: {
              '50': '#1f3d29',
              '100': '#306142',
              '200': '#42855a',
              '300': '#54a872',
              '400': '#66cc8a',
              '500': '#81d59e',
              '600': '#9cdeb3',
              '700': '#b6e7c7',
              '800': '#d1f0dc',
              '900': '#ecf9f0',
              foreground: '#000',
              DEFAULT: '#66cc8a'
            },
            secondary: {
              '50': '#11254b',
              '100': '#1a3b77',
              '200': '#2451a3',
              '300': '#2d66cf',
              '400': '#377cfb',
              '500': '#5a93fc',
              '600': '#7daafc',
              '700': '#a0c1fd',
              '800': '#c3d8fe',
              '900': '#e6efff',
              foreground: '#000',
              DEFAULT: '#377cfb'
            },
            success: {
              '50': '#003321',
              '100': '#005034',
              '200': '#006e48',
              '300': '#008b5b',
              '400': '#00a96e',
              '500': '#2db887',
              '600': '#59c7a1',
              '700': '#86d6ba',
              '800': '#b3e5d4',
              '900': '#dff4ed',
              foreground: '#000',
              DEFAULT: '#00a96e'
            },
            warning: {
              '50': '#4d3900',
              '100': '#795a00',
              '200': '#a67c00',
              '300': '#d29d00',
              '400': '#ffbe00',
              '500': '#ffc92d',
              '600': '#ffd559',
              '700': '#ffe086',
              '800': '#ffecb3',
              '900': '#fff7df',
              foreground: '#000',
              DEFAULT: '#ffbe00'
            },
            danger: {
              '50': '#4d1a1d',
              '100': '#792a2e',
              '200': '#a6393f',
              '300': '#d24950',
              '400': '#ff5861',
              '500': '#ff757d',
              '600': '#ff9298',
              '700': '#ffb0b4',
              '800': '#ffcdd0',
              '900': '#ffeaeb',
              foreground: '#000',
              DEFAULT: '#ff5861'
            },
            background: '#010b06',
            foreground: '#99d2ad',
            content1: {
              DEFAULT: '#14291c',
              foreground: '#fff'
            },
            content2: {
              DEFAULT: '#295237',
              foreground: '#fff'
            },
            content3: {
              DEFAULT: '#3d7a53',
              foreground: '#fff'
            },
            content4: {
              DEFAULT: '#52a36e',
              foreground: '#000'
            },
            focus: '#66cc8a',
            overlay: '#ffffff'
          }
        }
      },
      layout: {
        disabledOpacity: '0.5'
      }
    })
  ]
}
