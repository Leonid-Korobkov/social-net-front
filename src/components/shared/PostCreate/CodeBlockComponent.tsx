'use client'
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { Select, SelectItem } from '@heroui/react'
import { getLanguagesArray, LanguageType } from '@/utils/languages'

export default function CodeBlockComponent({
  node,
  updateAttributes,
  extension,
}: NodeViewProps) {
  // Извлекаем язык из атрибутов
  const language = node.attrs.language || 'plaintext'

  // Обработчик изменения языка
  const handleLanguageChange = (keys: any) => {
    // HeroUI Select возвращает Set с ключами
    const value = keys.values().next().value
    const selectedLang = value as LanguageType
    updateAttributes({ language: selectedLang })
  }

  // Получаем массив языков для Select
  const languages = getLanguagesArray()

  return (
    <NodeViewWrapper className="code-block" data-language={language}>
      <div className="code-block-header">
        <Select
          aria-label="Выберите язык программирования"
          selectedKeys={[language]}
          onSelectionChange={handleLanguageChange}
          className="min-w-32 text-xs code-block-select"
          size="sm"
          variant="flat"
          items={languages}
          startContent={
            <div className="text-default-500 mr-1">
              {languages.find(lang => lang.key === language)?.icon}
            </div>
          }
          placeholder="Выберите язык"
        >
          {language => (
            <SelectItem
              key={language.key}
              startContent={
                <div className="text-default-500 mr-1">{language.icon}</div>
              }
              className="text-xs"
              textValue={language.name}
            >
              {language.name}
            </SelectItem>
          )}
        </Select>
      </div>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  )
}
