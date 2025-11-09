import { useState } from 'react'
import { Plus, Download, FileText, FunnelSimple, ShieldCheck } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { toast } from 'sonner'
import type { Resource, LicenseType, ResourceCategory, Level } from '@/lib/types'

interface ResourceLibraryProps {
  resources: Resource[]
}

const categoryLabels: Record<ResourceCategory, string> = {
  'lesson-plan': '교안',
  'worksheet': '활동지',
  'assessment': '평가',
  'research': '연구',
  'reference': '참고'
}

const levelLabels: Record<Level, string> = {
  'beginner': '초급',
  'intermediate': '중급',
  'advanced': '고급',
  'mixed': '혼합'
}

const licenseLabels: Record<LicenseType, string> = {
  'cc-by': 'CC BY (출처 표시)',
  'cc-by-nc': 'CC BY-NC (출처 표시-비영리)',
  'cc-by-nd': 'CC BY-ND (출처 표시-변경금지)',
  'copyright': '© 저작권 보호 (무단 사용 금지)'
}

export function ResourceLibrary({ resources }: ResourceLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'all'>('all')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory)

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('자료가 업로드되었습니다', {
      description: '자료번호: #MAT2025-0001'
    })
    setUploadDialogOpen(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">자료실</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">저작권이 보호되는 중앙 자료 관리 시스템</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-resource text-resource-foreground hover:bg-resource/90 w-full sm:w-auto">
              <Plus size={18} />
              <span>자료 업로드</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>📤 자료 업로드</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-4">
                <div className="border-2 border-destructive/50 rounded-lg p-4 bg-destructive/5">
                  <div className="flex items-start gap-2 mb-3">
                    <ShieldCheck size={20} className="text-destructive mt-0.5" />
                    <h4 className="font-semibold">⚠️ 저작권 확인서</h4>
                  </div>
                  <div className="space-y-2 ml-7">
                    <div className="flex items-start gap-2">
                      <Checkbox id="own-work" required />
                      <Label htmlFor="own-work" className="text-sm font-normal">
                        본인이 직접 제작한 자료입니다
                      </Label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox id="citation" required />
                      <Label htmlFor="citation" className="text-sm font-normal">
                        인용/참고 자료의 출처를 명시했습니다
                      </Label>
                    </div>
                    <div className="flex items-start gap-2">
                      <Checkbox id="permission" required />
                      <Label htmlFor="permission" className="text-sm font-normal">
                        제3자 저작물 사용 허가를 받았습니다
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>라이선스 선택 *</Label>
                  <RadioGroup defaultValue="cc-by" required>
                    {(Object.keys(licenseLabels) as LicenseType[]).map(license => (
                      <div key={license} className="flex items-center space-x-2">
                        <RadioGroupItem value={license} id={license} />
                        <Label htmlFor={license} className="font-normal text-sm">
                          {licenseLabels[license]}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">2️⃣ 자료 분류</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input id="title" required placeholder="자료 제목을 입력하세요" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">설명</Label>
                  <Textarea id="description" placeholder="자료에 대한 간단한 설명" rows={3} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(categoryLabels) as ResourceCategory[]).map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {categoryLabels[cat]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">수준 *</Label>
                    <Select required>
                      <SelectTrigger id="level">
                        <SelectValue placeholder="선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(levelLabels) as Level[]).map(level => (
                          <SelectItem key={level} value={level}>
                            {levelLabels[level]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">태그</Label>
                  <Input id="tags" placeholder="#문법 #말하기 (쉼표로 구분)" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold">3️⃣ 공개 설정</h4>
                <RadioGroup defaultValue="public">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="font-normal text-sm">전체 공개</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="members" id="members" />
                    <Label htmlFor="members" className="font-normal text-sm">회원 공개</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="group" id="group" />
                    <Label htmlFor="group" className="font-normal text-sm">특정 모임</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="font-normal text-sm">비공개</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)} className="w-full sm:w-auto">
                  취소
                </Button>
                <Button type="submit" className="w-full sm:w-auto">업로드 완료</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="whitespace-nowrap"
          >
            전체
          </Button>
          {(Object.keys(categoryLabels) as ResourceCategory[]).map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap"
            >
              {categoryLabels[cat]}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length > 0 ? (
          filteredResources.map(resource => (
            <Card key={resource.id} className="p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <FileText size={24} className="text-resource" />
                <Badge variant="outline" className="text-xs">
                  {licenseLabels[resource.license]}
                </Badge>
              </div>
              
              <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">{resource.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">
                {resource.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {categoryLabels[resource.category]}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {levelLabels[resource.level]}
                </Badge>
                {resource.tags.slice(0, 2).map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground pt-3 border-t">
                <div className="flex items-center gap-1">
                  <Download size={14} />
                  <span>{resource.downloads}</span>
                </div>
                <span>{resource.fileSize}</span>
              </div>
              
              <Button className="w-full mt-3" variant="outline" size="sm">
                다운로드
              </Button>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="p-8 md:p-12 text-center">
              <p className="text-muted-foreground mb-4">등록된 자료가 없습니다</p>
              <Button onClick={() => setUploadDialogOpen(true)} className="w-full sm:w-auto">
                첫 번째 자료를 업로드하세요
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
