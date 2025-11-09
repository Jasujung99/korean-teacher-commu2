import { BookOpen, Users, FolderOpen, Plus, MagnifyingGlass, UploadSimple, Link, Bell, ChatCircle, Heart, Download } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

export function UsageGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-foreground">누리집 이용 안내</h1>
        <p className="text-lg text-muted-foreground">
          한국어 교사 동행 플랫폼을 효과적으로 활용하는 방법을 안내합니다
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>플랫폼 소개</CardTitle>
          <CardDescription>
            한국어 교사 동행은 한국어 교사들이 연구를 공유하고, 현장 경험을 나누며, 
            전문성을 함께 키워가는 커뮤니티 플랫폼입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
              <BookOpen size={32} className="text-primary mb-3" />
              <h3 className="font-semibold mb-2">연구 공유</h3>
              <p className="text-sm text-muted-foreground">
                학문적 연구와 교육 이론을 함께 탐구합니다
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
              <Users size={32} className="text-secondary mb-3" />
              <h3 className="font-semibold mb-2">현장 실천</h3>
              <p className="text-sm text-muted-foreground">
                실제 수업 경험과 다문화 활동을 나눕니다
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
              <FolderOpen size={32} className="text-resource mb-3" />
              <h3 className="font-semibold mb-2">자료 관리</h3>
              <p className="text-sm text-muted-foreground">
                저작권이 보호되는 중앙 자료실을 운영합니다
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="navigation" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
              <MagnifyingGlass size={24} className="text-primary" />
              <span>누리집 둘러보기</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                연구 섹션
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                학문적 연구와 교육 이론을 세 가지 범주로 나누어 제공합니다:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-sm">
                  <Badge variant="outline" className="mr-2">기초학문</Badge>
                  국어학, 언어학 등의 학문적 기초 연구
                </li>
                <li className="text-sm">
                  <Badge variant="outline" className="mr-2">교육연구</Badge>
                  교육학, 교수법 등의 교육 이론 연구
                </li>
                <li className="text-sm">
                  <Badge variant="outline" className="mr-2">실용연구</Badge>
                  문화, 정책 등의 실용적 연구
                </li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Users size={20} className="text-secondary" />
                현장 섹션
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                실제 교육 현장의 경험과 실천을 공유합니다:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="text-sm">
                  <Badge variant="outline" className="mr-2">수업현장</Badge>
                  실제 수업 사례와 교실 활동 경험
                </li>
                <li className="text-sm">
                  <Badge variant="outline" className="mr-2">다문화실천</Badge>
                  다문화 가정 지원과 지역사회 활동
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="posting" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
              <Plus size={24} className="text-primary" />
              <span>게시글 작성하기</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <ol className="space-y-3 list-decimal list-inside">
              <li className="text-sm">
                <span className="font-medium">섹션 선택:</span> 상단 메뉴에서 '연구' 또는 '현장' 선택
              </li>
              <li className="text-sm">
                <span className="font-medium">카테고리 선택:</span> 왼쪽 사이드바에서 적절한 주제 선택
              </li>
              <li className="text-sm">
                <span className="font-medium">글쓰기 버튼:</span> '새 게시글' 버튼 클릭
              </li>
              <li className="text-sm">
                <span className="font-medium">내용 작성:</span> 제목과 본문을 작성하고 필요시 자료실 파일 연결
              </li>
              <li className="text-sm">
                <span className="font-medium">공개 설정:</span> 게시글의 공개 범위 설정 후 게시
              </li>
            </ol>
            
            <div className="bg-accent/10 p-4 rounded-lg mt-4">
              <p className="text-sm font-medium mb-2">💡 작성 팁</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 구체적이고 명확한 제목을 사용하세요</li>
                <li>• 관련 자료가 있다면 자료실에서 연결하세요</li>
                <li>• 적절한 카테고리와 주제를 선택하세요</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="resources" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
              <UploadSimple size={24} className="text-resource" />
              <span>자료실 이용하기</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-3">
              <h4 className="font-semibold">자료 업로드</h4>
              <ol className="space-y-2 list-decimal list-inside text-sm">
                <li>자료실 페이지에서 '자료 업로드' 버튼 클릭</li>
                <li>저작권 확인 체크박스 선택 (필수)</li>
                <li>라이선스 유형 선택:
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>• <Badge variant="secondary" className="text-xs">CC-BY</Badge> 저작자 표시</li>
                    <li>• <Badge variant="secondary" className="text-xs">CC-BY-NC</Badge> 비영리 사용</li>
                    <li>• <Badge variant="secondary" className="text-xs">CC-BY-ND</Badge> 변경 금지</li>
                    <li>• <Badge variant="secondary" className="text-xs">저작권</Badge> 모든 권리 보유</li>
                  </ul>
                </li>
                <li>카테고리, 난이도, 태그 설정</li>
                <li>공개 범위 설정 (전체공개/회원/그룹/비공개)</li>
                <li>업로드 완료 시 고유 ID 자동 생성</li>
              </ol>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Link size={20} className="text-primary" />
                자료 연결하기
              </h4>
              <p className="text-sm text-muted-foreground">
                게시글 작성 시 자료실의 파일을 직접 업로드 대신 연결할 수 있습니다:
              </p>
              <ol className="space-y-2 list-decimal list-inside text-sm">
                <li>게시글 작성 중 '자료 첨부' 버튼 클릭</li>
                <li>자료실에서 원하는 파일 검색</li>
                <li>표시 형식 선택 (링크/카드/임베드)</li>
                <li>게시글에 자료 참조 삽입</li>
              </ol>
            </div>

            <div className="bg-resource/10 p-4 rounded-lg mt-4">
              <p className="text-sm font-medium mb-2">✨ 자료실의 장점</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• 중복 업로드 방지로 저장 공간 절약</li>
                <li>• 저작권 보호 및 추적 가능</li>
                <li>• 다운로드 통계 및 사용 현황 확인</li>
                <li>• 여러 게시글에서 동일 자료 재사용</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="groups" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-secondary" />
              <span>모임 참여하기</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-3">
              <h4 className="font-semibold">모임 찾기</h4>
              <ol className="space-y-2 list-decimal list-inside text-sm">
                <li>상단 메뉴의 '모임 찾기' 버튼 클릭</li>
                <li>관심 주제, 지역, 활동 방식으로 필터링</li>
                <li>모임 상세 정보 확인 (주제, 일정, 정원)</li>
                <li>'참여 신청' 버튼 클릭</li>
              </ol>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold">새 모임 만들기</h4>
              <ol className="space-y-2 list-decimal list-inside text-sm">
                <li>'새 모임 만들기' 버튼 클릭</li>
                <li>모임 정보 입력:
                  <ul className="ml-6 mt-2 space-y-1 text-muted-foreground">
                    <li>• 모임 이름과 설명</li>
                    <li>• 온라인/오프라인 선택</li>
                    <li>• 주제 태그 (문법, 발음, 문화 등)</li>
                    <li>• 지역 (오프라인인 경우)</li>
                    <li>• 정기 일정</li>
                    <li>• 최대 인원</li>
                  </ul>
                </li>
                <li>공개 범위 및 승인 방식 설정</li>
                <li>모임 게시</li>
              </ol>
            </div>

            <div className="bg-secondary/10 p-4 rounded-lg mt-4">
              <p className="text-sm font-medium mb-2">👥 모임 유형</p>
              <div className="grid gap-3 md:grid-cols-2 mt-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">온라인 모임</p>
                  <p className="text-xs text-muted-foreground">
                    화상회의 도구를 활용한 원격 스터디
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">오프라인 모임</p>
                  <p className="text-xs text-muted-foreground">
                    지역 기반 대면 모임 및 워크숍
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="interaction" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
              <ChatCircle size={24} className="text-primary" />
              <span>소통하기</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Heart size={20} />
                  <h4 className="font-semibold">좋아요</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  유용한 게시글에 좋아요를 눌러 감사를 표현하세요
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <ChatCircle size={20} />
                  <h4 className="font-semibold">댓글</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  의견과 질문을 댓글로 남겨 대화를 이어가세요
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-resource">
                  <Download size={20} />
                  <h4 className="font-semibold">자료 다운로드</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  필요한 자료를 다운로드하고 출처를 명시하세요
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Bell size={20} className="text-accent" />
                활동 알림
              </h4>
              <p className="text-sm text-muted-foreground">
                오른쪽 사이드바에서 실시간 활동을 확인할 수 있습니다:
              </p>
              <ul className="space-y-1 ml-6 text-sm">
                <li>• 인기 게시글 및 트렌딩 주제</li>
                <li>• 최근 댓글 및 새 게시물</li>
                <li>• 활발한 모임 소식</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tips" className="border rounded-lg px-6">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-3">
              <span>💡</span>
              <span>활용 팁</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="grid gap-4">
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">검색 활용</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  상단 검색창을 이용해 키워드로 게시글, 자료, 모임을 빠르게 찾을 수 있습니다
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">카테고리별 탐색</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  왼쪽 사이드바의 카테고리를 활용해 관심 분야의 콘텐츠를 체계적으로 탐색하세요
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">저작권 준수</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  자료 업로드 시 반드시 저작권을 확인하고, 다운로드한 자료 사용 시 출처를 명시하세요
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">적극적 참여</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  댓글, 좋아요, 자료 공유 등 적극적인 참여가 더 풍부한 커뮤니티를 만듭니다
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">모바일 접근</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  모바일에서도 모든 기능을 사용할 수 있으며, 하단 네비게이션으로 쉽게 이동할 수 있습니다
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle>문의 및 지원</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            누리집 이용 중 문제가 발생하거나 궁금한 점이 있으시면 언제든 문의해 주세요.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">공지사항 확인</Badge>
            <Badge variant="outline" className="text-xs">FAQ 참고</Badge>
            <Badge variant="outline" className="text-xs">운영진 문의</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
