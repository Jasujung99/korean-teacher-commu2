import { BookOpen, Users, FolderOpen, ChartLineUp, CheckCircle, ArrowRight, Lightbulb, ShieldCheck, TreeStructure, Circle } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

export function SiteStructure() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-4">
        <div className="inline-block">
          <Badge variant="outline" className="mb-3">플랫폼 설계 문서</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
          한국어 교사 동행
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          최종 누리집 구조
        </p>
        <Separator className="my-6" />
      </div>

      <section className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <TreeStructure size={32} className="text-primary" />
            메인 메뉴 구성 (2개 중심)
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen size={28} className="text-primary" />
                </div>
                <CardTitle className="text-2xl">1. 연구 - 역량 강화</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Circle size={8} className="mt-2 flex-shrink-0" weight="fill" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold text-lg">1-1. 기초 학문</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        한국어를 깊이 있게 이해하기 위한 언어학 기초 영역입니다.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">문법론</Badge>
                        <Badge variant="secondary" className="text-xs">음운론</Badge>
                        <Badge variant="secondary" className="text-xs">의미론</Badge>
                        <Badge variant="secondary" className="text-xs">화용론</Badge>
                        <Badge variant="secondary" className="text-xs">국어사</Badge>
                        <Badge variant="secondary" className="text-xs">언어학 이론</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Circle size={8} className="mt-2 flex-shrink-0" weight="fill" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold text-lg">1-2. 교육 연구</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        한국어 교육의 이론과 실제를 연구하는 영역입니다.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">교수법 연구</Badge>
                        <Badge variant="secondary" className="text-xs">학습자 언어 분석</Badge>
                        <Badge variant="secondary" className="text-xs">오류 연구</Badge>
                        <Badge variant="secondary" className="text-xs">교육과정 연구</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Circle size={8} className="mt-2 flex-shrink-0" weight="fill" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold text-lg">1-3. 실용 연구</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        교실과 현장에서 바로 활용할 수 있는 실용적 연구 영역입니다.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="text-xs">교재 검토 및 분석</Badge>
                        <Badge variant="secondary" className="text-xs">수업 사례 연구</Badge>
                        <Badge variant="secondary" className="text-xs">평가 방법 연구</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Users size={28} className="text-secondary" />
                </div>
                <CardTitle className="text-2xl">2. 현장 - 다문화 소통과 실천</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Circle size={8} className="mt-2 flex-shrink-0" weight="fill" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold text-lg">2-1. 수업 현장</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        교실에서 일어나는 생생한 이야기를 나누는 곳입니다.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="text-xs border-secondary/50">수업 이야기</Badge>
                        <Badge variant="outline" className="text-xs border-secondary/50">학습자와의 관계</Badge>
                        <Badge variant="outline" className="text-xs border-secondary/50">수업 성찰</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Circle size={8} className="mt-2 flex-shrink-0" weight="fill" />
                    <div className="space-y-2 flex-1">
                      <h4 className="font-semibold text-lg">2-2. 다문화 실천</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        교실을 넘어 지역사회와 다문화 공동체 안에서 함께하는 실천을 나눕니다.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline" className="text-xs border-secondary/50">지역사회 활동</Badge>
                        <Badge variant="outline" className="text-xs border-secondary/50">다문화 가정 소통</Badge>
                        <Badge variant="outline" className="text-xs border-secondary/50">현장 경험 나눔</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <ChartLineUp size={32} className="text-accent" />
          사이드바 구성
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">좌측 사이드바 (고정)</CardTitle>
              <CardDescription>정적 정보 및 바로가기</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-3">
                <div>
                  <div className="font-semibold mb-2">📢 전체 공지</div>
                  <div className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <div>• [중요] 저작권 정책 안내</div>
                    <div>• 신규 기능 업데이트</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-semibold mb-2">📁 자료실 바로가기</div>
                  <div className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <div>• 최근 업로드</div>
                    <div>• 인기 자료</div>
                    <div>• 내 자료함</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-semibold mb-2">📅 이번 주 행사</div>
                  <div className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <div>• 1/20 문법 워크숍</div>
                    <div>• 1/22 온라인 세미나</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-semibold mb-2">🔗 유용한 링크</div>
                  <div className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <div>• 국립국어원</div>
                    <div>• 세종학당재단</div>
                    <div>• 관련 학회</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">우측 사이드바 (동적)</CardTitle>
              <CardDescription>실시간 활동 및 인기 콘텐츠</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-3">
                <div>
                  <div className="font-semibold mb-2">🔥 인기글</div>
                  <div className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <div>• 초급 문법 교안 (조회 523)</div>
                    <div>• TOPIK 대비 전략 (조회 412)</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-semibold mb-2">💬 최근 활동</div>
                  <div className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <div>• 김교사님이 댓글 작성</div>
                    <div>• 이교사님이 자료 업로드</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="font-semibold mb-2">👥 활성 모임</div>
                  <div className="ml-4 space-y-1 text-muted-foreground text-xs">
                    <div>• 서울 스터디 (15명 온라인)</div>
                    <div>• 문법 연구회 (토론 중)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Users size={32} className="text-secondary" />
          모임 시스템 (하이브리드)
        </h2>

        <Card>
          <CardHeader>
            <CardTitle>상단 고정 버튼</CardTitle>
            <CardDescription>메인 네비게이션에 통합</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex flex-wrap items-center gap-3 text-sm font-mono">
                <Badge>연구</Badge>
                <Badge>현장</Badge>
                <div className="flex-1 min-w-[100px]"></div>
                <Badge variant="outline">🔍검색</Badge>
                <Badge variant="outline">👥모임 찾기</Badge>
                <Badge variant="outline">👤내정보</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>모임 찾기 전용 페이지</CardTitle>
            <CardDescription>독립된 모임 검색 및 관리 페이지</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-5 rounded-lg space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">모임 찾기</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">온라인 모임</Badge>
                  <Badge variant="secondary">오프라인 모임</Badge>
                  <Badge variant="secondary">내 모임</Badge>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <p className="font-medium">필터:</p>
                <div className="space-y-2 ml-4 text-muted-foreground">
                  <div>□ 주제별: 문법 | 발음 | 문화 | 평가 | 교수법</div>
                  <div>□ 지역별: 서울 | 경기 | 부산 | 대구 | 광주 | 대전 | 기타</div>
                  <div>□ 수준별: 초급 | 중급 | 고급 | 혼합</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Card className="border-primary/30">
                  <CardContent className="pt-4 space-y-2">
                    <h5 className="font-semibold">📚 한국어 문법 깊이 읽기</h5>
                    <p className="text-xs text-muted-foreground">
                      온라인 | 매주 화 20:00 | 회원 32명
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">#문법</Badge>
                      <Badge variant="outline" className="text-xs">#연구</Badge>
                      <Badge variant="outline" className="text-xs">#논문읽기</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-secondary/30">
                  <CardContent className="pt-4 space-y-2">
                    <h5 className="font-semibold">🌏 서울 다문화 교사 모임</h5>
                    <p className="text-xs text-muted-foreground">
                      오프라인 | 월 1회 | 회원 18명
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">#서울</Badge>
                      <Badge variant="outline" className="text-xs">#다문화</Badge>
                      <Badge variant="outline" className="text-xs">#네트워킹</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="pt-2">
                <Badge variant="default" className="cursor-pointer">+ 새 모임 만들기</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <FolderOpen size={32} className="text-resource" />
          자료실 중앙 관리 시스템
        </h2>

        <Card className="border-resource/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck size={24} className="text-resource" />
              자료 업로드 프로세스
            </CardTitle>
            <CardDescription>모든 자료는 자료실을 통해 중앙 관리됩니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-resource/20 text-resource text-sm">1</span>
                  저작권 확인
                </h4>
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-4 space-y-3 text-sm">
                    <p className="font-medium flex items-center gap-2">
                      <ShieldCheck size={18} className="text-amber-600" />
                      저작권 확인서
                    </p>
                    <div className="space-y-2 ml-6 text-xs">
                      <div>□ 본인이 직접 제작한 자료입니다</div>
                      <div>□ 인용/참고 자료의 출처를 명시했습니다</div>
                      <div>□ 제3자 저작물 사용 허가를 받았습니다</div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <p className="font-medium text-xs">라이선스 선택:</p>
                      <div className="space-y-1 ml-4 text-xs">
                        <div>○ CC BY (출처 표시)</div>
                        <div>○ CC BY-NC (출처 표시-비영리)</div>
                        <div>○ CC BY-ND (출처 표시-변경금지)</div>
                        <div>○ © 저작권 보호 (무단 사용 금지)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-resource/20 text-resource text-sm">2</span>
                  자료 분류
                </h4>
                <div className="ml-8 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-muted-foreground" />
                    <span>카테고리: [교안/활동지/평가/연구/참고]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-muted-foreground" />
                    <span>수준: [초급/중급/고급/혼합]</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight size={16} className="text-muted-foreground" />
                    <span>태그: #문법 #말하기 (자유 입력)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-resource/20 text-resource text-sm">3</span>
                  공개 설정
                </h4>
                <div className="ml-8 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">전체 공개</Badge>
                    <Badge variant="outline">회원 공개</Badge>
                    <Badge variant="outline">특정 모임</Badge>
                    <Badge variant="outline">비공개</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle size={18} weight="fill" />
                  업로드 완료
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 ml-6 mt-1">
                  자료번호: #MAT2025-0001 생성
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>다른 게시판에서 자료 연결</CardTitle>
            <CardDescription>자료실의 파일을 게시글에 참조하는 방식</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-5 rounded-lg space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-3">📝 글 작성 (연구/현장 게시판)</p>
                <div className="space-y-2 ml-4">
                  <div className="text-muted-foreground">제목: [____________________]</div>
                  <div className="text-muted-foreground">본문: [____________________]</div>
                  <div className="mt-3">
                    <Badge variant="secondary" className="cursor-pointer">📎 자료 첨부</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <Card className="bg-background">
                <CardContent className="pt-4 space-y-3 text-xs">
                  <p className="font-semibold">자료실에서 가져오기</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span>🔍 검색:</span>
                      <div className="flex-1 border-b border-dashed"></div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="font-medium">📂 내 자료:</p>
                    <div className="ml-4 space-y-1 text-muted-foreground">
                      <div>• #MAT2025-0001 초급문법교안</div>
                      <div>• #MAT2025-0002 활동지모음</div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <p className="font-medium">삽입 방식:</p>
                    <div className="ml-4 space-y-1">
                      <div>○ 링크 (제목+다운로드)</div>
                      <div>○ 카드 (미리보기+정보)</div>
                      <div>○ 임베드 (문서 뷰어)</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Badge variant="default" className="text-xs">삽입</Badge>
                    <Badge variant="outline" className="text-xs">새 자료 업로드 →</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle>자료 추적 대시보드</CardTitle>
            <CardDescription>내가 올린 자료의 사용 현황 확인</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-5 rounded-lg space-y-4 text-sm">
              <p className="font-semibold">📊 자료 관리 (내 페이지)</p>
              
              <div className="space-y-3">
                <p className="font-medium">내가 올린 자료 (15개)</p>
                <Card className="bg-background">
                  <CardContent className="pt-4 space-y-2 text-xs">
                    <p className="font-semibold">#MAT2025-0001 초급문법교안</p>
                    <p className="text-muted-foreground">업로드: 2025.01.15</p>
                    <p className="text-muted-foreground">다운로드: 45회 | 인용: 3개 글</p>
                    <div className="flex gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">통계 보기</Badge>
                      <Badge variant="outline" className="text-xs">설정 변경</Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="pt-2">
                  <p className="font-medium mb-2">이 자료를 인용한 글:</p>
                  <div className="ml-4 space-y-1 text-xs text-muted-foreground">
                    <div>• [연구] 문법 교육 개선 방안</div>
                    <div>• [현장] 초급반 수업 후기</div>
                    <div>• [모임] 1월 스터디 자료</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8" />

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Lightbulb size={32} className="text-accent" weight="fill" />
          주요 특징
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle size={24} className="text-green-600" weight="fill" />
                저작권 보호 강화
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>모든 자료 업로드 시 저작권 확인 필수</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>라이선스 명시 및 추적 시스템</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>워터마크 자동 삽입 (PDF)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle size={24} className="text-blue-600" weight="fill" />
                효율적 자료 관리
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>자료실 단일 업로드 → 전체 게시판에서 참조</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>중복 방지 및 버전 관리</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>자료별 고유번호로 추적 가능</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle size={24} className="text-purple-600" weight="fill" />
                사용자 편의성
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>직관적인 2개 메인 메뉴 (연구/현장)</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>사이드바로 빠른 접근</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>모임 찾기 독립 버튼으로 쉬운 참여</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle size={24} className="text-orange-600" weight="fill" />
                커뮤니티 활성화
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>실시간 활동 표시</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>인기 콘텐츠 노출</span>
              </div>
              <div className="flex items-start gap-2">
                <ArrowRight size={16} className="mt-1 flex-shrink-0 text-muted-foreground" />
                <span>모임 중심 네트워킹 강화</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="my-8" />

      <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
        <CardHeader>
          <CardTitle className="text-xl">추가 개선 사항</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" weight="fill" />
              <div className="space-y-1">
                <p className="font-medium text-sm">누리집 이용 안내</p>
                <p className="text-xs text-muted-foreground">사용자를 위한 종합 가이드 제공</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" weight="fill" />
              <div className="space-y-1">
                <p className="font-medium text-sm">모바일 반응형 디자인</p>
                <p className="text-xs text-muted-foreground">모든 기기에서 최적화된 경험</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" weight="fill" />
              <div className="space-y-1">
                <p className="font-medium text-sm">서랍창 사이드바</p>
                <p className="text-xs text-muted-foreground">모바일에서 좌우 사이드바를 서랍창으로 제공</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle size={20} className="mt-0.5 flex-shrink-0 text-primary" weight="fill" />
              <div className="space-y-1">
                <p className="font-medium text-sm">접근성 향상</p>
                <p className="text-xs text-muted-foreground">헤더에 이용 안내 아이콘 버튼 추가</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
