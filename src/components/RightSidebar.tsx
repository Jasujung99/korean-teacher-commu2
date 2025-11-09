import { TrendUp, ChatCircle, Users as UsersIcon } from '@phosphor-icons/react'
import { Card } from './ui/card'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import type { Post, Group } from '@/lib/types'

interface RightSidebarProps {
  posts: Post[]
  groups: Group[]
}

export function RightSidebar({ posts, groups }: RightSidebarProps) {
  const popularPosts = [...posts]
    .sort((a, b) => b.views - a.views)
    .slice(0, 3)

  const activeGroups = groups
    .filter(g => g.isActive)
    .slice(0, 3)

  const recentActivities = [
    { id: '1', userName: '김교사', action: '댓글 작성', timestamp: Date.now() - 300000 },
    { id: '2', userName: '이교사', action: '자료 업로드', timestamp: Date.now() - 600000 },
    { id: '3', userName: '박교사', action: '새 글 작성', timestamp: Date.now() - 900000 },
  ]

  return (
    <aside className="w-72 space-y-4 hidden xl:block">
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendUp size={18} className="text-accent" />
          <h3 className="font-semibold text-sm">🔥 인기글</h3>
        </div>
        <Separator className="mb-2" />
        <div className="space-y-3">
          {popularPosts.length > 0 ? (
            popularPosts.map(post => (
              <button
                key={post.id}
                className="w-full text-left group"
              >
                <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  조회 {post.views}
                </p>
              </button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">아직 게시글이 없습니다</p>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <ChatCircle size={18} className="text-primary" />
          <h3 className="font-semibold text-sm">💬 최근 활동</h3>
        </div>
        <Separator className="mb-2" />
        <div className="space-y-3">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-start gap-2">
              <Avatar className="h-6 w-6 mt-0.5">
                <AvatarFallback className="text-xs">
                  {activity.userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">{activity.userName}</span>님이{' '}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.floor((Date.now() - activity.timestamp) / 60000)}분 전
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <UsersIcon size={18} className="text-secondary" />
          <h3 className="font-semibold text-sm">👥 활성 모임</h3>
        </div>
        <Separator className="mb-2" />
        <div className="space-y-3">
          {activeGroups.length > 0 ? (
            activeGroups.map(group => (
              <button
                key={group.id}
                className="w-full text-left group"
              >
                <p className="text-sm font-medium group-hover:text-primary transition-colors">
                  {group.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {group.members}명 참여 중
                </p>
              </button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">활성 모임이 없습니다</p>
          )}
        </div>
      </Card>
    </aside>
  )
}
