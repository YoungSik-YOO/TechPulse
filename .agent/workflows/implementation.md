---
description: TechPulse 기능 단위 단계적 구현 프로세스 (프로젝트 초기화 -> 인증 -> CRUD -> UI 레이아웃 -> 기능 확장)
---

이 워크플로우는 TechPulse SNS 프로젝트를 기능 단위로 단계적으로 구현합니다.
구현 순서: **인증 → 데이터 CRUD → UI 레이아웃 → 기능(모듈) 단위 확장**

### 사전 조건
- `doc/design/` 폴더에 아키텍처 설계 문서가 완성되어 있어야 합니다.
  - `architecture-hld.md` (기술 스택, 아키텍처)
  - `architecture-lld.md` (Firestore 스키마, Security Rules, 쿼리 패턴)
  - `screen-design.md` + `screens/` (화면 설계)
  - `nfr-infra.md` (보안, 성능, CI/CD)
  - `module-structure.md` (디렉터리 구조, 모듈 설계, 코드 컨벤션)
- 각 단계의 구현 전 해당 설계 문서를 반드시 참조합니다.
- **각 단계 완료 후 사용자 확인을 받고 다음 단계로 진행합니다.**

### 참조 문서
- 요구사항 명세: `doc/requirements/` (PRD-*.md)
- 디렉터리 구조: `doc/design/module-structure.md`
- DB 스키마: `doc/design/architecture-lld.md`
- 화면 상세: `doc/design/screens/SCR-XXX-*.md`
- 코드 컨벤션: `doc/design/module-structure.md` (섹션 5)

---

## Phase 0: 프로젝트 초기화

### 0-1. React + Vite 프로젝트 생성
// turbo
- `npx -y create-vite@latest ./ --template react` 실행
// turbo
- `npm install` 실행

### 0-2. 핵심 의존성 설치
- Firebase SDK, React Router, Zustand, 마크다운 관련 패키지 설치
- 패키지 목록은 `module-structure.md` 섹션 6 참조
```
npm install firebase react-router-dom zustand react-markdown remark-gfm react-syntax-highlighter dompurify
```

### 0-3. 프로젝트 구조 세팅
- `module-structure.md` 섹션 1의 디렉터리 구조에 맞게 폴더 생성
- 필수 폴더: `src/components/`, `src/pages/`, `src/hooks/`, `src/services/`, `src/store/`, `src/utils/`, `src/router/`, `src/styles/`

### 0-4. Firebase 프로젝트 연결
- `src/services/firebase.js` 생성: Firebase 앱 초기화, Auth/Firestore/Storage 인스턴스 export
- `.env` 파일에 Firebase config 설정 (API Key, Project ID 등)
- `.env.example` 템플릿 생성

### 0-5. 글로벌 스타일 및 디자인 시스템
- `src/styles/variables.css`: CSS Custom Properties (색상, 폰트, 스페이싱, 브레이크포인트)
- `src/styles/global.css`: CSS 리셋, 기본 타이포그래피

### 0-6. 라우터 기본 구조
- `src/router/AppRouter.jsx`: React Router 기본 설정 (빈 라우트)
- `src/router/ProtectedRoute.jsx`: 인증 가드 (임시 플레이스홀더)
- `src/App.jsx`: AppRouter 연결
- **사용자 확인 후 다음 단계로 진행합니다.**

---

## Phase 1: 인증 (Authentication)

> 참조: `architecture-lld.md` 섹션 3 (Security Rules), `screens/SCR-001-로그인.md`, `screens/SCR-002-회원가입.md`

### 1-1. 인증 서비스 계층
- `src/services/authService.js` 구현
  - `signUpWithEmail(email, password)` — Firebase Auth 이메일 회원가입
  - `signInWithEmail(email, password)` — Firebase Auth 이메일 로그인
  - `signInWithGoogle()` — Google OAuth 로그인
  - `signInWithGithub()` — GitHub OAuth 로그인
  - `signOut()` — 로그아웃
  - `onAuthStateChange(callback)` — 인증 상태 리스너

