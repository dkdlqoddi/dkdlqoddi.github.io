# Work Report & Pre-Merge Quiz: Architecture Deck Migration

- 날짜: 2026-07-29
- 상태: 기존 발표자료 제거 및 신규 CDS 아키텍처 슬라이드 제작 완료

## 작업 요약 (Implementation Summary)
1. **기존 자료 완전 삭제**: 기존 2개의 발표 자료 디렉토리(`cds-agentic-work`, `cds-agentic-architecture`)를 로컬 시스템에서 완전히 삭제하고, `slides.json` 매니페스트에서 제거했습니다.
2. **시각 자료(SVG) 중심의 신규 슬라이드 덱 구축**: 오피스망-방화벽-VWP망 아키텍처를 순수 CSS와 SVG 벡터 드로잉을 사용하여 텍스트 최소화 및 도식화 위주로 구성했습니다. `slides/cds-secure-architecture/`에 저장되었습니다.
3. **아키텍처 제약사항 및 문제점(Limitations) 시각화 도출**:
   - (1) 제한된 성능의 LLM(CodeMate)으로 인한 잦은 **Hallucination** 및 Harness의 방어 과부하
   - (2) 물리적 방화벽 및 여러 노드(API, MCP)를 경유하는 Agentic Loop의 **지연(Latency)** 증폭 문제
   - (3) VWP망의 방대한 원본 데이터를 그대로 받아올 경우 LLM **컨텍스트 오버플로우(Context Overflow)** 위험
   위 요소들을 붉은색 경고 마커 다이어그램으로 시각화했습니다.

## Pre-Merge Quiz (Blindspot Check)

아래 퀴즈의 정답을 골라주시면 병합 전 검토가 완료되어 깃 푸시(Push)를 진행합니다!

**Q. 본 아키텍처 발표 자료에서 도출한 문제점 중, 성능이 제한적인 사내 모델(CodeMate)이 잘못된 JSON 포맷을 출력하거나 없는 툴을 호출하는 '할루시네이션(Hallucination)'을 막기 위해 방화벽 내부(오피스망)에서 필터링 및 교정 역할을 수행하며 큰 부하를 감당하게 되는 구성 요소는 무엇입니까?**
1) VWP API Server
2) MCP Server
3) Harness (Agent/Shield)
