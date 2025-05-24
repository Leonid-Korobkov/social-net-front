import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'
import { MdShare, MdContentCopy } from 'react-icons/md'
import { useShare } from '@/hooks/useShare'
import { useState } from 'react'

interface ShareDropdownProps {
  url: string
  title?: string
  text?: string
  buttonText?: string
  className?: string
}

export default function ShareDropdown({
  url,
  title = 'Zling',
  text = 'Ссылка из соцсети Zling',
  buttonText = 'Поделиться',
  className = '',
}: ShareDropdownProps) {
  const { handleShareUrl, canNativeShare, copyUrlToClipboard } = useShare()
  const [loading, setLoading] = useState(false)

  const handleCopy = async () => {
    setLoading(true)
    await copyUrlToClipboard(url)
    setLoading(false)
  }

  const handleNativeShare = async () => {
    setLoading(true)
    await handleShareUrl({ url, title, text })
    setLoading(false)
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="ghost"
          color="secondary"
          startContent={<MdShare />}
          className={className}
          isLoading={loading}
        >
          {buttonText}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="share-options">
        <DropdownItem
          key="copy"
          startContent={<MdContentCopy />}
          onClick={handleCopy}
        >
          Скопировать ссылку
        </DropdownItem>
        <DropdownItem
          key="native"
          startContent={<MdShare />}
          onClick={handleNativeShare}
          isDisabled={!canNativeShare}
        >
          Поделиться через...
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