### 1-2. 인증 상태 관리
- `src/store/authStore.js` 구현 (Zustand)
  - `user`, `isLoggedIn`, `loading` 상태
  - `setUser`, `clearUser` 액션
- `src/hooks/useAuth.js` 구현
  - `onAuthStateChanged` 리스너 연결
  - 로그인/로그아웃/회원가입 함수 래핑

### 1-3. 인증 가드
- `src/router/ProtectedRoute.jsx` 완성
  - 비로그인 시 `/login`으로 리다이렉트
  - 로딩 상태 처리 (LoadingSpinner)

### 1-4. 로그인 화면 (SCR-001)
- `src/pages/auth/LoginPage.jsx` + CSS 모듈
  - 이메일/비밀번호 입력 폼
  - Google/GitHub 소셜 로그인 버튼
  - 에러 메시지 표시
  - 회원가입 페이지 링크

### 1-5. 회원가입 화면 (SCR-002)
- `src/pages/auth/SignupPage.jsx` + CSS 모듈
  - 이메일/비밀번호/비밀번호확인 폼
  - 입력값 유효성 검증 (`src/utils/validators.js`)
  - 소셜 가입 버튼
  - 로그인 페이지 링크

### 1-6. 검증
- 이메일 회원가입 → 로그인 → 로그아웃 흐름 테스트
- Google/GitHub 소셜 로그인 테스트
- 비로그인 상태에서 보호 라우트 접근 시 리다이렉트 확인
- **사용자 확인 후 다음 단계로 진행합니다.**

---

## Phase 2: 사용자 프로필 CRUD

> 참조: `architecture-lld.md` 섹션 2.1 (users 스키마), `screens/SCR-003-프로필설정.md`, `screens/SCR-004-프로필조회.md`

### 2-1. 사용자 서비스 계층
- `src/services/userService.js` 구현
  - `createUserProfile(userId, data)` — 회원가입 후 프로필 생성
  - `getUserProfile(userId)` — 프로필 조회
  - `updateUserProfile(userId, data)` — 프로필 수정
  - `checkDisplayNameDuplicate(name)` — 닉네임 중복 확인

### 2-2. 스토리지 서비스
- `src/services/storageService.js` 구현
  - `uploadProfileImage(userId, file)` — 프로필 이미지 업로드
  - `getDownloadUrl(path)` — 다운로드 URL 조회
  - `deleteFile(path)` — 파일 삭제

### 2-3. 프로필 설정 화면 (SCR-003)
- `src/pages/profile/ProfileEditPage.jsx` + CSS 모듈
  - 프로필 이미지 업로드 (MediaUploader 컴포넌트)
  - 닉네임, 자기소개, 관심분야 태그, 기술스택, 경력, 링크, 지역 입력
  - 회원가입 직후 자동 이동 (최초 설정)
  - 저장 → Firestore 업데이트

### 2-4. 프로필 조회 화면 (SCR-004)
- `src/pages/profile/ProfilePage.jsx` + CSS 모듈
  - 프로필 정보 표시 (UserProfileCard 컴포넌트)
  - 본인 프로필일 경우 "편집" 버튼 표시
  - 해당 사용자의 게시물 목록 (Phase 3에서 연동)

### 2-5. 검증
- 회원가입 → 프로필 설정 → 프로필 조회 흐름 테스트
- 프로필 이미지 업로드 테스트
- 닉네임 중복 확인 테스트
- **사용자 확인 후 다음 단계로 진행합니다.**

---

## Phase 3: 게시물 CRUD

> 참조: `architecture-lld.md` 섹션 2.2 (posts 스키마), `screens/SCR-006-게시물작성.md`, `screens/SCR-007-게시물상세.md`

### 3-1. 게시물 서비스 계층
- `src/services/postService.js` 구현
  - `createPost(postData)` — 게시물 생성
  - `getPost(postId)` — 게시물 단건 조회
  - `updatePost(postId, data)` — 게시물 수정
  - `deletePost(postId)` — 게시물 삭제
  - `getPostsQuery(lastDoc, pageSize)` — 피드 쿼리 (페이지네이션)
  - `subscribePosts(callback, pageSize)` — 실시간 리스너
  - `getPostsByHashtag(tag, lastDoc)` — 해시태그 검색
  - `getPostsByUser(userId, lastDoc)` — 사용자별 게시물

