import { useState } from 'react'
import { Plus, FunnelSimple, MapPin, BookOpen as BookOpenIcon } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import type { Group, GroupType, GroupTopic } from '@/lib/types'

interface GroupsPageProps {
  groups: Group[]
}

const topicLabels: Record<GroupTopic, string> = {
  grammar: '문법',
  pronunciation: '발음',
  culture: '문화',
  assessment: '평가',
  pedagogy: '교수법'
}

const regionOptions = ['서울', '경기', '부산', '대구', '광주', '대전', '기타']

export function GroupsPage({ groups }: GroupsPageProps) {
  const [activeTab, setActiveTab] = useState<'online' | 'offline' | 'my'>('online')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTopics, setSelectedTopics] = useState<GroupTopic[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

  const filteredGroups = groups.filter(group => {
    if (activeTab === 'my') return false
    if (activeTab === 'online' && group.type !== 'online') return false
    if (activeTab === 'offline' && group.type !== 'offline') return false
    
    if (selectedTopics.length > 0) {
      const hasMatchingTopic = group.topics.some(t => selectedTopics.includes(t))
      if (!hasMatchingTopic) return false
    }
    
    if (selectedRegions.length > 0 && group.type === 'offline') {
      if (!group.region || !selectedRegions.includes(group.region)) return false
    }
    
    return true
  })

  const toggleTopic = (topic: GroupTopic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    )
  }

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">모임 찾기</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">함께 성장하는 한국어 교사 커뮤니티</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus size={18} />
          <span className="hidden sm:inline">새 모임 만들기</span>
          <span className="sm:hidden">모임 만들기</span>
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="flex-1">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="online" className="flex-1 sm:flex-none">온라인 모임</TabsTrigger>
              <TabsTrigger value="offline" className="flex-1 sm:flex-none">오프라인 모임</TabsTrigger>
              <TabsTrigger value="my" className="flex-1 sm:flex-none">내 모임</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 w-full sm:w-auto"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FunnelSimple size={16} />
            <span>필터</span>
          </Button>
        </div>

        {showFilters && (
          <div className="border-t pt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm">주제별</h4>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(topicLabels) as GroupTopic[]).map(topic => (
                  <Badge
                    key={topic}
                    variant={selectedTopics.includes(topic) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTopic(topic)}
                  >
                    {topicLabels[topic]}
                  </Badge>
                ))}
              </div>
            </div>

            {activeTab === 'offline' && (
              <div>
                <h4 className="font-medium mb-2 text-sm">지역별</h4>
                <div className="flex flex-wrap gap-2">
                  {regionOptions.map(region => (
                    <Badge
                      key={region}
                      variant={selectedRegions.includes(region) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleRegion(region)}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <div className="space-y-3">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <Card key={group.id} className="p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-semibold">{group.name}</h3>
                    <Badge variant={group.type === 'online' ? 'default' : 'secondary'}>
                      {group.type === 'online' ? '온라인' : '오프라인'}
                    </Badge>
                    {group.isActive && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        활성
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm md:text-base text-muted-foreground mb-3">{group.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mb-3">
                    <span>{group.schedule}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{group.members}명 참여</span>
                    {group.region && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {group.region}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {group.topics.map((topic, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        #{topicLabels[topic]}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full sm:w-auto">참여 신청</Button>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 md:p-12 text-center">
            <p className="text-muted-foreground mb-4">
              {activeTab === 'my' ? '참여 중인 모임이 없습니다' : '검색 결과가 없습니다'}
            </p>
            <Button className="w-full sm:w-auto">
              {activeTab === 'my' ? '모임 찾아보기' : '필터 초기화'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
