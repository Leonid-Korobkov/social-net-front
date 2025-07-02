import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
} from '@heroui/react'
import { MdShare, MdContentCopy } from 'react-icons/md'
import { FiShare } from 'react-icons/fi'
import { useShare } from '@/hooks/useShare'
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface ShareDropdownProps {
  url: string
  title?: string
  text?: string
  buttonText?: string
  className?: string
  onShareSuccess?: () => void
  iconOnly?: boolean
  count?: number
  size?: 'small' | 'normal'
  classNameForIcon?: string
  reduce?: boolean
}

export default function ShareDropdown({
  url,
  title = 'Zling',
  text = 'Ссылка из соцсети Zling',
  buttonText = 'Поделиться',
  className = '',
  onShareSuccess,
  iconOnly = false,
  count = 0,
  size = 'normal',
  classNameForIcon = '',
  reduce = false,
}: ShareDropdownProps) {
  const { handleShareUrl, canNativeShare, copyUrlToClipboard } = useShare()
  const [loading, setLoading] = useState(false)
  const [prevCount, setPrevCount] = useState(count)

  const iconSizeClass = size === 'small' ? 'text-xs' : 'text-base'
  const textSizeClass = size === 'small' ? 'text-xs' : 'text-sm'

  const countStr = count.toString()
  const staticPart = countStr.slice(0, -1)
  const animatedDigit = countStr.slice(-1)

  useEffect(() => {
    setPrevCount(count)
  }, [count])

  const handleCopy = async () => {
    setLoading(true)
    await copyUrlToClipboard(url)
    setLoading(false)
    onShareSuccess?.()
  }

  const handleNativeShare = async () => {
    setLoading(true)
    await handleShareUrl({ url, title, text })
    setLoading(false)
    onShareSuccess?.()
  }

  if (!iconOnly) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <div>
            <div
              className={`flex items-center gap-1.5 cursor-pointer group px-2 py-1 rounded-xl transition-colors hover:bg-default-100 ${className}`}
            >
              <span
                className={
                  `${iconSizeClass} transition-colors text-default-400 ` +
                  classNameForIcon
                }
              >
                {loading ? (
                  <Spinner
                    size="sm"
                    color="primary"
                    variant="gradient"
                    className="gap-0"
                  />
                ) : (
                  <FiShare />
                )}
              </span>
              {reduce ? (
                <span
                  className={`select-none font-medium text-default-400 ${textSizeClass}`}
                >
                  {count}
                </span>
              ) : (
                <div
                  className={`select-none font-medium text-default-400 ${textSizeClass} flex items-center`}
                >
                  {staticPart}
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={animatedDigit}
                      initial={{
                        opacity: 0,
                        y: 20,
                        filter: 'blur(8px)',
                        scale: 1.2,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        scale: 1,
                        transition: {
                          duration: 0.4,
                          type: 'spring',
                          damping: 15,
                          stiffness: 200,
                        },
                      }}
                      exit={{
                        opacity: 0,
                        y: -20,
                        filter: 'blur(8px)',
                        scale: 0.8,
                        transition: {
                          duration: 0.3,
                        },
                      }}
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'perspective(100px)',
                      }}
                    >
                      {animatedDigit}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </DropdownTrigger>
        <DropdownMenu variant="flat" aria-label="share-options">
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

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="ghost"
          color="primary"
          startContent={<MdShare />}
          className={className}
          fullWidth
          isLoading={loading}
        >
          {buttonText}
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat" aria-label="share-options">
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
