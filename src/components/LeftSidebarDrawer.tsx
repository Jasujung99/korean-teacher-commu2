import { Bell, FileText, Calendar, Link } from '@phosphor-icons/react'
import { Card } from './ui/card'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'

const announcements = [
  { id: '1', title: '[중요] 저작권 정책 안내', isImportant: true, createdAt: Date.now() - 86400000 },
  { id: '2', title: '신규 기능 업데이트', isImportant: false, createdAt: Date.now() - 172800000 },
]

const events = [
  { id: '1', title: '문법 워크숍', date: '1/20', type: 'workshop' as const },
  { id: '2', title: '온라인 세미나', date: '1/22', type: 'seminar' as const },
]

const externalLinks = [
  { id: '1', title: '국립국어원', url: '#' },
  { id: '2', title: '세종학당재단', url: '#' },
  { id: '3', title: '관련 학회', url: '#' },
]

interface LeftSidebarDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LeftSidebarDrawer({ open, onOpenChange }: LeftSidebarDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 sm:w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>커뮤니티 정보</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bell size={18} className="text-primary" />
              <h3 className="font-semibold text-sm">전체 공지</h3>
            </div>
            <Separator className="mb-3" />
            <div className="space-y-2">
              {announcements.map(announcement => (
                <button
                  key={announcement.id}
                  className="w-full text-left text-sm hover:text-primary transition-colors flex items-start gap-2"
                >
                  {announcement.isImportant && (
                    <Badge variant="destructive" className="text-xs px-1 py-0 h-4 mt-0.5">
                      중요
                    </Badge>
                  )}
                  <span className="flex-1 line-clamp-2">{announcement.title}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={18} className="text-resource" />
              <h3 className="font-semibold text-sm">자료실 바로가기</h3>
            </div>
            <Separator className="mb-3" />
            <div className="space-y-2">
              <button className="w-full text-left text-sm hover:text-primary transition-colors">
                • 최근 업로드
              </button>
              <button className="w-full text-left text-sm hover:text-primary transition-colors">
                • 인기 자료
              </button>
              <button className="w-full text-left text-sm hover:text-primary transition-colors">
                • 내 자료함
              </button>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-secondary" />
              <h3 className="font-semibold text-sm">이번 주 행사</h3>
            </div>
            <Separator className="mb-3" />
            <div className="space-y-2">
              {events.map(event => (
                <button
                  key={event.id}
                  className="w-full text-left text-sm hover:text-primary transition-colors"
                >
                  • {event.date} {event.title}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Link size={18} className="text-muted-foreground" />
              <h3 className="font-semibold text-sm">유용한 링크</h3>
            </div>
            <Separator className="mb-3" />
            <div className="space-y-2">
              {externalLinks.map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  className="block text-sm hover:text-primary transition-colors"
                >
                  • {link.title}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
