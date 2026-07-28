# Implementation Notes: Theme & Animation

- 2026-07-28: 시작
- 의사결정: `CLAUDE.md`의 기존 모노크롬 규칙을 완화하여 액센트 컬러(--primary, --secondary)를 허용하기로 결정함. (요구사항 문서에 따라)
- 설계안 대로 `.print-pdf` 이외의 일반 종이 인쇄 시 및 `prefers-reduced-motion` 에서는 엄격한 fallback을 유지해야 함.
