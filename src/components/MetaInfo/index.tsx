import { Spinner } from '@nextui-org/react'
import { IconType } from 'react-icons'

interface IMetaInfo {
  count: number
  Icon: IconType | typeof Spinner
  classNameForIcon?: string
}

function MetaInfo({ count, Icon, classNameForIcon }: IMetaInfo) {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      {count > 0 && (
        <p className="font-semibold text-default-400 text-l">{count}</p>
      )}
      <p
        className={
          'text-default-400 text-xl hover:transform hover:scale-125 ease-in duration-100' +
          classNameForIcon
        }
      >
        <Icon />
      </p>
    </div>
  )
}

export default MetaInfo
