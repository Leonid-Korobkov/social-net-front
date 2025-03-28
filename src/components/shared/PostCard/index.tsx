import { Card, CardBody, Avatar } from "@heroui/react"
import { Post } from '../../../app/types'
import { Link } from 'react-router-dom'
import { formatDistance } from 'date-fns'
import { ru } from 'date-fns/locale'

interface PostCardProps {
  post: Post
}

function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Link to={`/users/${post.author.id}`}>
            <Avatar src={post.author.avatarUrl} name={post.author.name} />
          </Link>
          <div>
            <Link
              to={`/users/${post.author.id}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              {post.author.name}
            </Link>
            <p className="text-xs text-default-500">
              {formatDistance(new Date(post.createdAt), new Date(), {
                addSuffix: true,
                locale: ru,
              })}
            </p>
          </div>
        </div>
        <Link to={`/posts/${post.id}`}>
          <p className="text-default-700">{post.content}</p>
        </Link>
      </CardBody>
    </Card>
  )
}

export default PostCard
