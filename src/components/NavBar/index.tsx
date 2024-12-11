import { BsPostcard } from 'react-icons/bs'
import NavButton from '../NavButton'
import { FiUsers } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'

function NavBar() {
  return (
    <nav>
      <ul className='flex gap-2 flex-col'>
        <li className="flex flex-col gap-5">
          <NavButton href="/" icon={<BsPostcard />}>Посты</NavButton>
        </li>
        <li className="flex flex-col gap-5">
          <NavButton href="following" icon={<FiUsers />}>Подписки</NavButton>
        </li>
        <li className="flex flex-col gap-5">
          <NavButton href="followers" icon={<FaUsers />}>Подписчики</NavButton>
        </li>
      </ul>
    </nav>
  )
}

export default NavBar
