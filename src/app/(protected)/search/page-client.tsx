'use client'
import UserCard from '@/components/shared/UserCard'
import { useSearch } from '@/services/api/search.api'
import {
  Button,
  Card as HeroCard,
  CardBody,
  Input,
  Spinner,
  Tab,
  Tabs,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import Link from 'next/link'
import Card from '@/components/shared/Card'
import { UserSettingsStore } from '@/store/userSettings.store'
import { useStore } from 'zustand'
import { useRouter, useSearchParams } from 'next/navigation'

function SearchClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Получение данных из URL или из хранилища
  const urlQuery = searchParams.get('q')
  const urlTab = searchParams.get('tab')

  const searchTextFromStore = useStore(
    UserSettingsStore,
    state => state.searchText
  )
  const setSearchTextToStore = useStore(
    UserSettingsStore,
    state => state.setSearchText
  )
  const activeTabFromStore = useStore(
    UserSettingsStore,
    state => state.searchActiveTab
  )
  const setActiveTabToStore = useStore(
    UserSettingsStore,
    state => state.setSearchActiveTab
  )

  // Приоритет URL-параметрам, затем сохраненным значениям
  const initialQuery = urlQuery || searchTextFromStore
  const initialTab = urlTab || activeTabFromStore

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  // Обновление URL и Zustand-хранилища при изменении параметров поиска
  useEffect(() => {
    // Обновляем URL
    const params = new URLSearchParams(searchParams.toString())

    if (debouncedQuery) {
      params.set('q', debouncedQuery)
    } else {
      params.delete('q')
    }

    if (activeTab !== 'posts') {
      params.set('tab', activeTab)
    } else {
      params.delete('tab')
    }

    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/search${newUrl}`, { scroll: false })

    // Обновляем Zustand-хранилище
    setSearchTextToStore(debouncedQuery)
    setActiveTabToStore(activeTab)
  }, [
    debouncedQuery,
    activeTab,
    router,
    searchParams,
    setSearchTextToStore,
    setActiveTabToStore,
  ])

  // Состояние для дебаунса поискового запроса
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        setDebouncedQuery(searchQuery.trim())
      } else {
        setDebouncedQuery('')
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const {
    data,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSearch({
    query: debouncedQuery,
    type:
      activeTab === 'all'
        ? 'all'
        : (activeTab as 'users' | 'posts' | 'comments'),
    limit: 10,
  })

  const posts = data?.pages.flatMap(page => page.posts) || []
  const users = data?.pages.flatMap(page => page.users) || []
  const comments = data?.pages.flatMap(page => page.comments) || []

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setDebouncedQuery('')
      return
    }
    setDebouncedQuery(searchQuery.trim())
  }

  const isLoadingResults = isLoading

  return (
    <div className="container mx-auto">
      <HeroCard className="mb-6">
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
              color="primary"
              onClick={handleSearch}
              isLoading={isLoadingResults}
            >
              Поиск
            </Button>
          </div>
        </CardBody>
      </HeroCard>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={key => setActiveTab(key.toString())}
        fullWidth
        color="primary"
      >
        <Tab key="all" title="Все">
          <div className="mt-4 space-y-6">
            {isLoadingResults ? (
              <div className="flex justify-center">
                <Spinner size="lg" color="primary" variant="gradient" />
              </div>
            ) : (
              <>
                {users.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-3">Пользователи</h2>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-auto">
                      {users.slice(0, 5).map(user => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                    {users.length > 5 && (
                      <Button
                        className="mt-2"
                        onClick={() => setActiveTab('users')}
                        type="button"
                        fullWidth
                        variant="ghost"
                        color={'primary'}
                      >
                        Показать больше пользователей
                      </Button>
                    )}
                  </div>
                )}

                {posts.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-3">Посты</h2>
                    <div className="space-y-4">
                      {posts.slice(0, 3).map(post => (
                        <Card
                          key={post.id}
                          id={post.id}
                          authorId={post.authorId}
                          avatarUrl={post.author?.avatarUrl || ''}
                          cardFor={'search'}
                          content={post.content}
                          username={post.author?.userName || ''}
                          likedByUser={post.likedByUser}
                          commentsCount={post.commentCount}
                          createdAt={post.createdAt}
                          likesCount={post.likeCount}
                          isFollowing={post.isFollowing}
                        />
                      ))}
                    </div>
                    {posts.length > 3 && (
                      <Button
                        className="mt-2"
                        type="button"
                        fullWidth
                        variant="ghost"
                        color={'primary'}
                        onClick={() => setActiveTab('posts')}
                      >
                        Показать больше постов
                      </Button>
                    )}
                  </div>
                )}

                {comments.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-3">Комментарии</h2>
                    <div className="space-y-4">
                      {comments.slice(0, 3).map(comment => (
                        <HeroCard key={comment.id} className="mb-4">
                          <CardBody>
                            <p className="text-sm mb-2 opacity-70">
                              <Link
                                href={`/${comment.post.author.userName}/post/${comment.post.id}`}
                              >
                                В посте: {comment.post.content.substring(0, 50)}
                                {comment.post.content.length > 50 ? '...' : ''}
                              </Link>
                            </p>
                            <p>{comment.content}</p>
                            <Link href={`/${comment.user.userName}`}>
                              <div className="flex items-center mt-2">
                                <img
                                  src={comment.user.avatarUrl}
                                  alt={comment.user.name}
                                  className="w-6 h-6 rounded-full mr-2"
                                />
                                <span className="text-sm">
                                  {comment.user.name}
                                </span>
                              </div>
                            </Link>
                          </CardBody>
                        </HeroCard>
                      ))}
                    </div>
                    {comments.length > 3 && (
                      <Button
                        className="mt-2"
                        type="button"
                        fullWidth
                        variant="ghost"
                        color={'primary'}
                        onClick={() => setActiveTab('comments')}
                      >
                        Показать больше комментариев
                      </Button>
                    )}
                  </div>
                )}

                {!isLoadingResults &&
                  users.length === 0 &&
                  posts.length === 0 &&
                  comments.length === 0 && (
                    <p className="text-center text-gray-500">
                      {debouncedQuery
                        ? 'По вашему запросу ничего не найдено'
                        : 'Введите поисковый запрос'}
                    </p>
                  )}
              </>
            )}
          </div>
        </Tab>

        <Tab key="posts" title="Посты">
          <div className="mt-4">
            {isLoadingResults ? (
              <div className="flex justify-center">
                <Spinner size="lg" color="primary" variant="gradient" />
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map(post => (
                  <Card
                    key={post.id}
                    id={post.id}
                    authorId={post.authorId}
                    avatarUrl={post.author?.avatarUrl || ''}
                    cardFor={'search'}
                    content={post.content}
                    username={post.author?.userName || ''}
                    likedByUser={post.likedByUser}
                    commentsCount={post.commentCount}
                    createdAt={post.createdAt}
                    likesCount={post.likeCount}
                    isFollowing={post.isFollowing}
                  />
                ))}
                {hasNextPage && (
                  <div className="flex justify-center mt-4">
                    <Button
                      color="primary"
                      type="button"
                      fullWidth
                      variant="ghost"
                      onClick={() => fetchNextPage()}
                      isLoading={isFetchingNextPage}
                    >
                      Загрузить еще
                    </Button>
                  </div>
                )}
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
            {isLoadingResults ? (
              <div className="flex justify-center">
                <Spinner size="lg" color="primary" variant="gradient" />
              </div>
            ) : users.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-auto">
                {users.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
                {hasNextPage && (
                  <div className="flex justify-center mt-4 col-span-1 xl:col-span-2">
                    <Button
                      type="button"
                      fullWidth
                      variant="ghost"
                      color={'primary'}
                      onClick={() => fetchNextPage()}
                      isLoading={isFetchingNextPage}
                    >
                      Загрузить еще
                    </Button>
                  </div>
                )}
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

        <Tab key="comments" title="Комментарии">
          <div className="mt-4">
            {isLoadingResults ? (
              <div className="flex justify-center">
                <Spinner size="lg" color="primary" variant="gradient" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <HeroCard key={comment.id} className="mb-4">
                    <CardBody>
                      <p className="text-sm mb-2 opacity-70">
                        <Link
                          href={`/${comment.post.author.userName}/post/${comment.post.id}`}
                        >
                          В посте: {comment.post.content.substring(0, 50)}
                          {comment.post.content.length > 50 ? '...' : ''}
                        </Link>
                      </p>
                      <p>{comment.content}</p>
                      <Link href={`/${comment.user.userName}`}>
                        <div className="flex items-center mt-2">
                          <img
                            src={comment.user.avatarUrl}
                            alt={comment.user.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm">{comment.user.name}</span>
                        </div>
                      </Link>
                    </CardBody>
                  </HeroCard>
                ))}
                {hasNextPage && (
                  <div className="flex justify-center mt-4">
                    <Button
                      type="button"
                      fullWidth
                      variant="ghost"
                      color={'primary'}
                      onClick={() => fetchNextPage()}
                      isLoading={isFetchingNextPage}
                    >
                      Загрузить еще
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                {debouncedQuery
                  ? 'Комментарии не найдены'
                  : 'Введите запрос для поиска комментариев'}
              </p>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default SearchClient
