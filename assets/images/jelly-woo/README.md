# jelly-woo

발표에서 공유하는 jelly-woo 캐릭터 이미지입니다. 제공된 캐릭터 시트의 주황색 몸, 검은 후드, 파란 헤드폰, 곱슬 머리를 기준으로 built-in `image_gen`으로 생성했습니다.

- `reference.png`: 제공된 캐릭터 시트 사본.
- `originals/*.png`: 생성된 투명 배경 원본. 재가공용으로 보존합니다.
- `*.webp`: 실제 슬라이드에서 사용하는 512 × 512 투명 이미지.
- `*@2x.webp`: 대형 표지·메시지의 고해상도 화면용 1024 × 1024 이미지. `srcset`으로 선택됩니다.
- `prompts.json`: 포즈별 생성 프롬프트, 대체 텍스트, 파일 경로.

| 파일 | 어울리는 내용 |
|---|---|
| welcome.webp | 인사, 도입 |
| study.webp | 자료 읽기, 학습, 참고문헌 |
| code.webp | 코딩, 설치, 도구 사용, 실습 |
| connect.webp | 연결, 구조, 파이프라인, 협업 |
| review.webp | 원문 대조, 품질 검토, 결과 확인 |
| approve.webp | 담당자의 최종 확인, 계획 승인, 실행 허락 |
| shield.webp | 보안, 권한, 통제, 최종 승인 |
| compare.webp | 선택지·도구·결과 비교 |
| present.webp | 설명, 시각화, 발표 |
| plan.webp | 계획, 완료 기준, 다음 단계 |
| celebrate.webp | 완료, 성과, 마무리 |
| question.webp | 질문, 문제, 퀴즈, 불확실성 |
| travel.webp | 여행, 여정, 방법론 지도 |
| listen.webp | 오디오, 듣기 |
| idea.webp | 아이디어, 활용 가능성, 새로운 접근 |

새 슬라이드는 내용을 보고 포즈와 `data-jelly-layout`을 직접 선택합니다. 공통 `slides/shared/jelly-woo.css`를 덱의 마지막 스타일로 연결합니다. 캐릭터는 반드시 section의 직계 자식으로 둡니다. `cover`·`feature`·`guide`는 **왼쪽 캐릭터 + 오른쪽 본문**이며 본문을 `.jelly-main`으로 감쌉니다. `banner`·`corner`는 **오른쪽 위 캐릭터**이며 넓은 도표를 유지하고 제목의 `jelly-heading`, eyebrow의 `jelly-eyebrow`로 우측 여백을 확보합니다. `slides/sample/index.html`에 실제 구성이 들어 있습니다.

| 배치 | 용도 | 기본 크기 (1280 / 960 캔버스) |
|---|---|---|
| cover | 모든 발표의 첫 장 · 필수 | 480 / 370px |
| feature | 질문·핵심 메시지·실습 시작·마무리 | 340 / 300px |
| guide | 결과 예시·설명·작업 과정 옆 안내 | 210 / 190px |
| banner | 도표 전체 폭을 보존하는 넓은 제목 영역 | 164px |
| corner | 코드·표·고밀도 도표 | 120 / 92px |

읽기 화면은 단일 열에서 큰 캐릭터를 왼쪽, 작은 캐릭터를 오른쪽으로 정렬하고 본문을 그 아래 배치합니다. 발표 화면의 레거시 덱도 700px 고정 캔버스를 사용하여 보조 캐릭터가 장마다 위아래로 움직이지 않습니다. 인쇄도 같은 좌우 배치를 사용하며 표지를 작게 축소하지 않습니다. 이번 157장 검토 결과는 표지 9장, 대형 메시지 21장, 중형 안내 50장, 중형 제목 영역 22장, 소형 도표 55장입니다. 왼쪽 독립 열은 80장, 오른쪽 위 보조 배치는 77장입니다.

현재 15종을 재사용합니다. `review`는 근거를 검토하는 중, `plan`은 계획을 세우는 중, `approve`는 사람이 확인하고 실행을 허락하는 시점에 사용합니다. `celebrate`는 실제 마무리·성과를 나타냅니다. 위치 변경을 위해 이미지를 좌우 반전하면 후드의 코드 기호도 뒤집히므로 원본 방향을 유지합니다.

```html
<section data-jelly-woo="review" data-jelly-layout="guide">
  <img class="jelly-woo" src="../../assets/images/jelly-woo/review.webp"
       width="512" height="512" alt="돋보기로 결과를 검토하는 jelly-woo"
       loading="eager" data-auto-animate-ignore>
  <div class="jelly-main">
    <h2 class="jelly-heading">결과를 확인해요</h2>
    <p>원문과 결과를 나란히 대조하세요.</p>
  </div>
</section>
```

PNG 원본은 웹 페이지에서 로드하지 않습니다. WebP는 원본의 비율과 alpha를 유지해 축소·인코딩한 배포 사본입니다. 프롬프트와 원본을 함께 사용하면 같은 캐릭터로 새 포즈를 확장할 수 있습니다.
