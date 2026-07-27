# dkdlqoddi.github.io — 발표 기록

발표자료를 웹으로 공개하는 GitHub Pages 저장소입니다.
main에 push하면 곧 https://dkdlqoddi.github.io 에 배포됩니다.

## 새 발표자료 추가 (4단계)

1. `slides/sample/`을 복사해 새 폴더를 만듭니다. 폴더 이름은 **영문 소문자와 하이픈만** — 이 이름이 곧 공유 URL입니다 (`https://dkdlqoddi.github.io/slides/<폴더이름>/`). `sample`은 복사용 원본이라 목록에 일부러 넣지 않았습니다. 지우지 마세요.
2. 복사한 `index.html`의 내용을 수정합니다. 테마(`vendor/reveal.js/dist/theme/white.css` ↔ `black.css`)와 전환 효과(`transition: none|fade|slide|convex|concave|zoom`)는 발표마다 자유입니다.
3. 루트의 `slides.json`에 항목을 추가합니다:
   ```json
   { "title": "발표 제목", "date": "2026-08-01", "description": "한 줄 설명", "dir": "<폴더이름>" }
   ```
4. main에 push합니다. 반영까지 몇 분, 방문자 캐시 때문에 목록 갱신은 최대 10분 걸릴 수 있습니다.

## 로컬 미리보기

```bash
python3 -m http.server 8000
# http://localhost:8000
```

발표자료 하나만 열 때는 `slides/<폴더>/index.html`을 브라우저로 직접 열어도 됩니다(오프라인 동작).

## 구조

```
index.html, styles.css, main.js   랜딩(발표 목록)
slides.json                       발표 목록 데이터 — 여기에만 등록하면 랜딩에 반영
slides/<slug>/                    발표자료 (발표당 폴더 1개, reveal.js)
vendor/reveal.js/                 reveal.js 6.0.1 공유 사본 (오프라인 발표 대비, MIT — LICENSE 동봉)
404.html                          잘못된 주소 안내
.nojekyll                         Jekyll 빌드 비활성화 — 삭제 금지
docs/blindspot/                   내부 작업 문서 (사이트 기능 아님)
```

## 주의사항

- **`.nojekyll`을 지우지 마세요.** 지우면 GitHub의 Jekyll 변환기가 reveal.js 파일의 `{{ }}` 문구를 오해해 배포가 실패할 수 있습니다.
- **서브모듈(`.claude/shared`)은 공개 저장소 + HTTPS URL을 유지해야 합니다.** 비공개 전환이나 SSH 주소로 바꾸면 GitHub Pages 배포 전체가 실패합니다.
- reveal.js 버전은 6.0.1로 고정되어 있습니다. 업그레이드는 `vendor/reveal.js/`를 통째로 교체하면 됩니다(모든 발표에 일괄 적용되므로 기존 발표 확인 필요).
- 파일 하나가 100MiB를 넘으면 push가 거부됩니다. 발표 영상은 외부 호스팅(YouTube 등)을 사용하세요.

## 발표자료 만들 때 자주 걸리는 것

`slides/sample/`을 복사하면 아래가 이미 반영되어 있습니다. 처음부터 새로 쓸 때만 직접 챙기면 됩니다.

- **제목의 영문이 전부 대문자로 나옵니다.** 테마 기본값입니다. `text-transform: none`을 제목에 걸어야 `Opencode`가 그대로 보입니다.
- **reveal.js 확장 기능은 하나도 들어 있지 않습니다.** 코드 색칠, 발표자 노트, 마크다운 변환을 부르면 화면이 깨집니다. 순수 HTML로 쓰세요.
- **화면 확대를 막지 마세요.** 인터넷에서 가져온 예제에는 확대 금지 설정이 붙어 있는 경우가 많습니다. 붙여넣을 때 지우세요.
- **바깥에서 파일을 가져오지 마세요.** 웹폰트도 안 됩니다. 한글은 시스템 글꼴로 나오며, 줄바꿈은 `<br>`로 직접 잡습니다.
- **그림을 상자와 선으로 그렸다면** 화면 낭독기용 설명을 함께 넣으세요. 그렇지 않으면 눈으로 보지 않는 사람에게는 빈 칸입니다.
- `docs/blindspot/`의 문서도 인터넷에서 주소로 열립니다. 발표자료에 못 넣을 내용은 그 문서에도 넣지 마세요.
