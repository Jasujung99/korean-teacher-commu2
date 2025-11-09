import { useState } from 'react'
import { CaretRight } from '@phosphor-icons/react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'

export function SiteStructure() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'main-menu': true,
    'research': false,
    'research-1': false,
    'research-2': false,
    'research-3': false,
    'field': false,
    'field-1': false,
    'field-2': false,
    'sidebar': true,
    'sidebar-left': false,
    'sidebar-right': false,
    'groups': true,
    'resource': true,
    'resource-upload': false,
    'resource-link': false,
    'resource-track': false,
    'features': true,
  })

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="pt-12 pb-8 space-y-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>📋</span>
          <span>플랫폼 설계 문서</span>
        </div>
        <h1 className="text-5xl font-bold text-foreground">
          한국어 교사 동행
        </h1>
        <p className="text-lg text-muted-foreground pt-1">
          최종 누리집 구조
        </p>
      </div>

      <div className="border-l-2 border-border pl-6 space-y-1">

        <Collapsible open={openSections['main-menu']} onOpenChange={() => toggleSection('main-menu')}>
          <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
            <CaretRight 
              size={18} 
              className={`transition-transform ${openSections['main-menu'] ? 'rotate-90' : ''} text-muted-foreground`}
            />
            <h2 className="text-2xl font-semibold">메인 메뉴 구성 (2개 중심)</h2>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-3 pb-2 space-y-1">
            
            <Collapsible open={openSections['research']} onOpenChange={() => toggleSection('research')}>
              <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
                <CaretRight 
                  size={16} 
                  className={`transition-transform ${openSections['research'] ? 'rotate-90' : ''} text-muted-foreground`}
                />
                <h3 className="text-xl font-semibold">1. 연구 - 역량 강화</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-2 pb-1 space-y-1">
                
                <Collapsible open={openSections['research-1']} onOpenChange={() => toggleSection('research-1')}>
                  <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1 rounded-sm w-full group">
                    <CaretRight 
                      size={14} 
                      className={`transition-transform ${openSections['research-1'] ? 'rotate-90' : ''} text-muted-foreground`}
                    />
                    <h4 className="text-base font-medium">1-1. 기초 학문</h4>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1 pb-1">
                    <p className="text-sm text-muted-foreground mb-2">한국어를 깊이 있게 이해하기 위한 언어학 기초 영역입니다.</p>
                    <ul className="space-y-0.5 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>문법론:</strong> 한국어 문법 체계, 품사, 문장 구조 연구</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>음운론:</strong> 소리의 체계, 발음 규칙, 음운 변동 연구</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>의미론:</strong> 낱말과 문장의 뜻, 의미 관계 연구</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>화용론:</strong> 맥락 속 언어 사용, 담화와 대화 연구</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>국어사:</strong> 한국어의 변천과 발달 과정 연구</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>언어학 이론:</strong> 일반언어학, 응용언어학, 습득론 등</span>
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections['research-2']} onOpenChange={() => toggleSection('research-2')}>
                  <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1 rounded-sm w-full group">
                    <CaretRight 
                      size={14} 
                      className={`transition-transform ${openSections['research-2'] ? 'rotate-90' : ''} text-muted-foreground`}
                    />
                    <h4 className="text-base font-medium">1-2. 교육 연구</h4>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1 pb-1">
                    <p className="text-sm text-muted-foreground mb-2">한국어 교육의 이론과 실제를 연구하는 영역입니다.</p>
                    <ul className="space-y-0.5 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>교수법 연구:</strong> 다양한 교수법 이론과 적용 사례</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>학습자 언어 분석:</strong> 학습자의 언어 발달 단계와 특성</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>오류 연구:</strong> 학습자 오류 분석 및 교정 방법</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>교육과정 연구:</strong> 교육과정 설계, 교수요목, 평가 체계</span>
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections['research-3']} onOpenChange={() => toggleSection('research-3')}>
                  <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1 rounded-sm w-full group">
                    <CaretRight 
                      size={14} 
                      className={`transition-transform ${openSections['research-3'] ? 'rotate-90' : ''} text-muted-foreground`}
                    />
                    <h4 className="text-base font-medium">1-3. 실용 연구</h4>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1 pb-1">
                    <p className="text-sm text-muted-foreground mb-2">교실과 현장에서 바로 활용할 수 있는 실용적 연구 영역입니다.</p>
                    <ul className="space-y-0.5 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>교재 검토 및 분석:</strong> 교재 비교, 활용 후기, 개선 제안</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>수업 사례 연구:</strong> 실제 수업 분석, 교수 전략 연구</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>평가 방법 연구:</strong> 평가 도구 개발, 평가 사례 분석</span>
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={openSections['field']} onOpenChange={() => toggleSection('field')}>
              <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
                <CaretRight 
                  size={16} 
                  className={`transition-transform ${openSections['field'] ? 'rotate-90' : ''} text-muted-foreground`}
                />
                <h3 className="text-xl font-semibold">2. 현장 - 다문화 소통과 실천</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-2 pb-1 space-y-1">
                
                <Collapsible open={openSections['field-1']} onOpenChange={() => toggleSection('field-1')}>
                  <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1 rounded-sm w-full group">
                    <CaretRight 
                      size={14} 
                      className={`transition-transform ${openSections['field-1'] ? 'rotate-90' : ''} text-muted-foreground`}
                    />
                    <h4 className="text-base font-medium">2-1. 수업 현장</h4>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1 pb-1">
                    <p className="text-sm text-muted-foreground mb-2">교실에서 일어나는 생생한 이야기를 나누는 곳입니다.</p>
                    <ul className="space-y-0.5 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>수업 이야기:</strong> 실제 수업의 생생한 경험과 사례</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>학습자와의 관계:</strong> 학습자 이해, 소통, 관계 맺기</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>수업 성찰:</strong> 수업에 대한 고민과 성찰, 개선 노력</span>
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible open={openSections['field-2']} onOpenChange={() => toggleSection('field-2')}>
                  <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1 rounded-sm w-full group">
                    <CaretRight 
                      size={14} 
                      className={`transition-transform ${openSections['field-2'] ? 'rotate-90' : ''} text-muted-foreground`}
                    />
                    <h4 className="text-base font-medium">2-2. 다문화 실천</h4>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-6 pt-1 pb-1">
                    <p className="text-sm text-muted-foreground mb-2">교실을 넘어 지역사회와 다문화 공동체 안에서 함께하는 실천을 나눕니다.</p>
                    <ul className="space-y-0.5 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>지역사회 활동:</strong> 지역 속 한국어 교육 활동, 봉사</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>다문화 가정 소통:</strong> 다문화 가정과의 경험과 배움</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span><strong>현장 경험 나눔:</strong> 다양한 현장(세종학당, 사회통합 등)의 이야기</span>
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>

              </CollapsibleContent>
            </Collapsible>

          </CollapsibleContent>
        </Collapsible>

        <div className="h-6"></div>

        <Collapsible open={openSections['sidebar']} onOpenChange={() => toggleSection('sidebar')}>
          <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
            <CaretRight 
              size={18} 
              className={`transition-transform ${openSections['sidebar'] ? 'rotate-90' : ''} text-muted-foreground`}
            />
            <h2 className="text-2xl font-semibold">사이드바 구성</h2>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-3 pb-2 space-y-1">

            <Collapsible open={openSections['sidebar-left']} onOpenChange={() => toggleSection('sidebar-left')}>
              <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
                <CaretRight 
                  size={16} 
                  className={`transition-transform ${openSections['sidebar-left'] ? 'rotate-90' : ''} text-muted-foreground`}
                />
                <h3 className="text-xl font-semibold">좌측 사이드바 (고정)</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-2 pb-1">
                <p className="text-sm text-muted-foreground mb-3">정적 정보 및 바로가기</p>
                <div className="bg-muted/30 border border-border rounded-md p-4 text-sm space-y-3 font-mono">
                  <div>
                    <div className="font-semibold mb-1.5">📢 전체 공지</div>
                    <div className="ml-4 space-y-0.5 text-muted-foreground text-xs">
                      <div>• [중요] 저작권 정책 안내</div>
                      <div>• 신규 기능 업데이트</div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="font-semibold mb-1.5">📁 자료실 바로가기</div>
                    <div className="ml-4 space-y-0.5 text-muted-foreground text-xs">
                      <div>• 최근 업로드</div>
                      <div>• 인기 자료</div>
                      <div>• 내 자료함</div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="font-semibold mb-1.5">📅 이번 주 행사</div>
                    <div className="ml-4 space-y-0.5 text-muted-foreground text-xs">
                      <div>• 1/20 문법 워크숍</div>
                      <div>• 1/22 온라인 세미나</div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="font-semibold mb-1.5">🔗 유용한 링크</div>
                    <div className="ml-4 space-y-0.5 text-muted-foreground text-xs">
                      <div>• 국립국어원</div>
                      <div>• 세종학당재단</div>
                      <div>• 관련 학회</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={openSections['sidebar-right']} onOpenChange={() => toggleSection('sidebar-right')}>
              <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
                <CaretRight 
                  size={16} 
                  className={`transition-transform ${openSections['sidebar-right'] ? 'rotate-90' : ''} text-muted-foreground`}
                />
                <h3 className="text-xl font-semibold">우측 사이드바 (동적)</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-2 pb-1">
                <p className="text-sm text-muted-foreground mb-3">실시간 활동 및 인기 콘텐츠</p>
                <div className="bg-muted/30 border border-border rounded-md p-4 text-sm space-y-3 font-mono">
                  <div>
                    <div className="font-semibold mb-1.5">🔥 인기글</div>
                    <div className="ml-4 space-y-0.5 text-muted-foreground text-xs">
                      <div>• 초급 문법 교안 (조회 523)</div>
                      <div>• TOPIK 대비 전략 (조회 412)</div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="font-semibold mb-1.5">💬 최근 활동</div>
                    <div className="ml-4 space-y-0.5 text-muted-foreground text-xs">
                      <div>• 김교사님이 댓글 작성</div>
                      <div>• 이교사님이 자료 업로드</div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3">
                    <div className="font-semibold mb-1.5">👥 활성 모임</div>
                    <div className="ml-4 space-y-0.5 text-muted-foreground text-xs">
                      <div>• 서울 스터디 (15명 온라인)</div>
                      <div>• 문법 연구회 (토론 중)</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

          </CollapsibleContent>
        </Collapsible>

        <div className="h-6"></div>

        <Collapsible open={openSections['groups']} onOpenChange={() => toggleSection('groups')}>
          <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
            <CaretRight 
              size={18} 
              className={`transition-transform ${openSections['groups'] ? 'rotate-90' : ''} text-muted-foreground`}
            />
            <h2 className="text-2xl font-semibold">모임 시스템 (하이브리드)</h2>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-3 pb-2 space-y-3">
            
            <div>
              <h4 className="text-base font-medium mb-2">상단 고정 버튼</h4>
              <p className="text-sm text-muted-foreground mb-2">메인 네비게이션에 통합</p>
              <div className="bg-muted/30 border border-border rounded-md p-3 text-sm font-mono">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">연구</span>
                  <span className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">현장</span>
                  <span className="flex-1 min-w-[40px]"></span>
                  <span className="px-2 py-1 border border-border rounded text-xs">🔍검색</span>
                  <span className="px-2 py-1 border border-border rounded text-xs">👥모임 찾기</span>
                  <span className="px-2 py-1 border border-border rounded text-xs">👤내정보</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium mb-2">모임 찾기 전용 페이지</h4>
              <p className="text-sm text-muted-foreground mb-2">독립된 모임 검색 및 관리 페이지</p>
              <div className="bg-muted/30 border border-border rounded-md p-4 text-sm space-y-3">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded">온라인 모임</span>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded">오프라인 모임</span>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded">내 모임</span>
                </div>
                
                <div className="text-xs space-y-1.5 pt-1">
                  <p className="font-medium">필터:</p>
                  <div className="ml-3 space-y-0.5 text-muted-foreground">
                    <div>□ 주제별: 문법 | 발음 | 문화 | 평가 | 교수법</div>
                    <div>□ 지역별: 서울 | 경기 | 부산 | 대구 | 광주 | 대전 | 기타</div>
                    <div>□ 수준별: 초급 | 중급 | 고급 | 혼합</div>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <div className="bg-background border border-border rounded p-3 space-y-1.5">
                    <div className="font-semibold text-xs">📚 한국어 문법 깊이 읽기</div>
                    <div className="text-xs text-muted-foreground">온라인 | 매주 화 20:00 | 회원 32명</div>
                    <div className="flex gap-1.5 text-xs">
                      <span className="text-muted-foreground">#문법</span>
                      <span className="text-muted-foreground">#연구</span>
                      <span className="text-muted-foreground">#논문읽기</span>
                    </div>
                  </div>
                  <div className="bg-background border border-border rounded p-3 space-y-1.5">
                    <div className="font-semibold text-xs">🌏 서울 다문화 교사 모임</div>
                    <div className="text-xs text-muted-foreground">오프라인 | 월 1회 | 회원 18명</div>
                    <div className="flex gap-1.5 text-xs">
                      <span className="text-muted-foreground">#서울</span>
                      <span className="text-muted-foreground">#다문화</span>
                      <span className="text-muted-foreground">#네트워킹</span>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-xs font-medium cursor-pointer">+ 새 모임 만들기</span>
                </div>
              </div>
            </div>

          </CollapsibleContent>
        </Collapsible>

        <div className="h-6"></div>

        <Collapsible open={openSections['resource']} onOpenChange={() => toggleSection('resource')}>
          <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
            <CaretRight 
              size={18} 
              className={`transition-transform ${openSections['resource'] ? 'rotate-90' : ''} text-muted-foreground`}
            />
            <h2 className="text-2xl font-semibold">자료실 중앙 관리 시스템</h2>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-3 pb-2 space-y-1">

            <Collapsible open={openSections['resource-upload']} onOpenChange={() => toggleSection('resource-upload')}>
              <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
                <CaretRight 
                  size={16} 
                  className={`transition-transform ${openSections['resource-upload'] ? 'rotate-90' : ''} text-muted-foreground`}
                />
                <h3 className="text-xl font-semibold">자료 업로드 프로세스</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-2 pb-1">
                <p className="text-sm text-muted-foreground mb-3">모든 자료는 자료실을 통해 중앙 관리됩니다</p>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                      저작권 확인
                    </div>
                    <div className="ml-7 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 text-xs space-y-2">
                      <p className="font-medium">⚠️ 저작권 확인서</p>
                      <div className="ml-3 space-y-0.5 text-muted-foreground">
                        <div>□ 본인이 직접 제작한 자료입니다</div>
                        <div>□ 인용/참고 자료의 출처를 명시했습니다</div>
                        <div>□ 제3자 저작물 사용 허가를 받았습니다</div>
                      </div>
                      <div className="pt-1">
                        <p className="font-medium mb-1">라이선스 선택:</p>
                        <div className="ml-3 space-y-0.5 text-muted-foreground">
                          <div>○ CC BY (출처 표시)</div>
                          <div>○ CC BY-NC (출처 표시-비영리)</div>
                          <div>○ CC BY-ND (출처 표시-변경금지)</div>
                          <div>○ © 저작권 보호 (무단 사용 금지)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                      자료 분류
                    </div>
                    <div className="ml-7 space-y-1 text-xs">
                      <div>• 카테고리: [교안/활동지/평가/연구/참고]</div>
                      <div>• 수준: [초급/중급/고급/혼합]</div>
                      <div>• 태그: #문법 #말하기 (자유 입력)</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-2 flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                      공개 설정
                    </div>
                    <div className="ml-7 text-xs">
                      <div>○ 전체 공개 ○ 회원 공개 ○ 특정 모임 ○ 비공개</div>
                    </div>
                  </div>

                  <div className="ml-7 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-md p-3 text-xs">
                    <p className="font-medium text-green-700 dark:text-green-400">✅ 업로드 완료</p>
                    <p className="text-green-600 dark:text-green-500 mt-1">자료번호: #MAT2025-0001 생성</p>
                  </div>
                </div>

              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={openSections['resource-link']} onOpenChange={() => toggleSection('resource-link')}>
              <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
                <CaretRight 
                  size={16} 
                  className={`transition-transform ${openSections['resource-link'] ? 'rotate-90' : ''} text-muted-foreground`}
                />
                <h3 className="text-xl font-semibold">다른 게시판에서 자료 연결</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-2 pb-1">
                <p className="text-sm text-muted-foreground mb-3">자료실의 파일을 게시글에 참조하는 방식</p>
                
                <div className="bg-muted/30 border border-border rounded-md p-4 text-xs space-y-3">
                  <div>
                    <p className="font-semibold mb-2">📝 글 작성 (연구/현장 게시판)</p>
                    <div className="ml-3 space-y-1 text-muted-foreground">
                      <div>제목: [____________________]</div>
                      <div>본문: [____________________]</div>
                      <div className="pt-1">
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">📎 자료 첨부</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="bg-background border border-border rounded p-3 space-y-2">
                      <p className="font-semibold">자료실에서 가져오기</p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>🔍 검색:</span>
                        <div className="flex-1 border-b border-dashed"></div>
                      </div>
                      <div>
                        <p className="font-medium mb-1">📂 내 자료:</p>
                        <div className="ml-3 space-y-0.5 text-muted-foreground">
                          <div>• #MAT2025-0001 초급문법교안</div>
                          <div>• #MAT2025-0002 활동지모음</div>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-1">삽입 방식:</p>
                        <div className="ml-3 space-y-0.5 text-muted-foreground">
                          <div>○ 링크 (제목+다운로드)</div>
                          <div>○ 카드 (미리보기+정보)</div>
                          <div>○ 임베드 (문서 뷰어)</div>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <span className="px-2 py-1 bg-primary text-primary-foreground rounded">삽입</span>
                        <span className="px-2 py-1 border border-border rounded">새 자료 업로드 →</span>
                      </div>
                    </div>
                  </div>
                </div>

              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={openSections['resource-track']} onOpenChange={() => toggleSection('resource-track')}>
              <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
                <CaretRight 
                  size={16} 
                  className={`transition-transform ${openSections['resource-track'] ? 'rotate-90' : ''} text-muted-foreground`}
                />
                <h3 className="text-xl font-semibold">자료 추적 대시보드</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-6 pt-2 pb-1">
                <p className="text-sm text-muted-foreground mb-3">내가 올린 자료의 사용 현황 확인</p>
                
                <div className="bg-muted/30 border border-border rounded-md p-4 text-xs space-y-3">
                  <p className="font-semibold">📊 자료 관리 (내 페이지)</p>
                  
                  <div>
                    <p className="font-medium mb-2">내가 올린 자료 (15개)</p>
                    <div className="bg-background border border-border rounded p-3 space-y-1.5">
                      <p className="font-semibold">#MAT2025-0001 초급문법교안</p>
                      <p className="text-muted-foreground">업로드: 2025.01.15</p>
                      <p className="text-muted-foreground">다운로드: 45회 | 인용: 3개 글</p>
                      <div className="flex gap-2 pt-1">
                        <span className="px-2 py-0.5 border border-border rounded">통계 보기</span>
                        <span className="px-2 py-0.5 border border-border rounded">설정 변경</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-1">이 자료를 인용한 글:</p>
                    <div className="ml-3 space-y-0.5 text-muted-foreground">
                      <div>• [연구] 문법 교육 개선 방안</div>
                      <div>• [현장] 초급반 수업 후기</div>
                      <div>• [모임] 1월 스터디 자료</div>
                    </div>
                  </div>
                </div>

              </CollapsibleContent>
            </Collapsible>

          </CollapsibleContent>
        </Collapsible>

        <div className="h-6"></div>

        <Collapsible open={openSections['features']} onOpenChange={() => toggleSection('features')}>
          <CollapsibleTrigger className="flex items-center gap-2 hover:bg-muted/50 -ml-2 pl-2 pr-4 py-1.5 rounded-sm w-full group">
            <CaretRight 
              size={18} 
              className={`transition-transform ${openSections['features'] ? 'rotate-90' : ''} text-muted-foreground`}
            />
            <h2 className="text-2xl font-semibold">주요 특징</h2>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 pt-3 pb-2">
            
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium mb-1.5">✅ 저작권 보호 강화</h4>
                <ul className="ml-5 space-y-0.5 text-muted-foreground">
                  <li>• 모든 자료 업로드 시 저작권 확인 필수</li>
                  <li>• 라이선스 명시 및 추적 시스템</li>
                  <li>• 워터마크 자동 삽입 (PDF)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1.5">✅ 효율적 자료 관리</h4>
                <ul className="ml-5 space-y-0.5 text-muted-foreground">
                  <li>• 자료실 단일 업로드 → 전체 게시판에서 참조</li>
                  <li>• 중복 방지 및 버전 관리</li>
                  <li>• 자료별 고유번호로 추적 가능</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1.5">✅ 사용자 편의성</h4>
                <ul className="ml-5 space-y-0.5 text-muted-foreground">
                  <li>• 직관적인 2개 메인 메뉴 (연구/현장)</li>
                  <li>• 사이드바로 빠른 접근</li>
                  <li>• 모임 찾기 독립 버튼으로 쉬운 참여</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-1.5">✅ 커뮤니티 활성화</h4>
                <ul className="ml-5 space-y-0.5 text-muted-foreground">
                  <li>• 실시간 활동 표시</li>
                  <li>• 인기 콘텐츠 노출</li>
                  <li>• 모임 중심 네트워킹 강화</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="font-medium mb-2">추가 개선 사항</h4>
              <ul className="ml-5 space-y-1 text-sm text-muted-foreground">
                <li>• 누리집 이용 안내 - 사용자를 위한 종합 가이드 제공</li>
                <li>• 모바일 반응형 디자인 - 모든 기기에서 최적화된 경험</li>
                <li>• 서랍창 사이드바 - 모바일에서 좌우 사이드바를 서랍창으로 제공</li>
                <li>• 접근성 향상 - 헤더에 이용 안내 아이콘 버튼 추가</li>
              </ul>
            </div>

          </CollapsibleContent>
        </Collapsible>

      </div>
    </div>
  )
}
