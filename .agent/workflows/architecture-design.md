---
description: 시스템 아키텍처 설계 프로세스 (컨텍스트 수집 -> HLD -> LLD -> 화면설계 -> NFR -> 모듈설계)
---

이 워크플로우는 `architect-guide.md`에 따라 단계별로 시스템 아키텍처를 설계합니다.
PRD(요구사항 명세서)가 완성된 상태에서 시작합니다.

### 사전 조건
- `doc/requirements/` 폴더에 PRD 문서가 존재해야 합니다.
- `doc/design/` 폴더에 산출물을 저장합니다.

---

### 1단계: 컨텍스트 수집 및 검증
- PRD를 분석하여 기술적 맥락이 누락된 부분을 파악합니다.
- 아래 항목 중 PRD에 명시되지 않은 2~3가지를 사용자에게 질문합니다:
  1. 기존 기술 스택 및 제약사항
  2. 예상 트래픽 및 확장성 (DAU/MAU)
  3. 데이터 특성 (보안, 실시간 처리)
  4. 연동 시스템 (서드파티 API)
  5. 개발 일정 및 MVP 범위
- **사용자 답변을 받은 후 다음 단계로 진행합니다.**

---

### 2단계: Phase 1 - 하이레벨 아키텍처 (HLD)
- 시스템 구성 요소 정의 (Client, API Gateway, DB, Cache 등)
- 기술 스택 선정 및 Trade-off 분석
- Mermaid.js 시스템 아키텍처 다이어그램 작성
- 산출물: `doc/design/architecture-hld.md`
- **사용자 확인 후 다음 Phase로 진행합니다.**

---

### 3단계: Phase 2 - 데이터베이스 및 API 스키마 설계 (LLD)
- RDBMS: ERD 모델링 (주요 테이블, 관계)
- NoSQL(Firestore): 컬렉션/도큐먼트 구조, Security Rules
- API 엔드포인트 정의 (REST/GraphQL) 또는 Firebase SDK 쿼리 패턴
- 산출물: `doc/design/architecture-lld.md`
- **사용자 확인 후 다음 Phase로 진행합니다.**

---

### 4단계: Phase 3 - 화면 설계 (UI/UX Design)
- 화면 목록 정의 (고유 ID 부여: `SCR-001` 등)
- 화면별 상세 구성 (레이아웃, UI 요소, 동작 정의)
- 화면 흐름도 (Mermaid.js)
- 공통 컴포넌트 정의
- 반응형 설계 고려사항 (모바일/태블릿/데스크톱)
- 산출물: `doc/design/screen-design.md` (또는 `doc/design/screens/` 폴더)
- **사용자 확인 후 다음 Phase로 진행합니다.**

---

### 5단계: Phase 4 - 비기능적 요구사항 및 인프라 설계
- 보안: 인증/인가, HTTPS, 암호화
- 성능: 캐싱 전략, 로드 밸런싱
- 인프라: CI/CD, 컨테이너화, 배포 전략
- 산출물: `doc/design/nfr-infra.md`
- **사용자 확인 후 다음 Phase로 진행합니다.**

---

### 6단계: Phase 5 - 디렉터리 구조 및 모듈 설계
- 프로젝트 폴더 구조 (트리 형태)
- 주요 모듈/컴포넌트 역할 및 의존성 관계
- 코드 컨벤션 및 네이밍 규칙
- 산출물: `doc/design/module-structure.md`
- **사용자 확인 후 설계 완료.**
