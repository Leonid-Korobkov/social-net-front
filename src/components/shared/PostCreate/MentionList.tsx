// 'use client'

// import { forwardRef, useImperativeHandle, useState } from 'react'
// import { ReactRenderer } from '@tiptap/react'
// import tippy from 'tippy.js'

// interface MentionItem {
//   id: string
//   name: string
// }

// interface MentionListProps {
//   items: MentionItem[]
//   command: (item: { id: string; label: string }) => void
// }

// export const MentionList = forwardRef<any, MentionListProps>((props, ref) => {
//   const { items, command } = props
//   const [selectedIndex, setSelectedIndex] = useState<number>(0)

//   const selectItem = (index: number) => {
//     const item = items[index]
//     if (item) {
//       command({ id: item.id, label: item.name })
//     }
//   }

//   // Экспортируем методы компонента с помощью ref
//   useImperativeHandle(ref, () => ({
//     onKeyDown: ({ event }: { event: KeyboardEvent }) => {
//       if (event.key === 'ArrowUp') {
//         setSelectedIndex((selectedIndex + items.length - 1) % items.length)
//         return true
//       }
//       if (event.key === 'ArrowDown') {
//         setSelectedIndex((selectedIndex + 1) % items.length)
//         return true
//       }
//       if (event.key === 'Enter') {
//         selectItem(selectedIndex)
//         return true
//       }
//       return false
//     },
//   }))

//   return (
//     <div className="p-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-y-auto">
//       {items.length ? (
//         items.map((item, index) => (
//           <div
//             key={index}
//             onClick={() => selectItem(index)}
//             className={`p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
//               index === selectedIndex ? 'bg-gray-100 dark:bg-gray-700' : ''
//             }`}
//           >
//             {item.name}
//           </div>
//         ))
//       ) : (
//         <div className="p-2 text-gray-500">Нет пользователей</div>
//       )}
//     </div>
//   )
// })

// MentionList.displayName = 'MentionList'

// // Создаем конфигурацию для Mention-расширения
// export const createMentionSuggestion = () => {
//   // Это могли бы быть реальные данные из API
//   const users = [
//     { id: 'user1', name: 'Иван Иванов' },
//     { id: 'user2', name: 'Пётр Петров' },
//     { id: 'user3', name: 'Мария Сидорова' },
//   ]

//   return {
//     items: ({ query }: { query: string }) => {
//       return users
//         .filter(user => user.name.toLowerCase().includes(query.toLowerCase()))
//         .slice(0, 5)
//     },
//     render: () => {
//       let component: ReactRenderer | null = null
//       let popup: any = null
//       return {
//         onStart: (props: any) => {
//           component = new ReactRenderer(MentionList, {
//             props,
//             editor: props.editor,
//           })
//           popup = tippy('body', {
//             getReferenceClientRect: props.clientRect,
//             appendTo: () => document.body,
//             content: component.element,
//             showOnCreate: true,
//             interactive: true,
//             trigger: 'manual',
//             placement: 'bottom-start',
//             animation: 'scale',
//           })
//         },
//         onUpdate(props: any) {
//           component?.updateProps(props)
//           popup[0].setProps({
//             getReferenceClientRect: props.clientRect,
//           })
//         },
//         onKeyDown(props: any) {
//           if (props.event.key === 'Escape') {
//             popup[0].hide()
//             return true
//           }

//           // Безопасный доступ к ref
//           try {
//             // @ts-ignore
//             if (
//               component?.ref &&
//               typeof component.ref.onKeyDown === 'function'
//             ) {
//               // @ts-ignore
//               return component.ref.onKeyDown(props)
//             }
//           } catch (e) {
//             console.error('Error handling keydown in mention list', e)
//           }

//           return false
//         },
//         onExit() {
//           popup[0].destroy()
//           component?.destroy()
//         },
//       }
//     },
//   }
// }

// export default MentionList