### 3-2. 댓글 서비스 계층
- `src/services/commentService.js` 구현
  - `addComment(postId, commentData)` — 댓글 작성
  - `getComments(postId)` — 댓글 목록 조회
  - `deleteComment(postId, commentId)` — 댓글 삭제

### 3-3. 커스텀 훅
- `src/hooks/usePosts.js` — 게시물 실시간 구독, 무한 스크롤
- `src/hooks/useComments.js` — 댓글 CRUD
- `src/hooks/useInfiniteQuery.js` — 범용 무한 스크롤 훅
- `src/hooks/useMediaUpload.js` — 미디어 업로드 상태 관리

### 3-4. 공통 컴포넌트
- `src/components/post/MarkdownRenderer.jsx` — react-markdown + remark-gfm + 코드 하이라이팅
- `src/components/post/PostCard.jsx` — 게시물 카드 (피드용)
- `src/components/post/CommentItem.jsx` — 댓글 항목
- `src/components/common/TagChip.jsx` — 해시태그/태그 칩
- `src/components/media/MediaUploader.jsx` — 이미지/동영상 업로드
- `src/components/common/InfiniteScroll.jsx` — 무한 스크롤 래퍼

### 3-5. 게시물 작성 모달 (SCR-006)
- `src/pages/feed/CreatePostModal.jsx`
  - 마크다운 텍스트 입력 + 미리보기 토글
  - 이미지/동영상 첨부 (Storage 업로드)
  - 코드 블록 삽입 (언어 선택)
  - 해시태그 입력

### 3-6. 게시물 상세 화면 (SCR-007)
- `src/pages/feed/PostDetailPage.jsx`
  - 게시물 전체 내용 렌더링 (MarkdownRenderer)
  - 미디어 표시 (이미지 확대, 동영상 재생)
  - 댓글 목록 + 댓글 입력

### 3-7. 검증
- 게시물 작성(텍스트/코드/이미지) → 피드 표시 → 상세 → 수정 → 삭제 흐름
- 마크다운 렌더링 + 코드 하이라이팅 확인
- 댓글 작성/삭제 테스트
- **사용자 확인 후 다음 단계로 진행합니다.**

---

## Phase 4: UI 레이아웃 및 메인 피드

> 참조: `screens/SCR-005-메인피드.md`, `module-structure.md` (반응형 설계)

### 4-1. 레이아웃 컴포넌트
- `src/components/layout/MainLayout.jsx` — 3컬럼(데스크톱) / 1컬럼(모바일) 반응형
- `src/components/layout/TopNavBar.jsx` — 로고, 검색, 알림, 프로필 아이콘
- `src/components/layout/BottomNavBar.jsx` — 모바일 하단 네비게이션
- `src/components/layout/SideNav.jsx` — 데스크톱 좌측 네비게이션

### 4-2. 메인 피드 화면 (SCR-005)
- `src/pages/feed/FeedPage.jsx` + CSS 모듈
  - 실시간 피드 (onSnapshot)
  - 무한 스크롤
  - FAB 게시물 작성 버튼
  - 피드/그룹/내그룹 탭 바

### 4-3. 공통 UI 컴포넌트
- `src/components/common/LoadingSpinner.jsx` — 로딩 인디케이터
- `src/components/common/EmptyState.jsx` — 데이터 없을 때 안내
- `src/components/common/Modal.jsx` — 모달 오버레이

### 4-4. 프로필 페이지 연동
- SCR-004 프로필 조회 화면에 해당 사용자의 게시물 목록 연동 (Phase 3의 postService 활용)

### 4-5. 유틸리티
- `src/utils/formatDate.js` — 날짜/시간 포맷 (1분 전, 2시간 전 등)
- `src/utils/constants.js` — 관심분야 태그, 지역 목록 상수
- `src/utils/sanitize.js` — DOMPurify 마크다운 살균

