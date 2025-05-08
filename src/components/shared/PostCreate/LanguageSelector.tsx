// 'use client'

// import { Select, SelectItem } from '@heroui/react'
// import {
//   SiJavascript,
//   SiTypescript,
//   SiPython,
//   SiHtml5,
//   SiCss3,
//   SiJson,
//   SiMarkdown,
//   SiPostgresql,
//   SiGnubash,
// } from 'react-icons/si'
// import { TbFileText } from 'react-icons/tb'


// // Компонент выбора языка
// interface LanguageSelectorProps {
//   editor: any
//   isActive: boolean
// }

// export const LanguageSelector = ({
//   editor,
//   isActive,
// }: LanguageSelectorProps) => {
//   const currentLang = editor?.getAttributes('codeBlock').language || 'plaintext'

//   const handleLanguageChange = (keys: any) => {
//     // HeroUI Select возвращает Set с ключами
//     const value = keys.values().next().value
//     const selectedLang = value as LanguageType

//     if (!isActive) {
//       editor.chain().focus().setCodeBlock({ language: selectedLang }).run()
//       return
//     }
//     editor
//       .chain()
//       .focus()
//       .updateAttributes('codeBlock', { language: selectedLang })
//       .run()
//   }

//   if (!isActive) return null

//   // Преобразуем объект языков в массив для Select
//   const languages = Object.entries(LANGUAGES).map(([key, { name, icon }]) => ({
//     key,
//     name,
//     icon,
//   }))

//   return (
//     <Select
//       aria-label="Выберите язык программирования"
//       selectedKeys={[currentLang]}
//       onSelectionChange={handleLanguageChange}
//       className="min-w-32 text-xs"
//       size="sm"
//       variant="flat"
//       items={languages}
//       classNames={{
//         trigger: 'h-9 min-h-0 py-0 px-3 bg-default-100',
//         value: 'text-xs font-medium',
//         listbox: 'py-1',
//         popoverContent: 'min-w-[160px]',
//       }}
//       startContent={
//         <div className="text-default-500 mr-1">
//           {LANGUAGES[currentLang as LanguageType]?.icon}
//         </div>
//       }
//       placeholder="Выберите язык"
//       listboxProps={{
//         itemClasses: {
//           base: 'py-2',
//         },
//       }}
//       popoverProps={{
//         classNames: {
//           content: 'p-0 border border-default-200 shadow-lg',
//           base: 'animate-in fade-in-0 zoom-in-95 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
//         },
//       }}
//     >
//       {language => (
//         <SelectItem
//           key={language.key}
//           startContent={
//             <div className="text-default-500 mr-1">{language.icon}</div>
//           }
//           className="text-xs"
//           textValue={language.name}
//         >
//           {language.name}
//         </SelectItem>
//       )}
//     </Select>
//   )
// }

// export default LanguageSelector
