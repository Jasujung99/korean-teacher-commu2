import { useState } from 'react'
import { BookOpen, GraduationCap, Lightbulb, Plus } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback } from './ui/avatar'
import type { Post, ResearchCategory } from '@/lib/types'

interface ResearchSectionProps {
  posts: Post[]
}

const categories = [
  {
    id: 'foundational' as ResearchCategory,
    name: '기초 학문',
    icon: BookOpen,
    description: '한국어를 깊이 있게 이해하기 위한 언어학 기초 영역',
    topics: ['문법론', '음운론', '의미론', '화용론', '국어사', '언어학 이론']
  },
  {
    id: 'educational' as ResearchCategory,
    name: '교육 연구',
    icon: GraduationCap,
    description: '한국어 교육의 이론과 실제를 연구하는 영역',
    topics: ['교수법 연구', '학습자 언어 분석', '오류 연구', '교육과정 연구']
  },
  {
    id: 'practical' as ResearchCategory,
    name: '실용 연구',
    icon: Lightbulb,
    description: '교실과 현장에서 바로 활용할 수 있는 실용적 연구 영역',
    topics: ['교재 검토 및 분석', '수업 사례 연구', '평가 방법 연구']
  }
]

export function ResearchSection({ posts }: ResearchSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResearchCategory>('foundational')

  const categoryPosts = posts.filter(p => p.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">연구 - 역량 강화</h1>
          <p className="text-muted-foreground mt-1">한국어 교육의 이론과 실제를 탐구합니다</p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          <span>새 글 작성</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(category => {
          const Icon = category.icon
          const count = posts.filter(p => p.category === category.id).length
          
          return (
            <Card
              key={category.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedCategory === category.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
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
                    {category.topics.slice(0, 3).map((topic, idx) => (
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
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
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
            <Button>첫 번째 글을 작성해보세요</Button>
          </Card>
        )}
      </div>
    </div>
  )
}