### 4-6. 검증
- 반응형 레이아웃 테스트 (모바일/태블릿/데스크톱)
- 피드 실시간 업데이트 확인
- 네비게이션 동작 확인 (라우트 이동, 탭 전환)
- **사용자 확인 후 다음 단계로 진행합니다.**

---

## Phase 5: 그룹/커뮤니티 기능

> 참조: `architecture-lld.md` 섹션 2.3 (groups 스키마), `screens/SCR-008~010-*.md`

### 5-1. 그룹 서비스 계층
- `src/services/groupService.js` 구현
  - `createGroup(groupData)` — 그룹 생성
  - `getGroup(groupId)` — 그룹 조회
  - `updateGroup(groupId, data)` — 그룹 수정
  - `deleteGroup(groupId)` — 그룹 삭제
  - `getPublicGroups(filters, lastDoc)` — 공개 그룹 목록 (필터링)
  - `joinGroup(groupId, userId, memberData)` — 멤버 가입
  - `leaveGroup(groupId, userId)` — 멤버 탈퇴
  - `getGroupMembers(groupId)` — 멤버 목록
  - `getGroupPosts(groupId, lastDoc)` — 그룹 게시물
  - `createGroupPost(groupId, postData)` — 그룹 게시물 작성
  - `getUserJoinedGroups(userId)` — 내 가입 그룹

### 5-2. 커스텀 훅
- `src/hooks/useGroups.js` — 그룹 CRUD + 멤버십 관리

### 5-3. 그룹 컴포넌트
- `src/components/group/GroupCard.jsx` — 그룹 카드

### 5-4. 그룹 탐색 화면 (SCR-008)
- `src/pages/group/GroupListPage.jsx`
  - 공개 그룹 목록 (필터: 전체/관심분야/지역)
  - 그룹 생성 버튼
  - 가입하기 버튼

### 5-5. 그룹 상세 화면 (SCR-009)
- `src/pages/group/GroupDetailPage.jsx`
  - 그룹 정보 헤더
  - 게시물/멤버 탭
  - 그룹 전용 게시물 피드
  - 가입/탈퇴 토글

### 5-6. 그룹 생성 화면 (SCR-010)
- `src/pages/group/GroupCreatePage.jsx`
  - 그룹 이미지, 이름, 설명, 카테고리, 태그, 공개설정 입력

### 5-7. 피드 탭 연동
- FeedPage의 "그룹" 탭 → GroupListPage 연결
- FeedPage의 "내 그룹" 탭 → 가입한 그룹 목록 표시

### 5-8. 검증
- 그룹 생성 → 가입 → 그룹 게시물 작성 → 탈퇴 흐름 테스트
- 카테고리/지역 필터 테스트
- 비멤버의 비공개 그룹 접근 차단 확인
- **사용자 확인 후 다음 단계로 진행합니다.**

---

## Phase 6+: 점진적 기능 확장 (필요 시)

아래 기능은 MVP 완성 후 우선순위에 따라 하나씩 추가합니다.
각 기능 확장도 동일한 패턴(서비스 → 훅 → 컴포넌트 → 페이지 → 검증)을 따릅니다.

### 6-1. 소셜 기능 확장
- 좋아요 (like) — Firestore 트랜잭션으로 likeCount 증가/감소
- 북마크 (bookmark) — users 서브컬렉션 `bookmarks/`
- 리포스트 (repost) — posts 컬렉션에 repost 타입 문서 생성

### 6-2. 팔로우/팔로잉
- users 서브컬렉션 `following/`, `followers/`
- 팔로잉 피드 (내가 팔로우한 사람의 게시물만)

### 6-3. 검색 기능
- Firestore 쿼리 기반 검색 (해시태그, 사용자, 그룹)
- SCR-011 검색 결과 화면 구현

### 6-4. 알림 기능
- Firestore `notifications/` 컬렉션
- SCR-014 알림 목록 화면 구현

### 6-5. 다이렉트 메시지
- Firestore `conversations/`, `messages/` 컬렉션
- 실시간 채팅 (onSnapshot)
- SCR-012, SCR-013 구현
