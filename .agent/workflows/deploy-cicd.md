---
description: TechPulse 배포 및 CI/CD 설정 프로세스 (Firebase Hosting + GitHub Actions)
---

이 워크플로우는 TechPulse 프로젝트의 배포 환경을 설정하고 GitHub Actions를 통한 지속적 통합/배포(CI/CD)를 구성합니다.

### 사전 조건
- Firebase 프로젝트가 생성되어 있어야 합니다.
- GitHub 저장소가 생성되어 있고 소스 코드가 푸시되어 있어야 합니다.
- `doc/design/nfr-infra.md` 설계를 참조합니다.

---

## 1단계: Firebase 로컬 초기화

// turbo
### 1-1. Firebase CLI 로그인 및 초기화
- `firebase login` (브라우저 인증)
- `firebase init` 실행 후 아래 항목 선택:
  - `Hosting: Configure files for Firebase Hosting...`
  - `Firestore: Configure security rules and indexes...`
  - `Storage: Configure security rules for Cloud Storage`

### 1-2. 프로젝트 설정
- `Existing Project` 선택 -> 설계된 TechPulse 프로젝트 ID 선택
- `Public directory` -> `dist` (Vite 빌드 결과물)
- `Configure as a single-page app` -> `Yes`
- `Set up automatic builds and deploys with GitHub` -> `No` (수동으로 상세 설정 예정)

---

## 2단계: 보안 규칙 구성

### 2-1. Firestore 규칙 적용
- `doc/design/architecture-lld.md`의 섹션 3 내용을 `firestore.rules` 파일에 복사
- `firebase deploy --only firestore:rules` 실행

### 2-2. Storage 규칙 적용
- `doc/design/architecture-lld.md`의 섹션 5 내용을 `storage.rules` 파일에 복사
- `firebase deploy --only storage:rules` 실행

---

## 3단계: GitHub Actions CI/CD 구성

### 3-1. Firebase Service Account 키 발급
- Google Cloud Console 또는 Firebase Console에서 서비스 계정 키(JSON) 발급
- GitHub 저장소의 `Settings > Secrets and variables > Actions`에 등록:
  - `FIREBASE_SERVICE_ACCOUNT_TECHPULSE`: 서비스 계정 JSON 내용
  - `GITHUB_TOKEN`: 자동 생성됨

### 3-2. 워크플로우 파일 생성
- `.github/workflows/deploy.yml` 파일 생성
- `nfr-infra.md` 섹션 4.2의 YAML 설정 복사 및 프로젝트 ID 수정

---

## 4단계: 배포 테스트

### 4-1. 수동 빌드 및 배포 확인
- `npm run build` 실행
- `firebase deploy --only hosting` 실행
- 제공된 호스팅 URL로 접속하여 앱 동작 확인

### 4-2. CI/CD 자동 배포 확인
- 코드를 `main` 브랜치에 push
- GitHub Actions 탭에서 빌드 및 배포 프로세스 성공 여부 모니터링

---

## 5단계: 환경 확인 및 완료
- 실서버 URL에서 로그인, 프로필, 피드 기능이 정상 작동하는지 최종 확인
- **사용자 확인 후 배포 프로세스 완료.**
