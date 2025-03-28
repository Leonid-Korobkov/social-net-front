import { useState } from 'react'
import {
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
  Spinner,
  Button,
  Alert,
} from "@heroui/react"
import { IoSearch } from 'react-icons/io5'
import UserCard from '../../components/shared/UserCard'
import PostCard from '../../components/shared/PostCard'
import {
  useSearchPostsQuery,
  useSearchUsersQuery,
} from '../../app/services/search.api'
import { skipToken } from '@reduxjs/toolkit/query'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('posts')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const {
    data: posts = [],
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
  } = useSearchPostsQuery(debouncedQuery || skipToken)

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isFetching: isFetchingUsers,
  } = useSearchUsersQuery(debouncedQuery || skipToken)

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setDebouncedQuery(searchQuery.trim())
  }

  const isLoading =
    (activeTab === 'posts' && (isLoadingPosts || isFetchingPosts)) ||
    (activeTab === 'users' && (isLoadingUsers || isFetchingUsers))

  return (
    <div className="container mx-auto">
      <Card className="mb-6">
        {/* сообщение о том, что пока поиск не работает */}
        <Alert
          color="danger"
          title="Поиск не работает"
          description={
            <>
              Пока что поиск не работает, но мы работаем над этим.
              <br />
              Можете даже не пытаться 🙃
            </>
          }
        />
        <CardBody>
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              endContent={<IoSearch className="text-2xl text-default-400" />}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <Button
              color="secondary"
              onClick={handleSearch}
              isLoading={isLoading}
            >
              Поиск
            </Button>
          </div>
        </CardBody>
      </Card>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={key => setActiveTab(key.toString())}
      >
        <Tab key="posts" title="Посты">
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                {debouncedQuery
                  ? 'Посты не найдены'
                  : 'Введите запрос для поиска постов'}
              </p>
            )}
          </div>
        </Tab>
        <Tab key="users" title="Пользователи">
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center">
                <Spinner size="lg" />
              </div>
            ) : users.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {users.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                {debouncedQuery
                  ? 'Пользователи не найдены'
                  : 'Введите запрос для поиска пользователей'}
              </p>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default Search
