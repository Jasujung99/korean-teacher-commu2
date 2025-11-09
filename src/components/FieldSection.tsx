import { useState } from 'react'
import { Chalkboard, HandHeart, Plus } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Avatar, AvatarFallback } from './ui/avatar'
import type { Post, FieldCategory } from '@/lib/types'

interface FieldSectionProps {
  posts: Post[]
}

const categories = [
  {
    id: 'classroom' as FieldCategory,
    name: '수업 현장',
    icon: Chalkboard,
    description: '교실에서 일어나는 생생한 이야기를 나누는 곳',
    topics: ['수업 이야기', '학습자와의 관계', '수업 성찰']
  },
  {
    id: 'multicultural' as FieldCategory,
    name: '다문화 실천',
    icon: HandHeart,
    description: '교실을 넘어 지역사회와 다문화 공동체 안에서 함께하는 실천',
    topics: ['지역사회 활동', '다문화 가정 소통', '현장 경험 나눔']
  }
]

export function FieldSection({ posts }: FieldSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<FieldCategory>('classroom')

  const categoryPosts = posts.filter(p => p.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">현장 - 다문화 소통과 실천</h1>
          <p className="text-muted-foreground mt-1">교실과 지역사회의 생생한 경험을 공유합니다</p>
        </div>
        <Button variant="secondary" className="gap-2">
          <Plus size={18} />
          <span>새 글 작성</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(category => {
          const Icon = category.icon
          const count = posts.filter(p => p.category === category.id).length
          
          return (
            <Card
              key={category.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-secondary' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedCategory === category.id ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
                }`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{category.name}</h3>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {category.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          {categories.find(c => c.id === selectedCategory)?.name} 게시글
        </h2>
        
        {categoryPosts.length > 0 ? (
          <div className="space-y-3">
            {categoryPosts.map(post => (
              <Card key={post.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 hover:text-secondary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span>조회 {post.views}</span>
                      <span>•</span>
                      <span>댓글 {post.comments}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">아직 게시글이 없습니다</p>
            <Button variant="secondary">첫 번째 글을 작성해보세요</Button>
          </Card>
        )}
      </div>
    </div>
  )
}
