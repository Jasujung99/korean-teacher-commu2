import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'

export function TermsOfService() {
  const lastUpdated = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">회원 약관</h1>
        <p className="text-base md:text-lg text-muted-foreground">
          한국어 교사 동행 플랫폼 이용 약관
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <Badge variant="outline">버전 1.0</Badge>
          <Badge variant="secondary">{lastUpdated}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제1조 (목적)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            본 약관은 한국어 교사 동행(이하 "플랫폼")이 제공하는 온라인 커뮤니티 서비스의 이용과 관련하여 
            플랫폼과 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제2조 (정의)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>
              <span className="font-medium">"플랫폼"</span>이란 한국어 교사들이 연구와 현장 경험을 공유하는 
              온라인 커뮤니티 서비스를 말합니다.
            </li>
            <li>
              <span className="font-medium">"회원"</span>이란 본 약관에 동의하고 플랫폼에 가입하여 
              서비스를 이용하는 모든 사용자를 말합니다.
            </li>
            <li>
              <span className="font-medium">"게시물"</span>이란 회원이 플랫폼에 게시한 글, 사진, 파일, 
              댓글 등 모든 형태의 정보를 말합니다.
            </li>
            <li>
              <span className="font-medium">"자료실"</span>이란 회원이 교육 자료를 업로드하고 공유하는 
              중앙 저장소를 말합니다.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제3조 (회원 가입)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>회원 가입은 이용 신청자가 본 약관에 동의한 후 가입 신청을 하고, 플랫폼이 이를 승인함으로써 완료됩니다.</li>
            <li>플랫폼은 다음 각 호에 해당하는 가입 신청에 대하여는 승인을 거부할 수 있습니다:
              <ul className="ml-6 mt-2 space-y-1 text-muted-foreground">
                <li>• 실명이 아니거나 타인의 정보를 도용한 경우</li>
                <li>• 가입 신청 시 허위 내용을 기재한 경우</li>
                <li>• 이전에 회원 자격을 상실한 적이 있는 경우</li>
                <li>• 기타 플랫폼이 정한 이용 조건에 부합하지 않는 경우</li>
              </ul>
            </li>
            <li>회원은 가입 시 제공한 정보가 변경된 경우 즉시 수정해야 합니다.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제4조 (회원의 의무)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p className="font-medium">회원은 다음 각 호의 행위를 하여서는 안 됩니다:</p>
          <ol className="space-y-2 list-decimal list-inside">
            <li>타인의 정보 도용 또는 허위 정보 등록</li>
            <li>플랫폼에 게시된 정보의 무단 변경</li>
            <li>플랫폼이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 송신 또는 게시</li>
            <li>플랫폼 및 제3자의 저작권, 지적재산권 등의 권리 침해</li>
            <li>타인의 명예를 손상시키거나 불이익을 주는 행위</li>
            <li>음란물, 폭력적 메시지, 기타 공서양속에 반하는 정보의 공개 또는 게시</li>
            <li>플랫폼의 동의 없이 영리를 목적으로 서비스를 사용하는 행위</li>
            <li>기타 불법적이거나 부당한 행위</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제5조 (저작권 및 지적재산권)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>플랫폼이 작성한 저작물에 대한 저작권 및 기타 지적재산권은 플랫폼에 귀속됩니다.</li>
            <li>회원이 플랫폼에 게시한 게시물의 저작권은 회원 본인에게 있으며, 
            플랫폼은 서비스 제공을 위해 필요한 범위 내에서 이를 사용할 수 있습니다.</li>
            <li>회원은 자료실에 자료를 업로드할 때 반드시 저작권을 확인하고 적절한 라이선스를 선택해야 합니다.</li>
            <li>회원은 다운로드한 자료를 사용할 때 반드시 출처를 명시하고 해당 라이선스를 준수해야 합니다.</li>
            <li>저작권 침해가 발견될 경우 플랫폼은 해당 게시물을 삭제하고 회원 자격을 제한할 수 있습니다.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제6조 (게시물 관리)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>플랫폼은 회원이 게시하거나 전달하는 내용물이 다음 각 호에 해당한다고 판단되는 경우 
            사전 통지 없이 삭제할 수 있으며, 이에 대해 플랫폼은 어떠한 책임도 지지 않습니다:
              <ul className="ml-6 mt-2 space-y-1 text-muted-foreground">
                <li>• 본 약관에 위배되거나 상용 또는 불법적인 내용</li>
                <li>• 제3자의 저작권 등 기타 권리를 침해하는 내용</li>
                <li>• 공서양속에 위반되는 내용</li>
                <li>• 범죄적 행위에 결부된다고 인정되는 내용</li>
                <li>• 플랫폼의 운영에 지장을 주는 내용</li>
              </ul>
            </li>
            <li>회원은 자신이 게시한 게시물의 관리 책임이 있으며, 
            타인의 신고나 플랫폼의 삭제 조치에 대해 이의가 있을 경우 소명할 수 있습니다.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제7조 (개인정보 보호)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>플랫폼은 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.</li>
            <li>개인정보의 보호 및 사용에 대해서는 관련 법령 및 플랫폼의 개인정보처리방침이 적용됩니다.</li>
            <li>플랫폼은 회원의 귀책사유로 인해 노출된 개인정보에 대해서는 책임을 지지 않습니다.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제8조 (서비스의 변경 및 중단)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>플랫폼은 운영상, 기술상의 필요에 따라 제공하는 서비스를 변경할 수 있으며, 
            변경 전에 해당 내용을 플랫폼 내에 공지합니다.</li>
            <li>플랫폼은 다음 각 호의 경우 서비스 제공을 일시적으로 중단할 수 있습니다:
              <ul className="ml-6 mt-2 space-y-1 text-muted-foreground">
                <li>• 시스템 정기 점검, 서버의 증설 및 교체</li>
                <li>• 서비스 설비의 장애 또는 서비스 이용의 폭주</li>
                <li>• 기타 불가항력적 사유</li>
              </ul>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제9조 (면책 조항)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>플랫폼은 천재지변, 전쟁, 기타 이에 준하는 불가항력으로 인하여 
            서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.</li>
            <li>플랫폼은 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.</li>
            <li>플랫폼은 회원이 게시 또는 전송한 자료의 내용에 대하여 책임을 지지 않습니다.</li>
            <li>플랫폼은 회원 상호간 또는 회원과 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 
            개입할 의무가 없으며 이로 인한 손해를 배상할 책임도 없습니다.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제10조 (회원 탈퇴 및 자격 상실)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>회원은 언제든지 탈퇴를 요청할 수 있으며, 플랫폼은 즉시 회원 탈퇴를 처리합니다.</li>
            <li>회원이 다음 각 호의 사유에 해당하는 경우, 플랫폼은 회원 자격을 제한 또는 정지시킬 수 있습니다:
              <ul className="ml-6 mt-2 space-y-1 text-muted-foreground">
                <li>• 가입 신청 시 허위 내용을 등록한 경우</li>
                <li>• 다른 회원의 서비스 이용을 방해하거나 정보를 도용한 경우</li>
                <li>• 플랫폼을 이용하여 법령과 본 약관이 금지하는 행위를 한 경우</li>
                <li>• 플랫폼의 운영을 고의로 방해한 경우</li>
              </ul>
            </li>
            <li>탈퇴 또는 자격 상실 후에도 회원이 게시한 게시물은 삭제되지 않으며, 
            삭제를 원하는 경우 탈퇴 전에 직접 삭제해야 합니다.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제11조 (약관의 개정)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>플랫폼은 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
            <li>약관이 개정되는 경우 플랫폼은 개정 내용과 적용 일자를 명시하여 
            적용 일자 7일 전부터 플랫폼 내에 공지합니다.</li>
            <li>회원이 개정 약관의 적용에 동의하지 않는 경우 회원 탈퇴를 요청할 수 있습니다.</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">제12조 (분쟁 해결)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <ol className="space-y-2 list-decimal list-inside">
            <li>플랫폼과 회원 간 발생한 분쟁에 관한 소송은 대한민국 법을 준거법으로 합니다.</li>
            <li>플랫폼과 회원 간 제기된 소송은 민사소송법상의 관할법원에 제기합니다.</li>
          </ol>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">부칙</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            <span className="font-medium">시행일:</span> 본 약관은 {lastUpdated}부터 시행됩니다.
          </p>
          <p className="text-muted-foreground text-xs">
            본 약관에 명시되지 않은 사항은 관련 법령 및 플랫폼의 운영 정책에 따릅니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
