import { Chip } from '@nextui-org/react'
import { IconType } from 'react-icons'

interface ICountInfo {
  title: string
  count: number
  Icon: IconType
}

function CountInfo({ title, count, Icon }: ICountInfo) {
  return (
    <div className="flex flex-col items-center space-x-2 p-4">
      <span className="text-4xl font-semibold text-primary">{count}</span>
      <Chip
        radius="sm"
        startContent={<Icon />}
        variant="light"
        classNames={{
          content: 'text-md drop-shadow shadow-black uppercase !p-2',
        }}
      >
        {title}
      </Chip>
    </div>
  )
}

export default CountInfo
