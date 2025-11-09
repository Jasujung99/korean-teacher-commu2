import { BookOpen, Users, MagnifyingGlass, UserCircle } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import type { Section } from '@/lib/types'

interface HeaderProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  onNavigate: (page: 'home' | 'groups' | 'resources', section?: Section) => void
  currentPage: 'home' | 'groups' | 'resources'
}

export function Header({ activeSection, onSectionChange, onNavigate, currentPage }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              한국어 교사 동행
            </button>
            
            {currentPage === 'home' && (
              <Tabs value={activeSection} onValueChange={(v) => onSectionChange(v as Section)}>
                <TabsList>
                  <TabsTrigger value="research" className="gap-2">
                    <BookOpen size={18} />
                    <span>연구</span>
                  </TabsTrigger>
                  <TabsTrigger value="field" className="gap-2">
                    <Users size={18} />
                    <span>현장</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden md:block">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="검색..." 
                className="pl-10"
              />
            </div>
            
            <Button 
              variant={currentPage === 'resources' ? 'default' : 'outline'}
              onClick={() => onNavigate('resources')}
            >
              📁 자료실
            </Button>
            
            <Button 
              variant={currentPage === 'groups' ? 'default' : 'outline'}
              onClick={() => onNavigate('groups')}
              className="gap-2"
            >
              <Users size={18} />
              <span>모임 찾기</span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <UserCircle size={24} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
