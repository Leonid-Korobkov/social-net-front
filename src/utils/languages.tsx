import React from 'react'
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiHtml5,
  SiCss3,
  SiJson,
  SiMarkdown,
  SiPostgresql,
  SiGnubash,
  SiPhp,
  SiCplusplus,
  SiC,
  SiRust,
  SiGo,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiDart,
  SiScala,
  SiYaml,
  SiDocker,
  SiGraphql,
  SiR,
  SiLua,
  SiPerl,
  SiElixir,
  SiDelphi,
} from 'react-icons/si'
import { TbFileText, TbBrandCSharp, TbBrandPowershell } from 'react-icons/tb'
import { FaJava } from 'react-icons/fa'
import { DiSass, DiVim } from 'react-icons/di'
import { RiTerminalBoxLine } from 'react-icons/ri'
import { FiFileText } from 'react-icons/fi'

// Определяем доступные языки с иконками
export const LANGUAGES = {
  // Популярные языки
  javascript: { name: 'JavaScript', icon: <SiJavascript /> },
  typescript: { name: 'TypeScript', icon: <SiTypescript /> },
  python: { name: 'Python', icon: <SiPython /> },
  html: { name: 'HTML', icon: <SiHtml5 /> },
  css: { name: 'CSS', icon: <SiCss3 /> },
  json: { name: 'JSON', icon: <SiJson /> },
  markdown: { name: 'Markdown', icon: <SiMarkdown /> },
  sql: { name: 'SQL', icon: <SiPostgresql /> },
  bash: { name: 'Bash', icon: <SiGnubash /> },

  // Другие распространенные языки
  php: { name: 'PHP', icon: <SiPhp /> },
  java: { name: 'Java', icon: <FaJava /> },
  csharp: { name: 'C#', icon: <TbBrandCSharp /> },
  cpp: { name: 'C++', icon: <SiCplusplus /> },
  c: { name: 'C', icon: <SiC /> },
  rust: { name: 'Rust', icon: <SiRust /> },
  go: { name: 'Go', icon: <SiGo /> },
  ruby: { name: 'Ruby', icon: <SiRuby /> },
  swift: { name: 'Swift', icon: <SiSwift /> },
  kotlin: { name: 'Kotlin', icon: <SiKotlin /> },
  dart: { name: 'Dart', icon: <SiDart /> },
  scala: { name: 'Scala', icon: <SiScala /> },

  // Конфигурационные языки и форматы
  xml: { name: 'XML', icon: <SiHtml5 /> },
  yaml: { name: 'YAML', icon: <SiYaml /> },
  dockerfile: { name: 'Dockerfile', icon: <SiDocker /> },
  graphql: { name: 'GraphQL', icon: <SiGraphql /> },
  scss: { name: 'SCSS', icon: <DiSass /> },
  sass: { name: 'Sass', icon: <DiSass /> },
  less: { name: 'Less', icon: <SiCss3 /> },

  // Скриптовые языки
  powershell: { name: 'PowerShell', icon: <TbBrandPowershell /> },
  shell: { name: 'Shell', icon: <RiTerminalBoxLine /> },
  r: { name: 'R', icon: <SiR /> },
  lua: { name: 'Lua', icon: <SiLua /> },
  perl: { name: 'Perl', icon: <SiPerl /> },
  elixir: { name: 'Elixir', icon: <SiElixir /> },

  // Другие форматы
  diff: { name: 'Diff', icon: <FiFileText /> },
  ini: { name: 'INI', icon: <FiFileText /> },
  vimscript: { name: 'Vim', icon: <DiVim /> },
  delphi: { name: 'Delphi', icon: <SiDelphi /> },

  // Универсальный вариант для неизвестных языков
  plaintext: { name: 'Plain Text', icon: <TbFileText /> },
} as const

export type LanguageType = keyof typeof LANGUAGES

// Получаем массив языков для селекта
export const getLanguagesArray = () => {
  return Object.entries(LANGUAGES).map(([key, { name, icon }]) => ({
    key,
    name,
    icon,
  }))
}

// Получаем иконку языка по его ключу
export const getLanguageIcon = (language: string) => {
  const normalizedLang = language.toLowerCase()

  // Проверяем точное соответствие
  if (normalizedLang in LANGUAGES) {
    return LANGUAGES[normalizedLang as LanguageType].icon
  }

  // Проверяем наличие ключа в идентификаторе языка (для legacy кода)
  const matchingKey = Object.keys(LANGUAGES).find(key =>
    normalizedLang.includes(key)
  )

  if (matchingKey) {
    return LANGUAGES[matchingKey as LanguageType].icon
  }

  // Возвращаем иконку по умолчанию
  return LANGUAGES.plaintext.icon
}

// Получаем название языка по его ключу
export const getLanguageName = (language: string) => {
  const normalizedLang = language.toLowerCase()

  // Проверяем точное соответствие
  if (normalizedLang in LANGUAGES) {
    return LANGUAGES[normalizedLang as LanguageType].name
  }

  // Проверяем наличие ключа в идентификаторе языка
  const matchingKey = Object.keys(LANGUAGES).find(key =>
    normalizedLang.includes(key)
  )

  if (matchingKey) {
    return LANGUAGES[matchingKey as LanguageType].name
  }

  // Возвращаем название по умолчанию или форматированное имя языка
  return language.charAt(0).toUpperCase() + language.slice(1)
}

// Общие языки в lowlight и highlightjs
export const COMMON_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'ruby',
  'go',
  'php',
  'rust',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'xml',
  'json',
  'yaml',
  'markdown',
  'bash',
  'shell',
  'sql',
  'powershell',
  'r',
  'lua',
] as const
