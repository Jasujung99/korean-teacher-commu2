import { BookOpen, Users, MagnifyingGlass, UserCircle, Question, List, ChartLineUp } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import type { Section } from '@/lib/types'

interface HeaderProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  onNavigate: (page: 'home' | 'groups' | 'resources' | 'guide', section?: Section) => void
  currentPage: 'home' | 'groups' | 'resources' | 'guide'
  onLeftDrawerOpen?: () => void
  onRightDrawerOpen?: () => void
}

export function Header({ 
  activeSection, 
  onSectionChange, 
  onNavigate, 
  currentPage,
  onLeftDrawerOpen,
  onRightDrawerOpen 
}: HeaderProps) {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 md:gap-8">
            {currentPage === 'home' && onLeftDrawerOpen && (
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden"
                onClick={onLeftDrawerOpen}
                title="메뉴 열기"
              >
                <List size={24} />
              </Button>
            )}
            
            <button 
              onClick={() => onNavigate('home')}
              className="text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              <span className="hidden sm:inline">한국어 교사 동행</span>
              <span className="sm:hidden">교사 동행</span>
            </button>
            
            {currentPage === 'home' && (
              <Tabs value={activeSection} onValueChange={(v) => onSectionChange(v as Section)} className="hidden sm:block">
                <TabsList>
                  <TabsTrigger value="research" className="gap-2">
                    <BookOpen size={18} />
                    <span className="hidden md:inline">연구</span>
                  </TabsTrigger>
                  <TabsTrigger value="field" className="gap-2">
                    <Users size={18} />
                    <span className="hidden md:inline">현장</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative w-40 md:w-64 hidden sm:block">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                placeholder="검색..." 
                className="pl-10"
              />
            </div>
            
            <Button 
              variant="ghost"
              size="icon"
              className="sm:hidden"
              title="검색"
            >
              <MagnifyingGlass size={20} />
            </Button>
            
            <Button 
              variant={currentPage === 'guide' ? 'default' : 'ghost'}
              onClick={() => onNavigate('guide')}
              size="icon"
              title="이용 안내"
              className="hidden sm:flex"
            >
              <Question size={20} />
            </Button>
            
            <Button 
              variant={currentPage === 'resources' ? 'default' : 'outline'}
              onClick={() => onNavigate('resources')}
              className="hidden md:flex"
            >
              📁 자료실
            </Button>
            
            <Button 
              variant={currentPage === 'groups' ? 'default' : 'outline'}
              onClick={() => onNavigate('groups')}
              className="gap-2 hidden sm:flex"
            >
              <Users size={18} />
              <span className="hidden md:inline">모임 찾기</span>
            </Button>
            
            {currentPage === 'home' && onRightDrawerOpen && (
              <Button 
                variant="ghost" 
                size="icon"
                className="xl:hidden"
                onClick={onRightDrawerOpen}
                title="활동 현황"
              >
                <ChartLineUp size={24} />
              </Button>
            )}
            
            <Button variant="ghost" size="icon">
              <UserCircle size={24} />
            </Button>
          </div>
        </div>
        
        {currentPage === 'home' && (
          <div className="sm:hidden pb-3">
            <Tabs value={activeSection} onValueChange={(v) => onSectionChange(v as Section)}>
              <TabsList className="w-full">
                <TabsTrigger value="research" className="gap-2 flex-1">
                  <BookOpen size={18} />
                  <span>연구</span>
                </TabsTrigger>
                <TabsTrigger value="field" className="gap-2 flex-1">
                  <Users size={18} />
                  <span>현장</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>
    </header>
  )
}
