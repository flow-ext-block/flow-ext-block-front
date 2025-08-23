# 파일 확장자 차단 관리 시스템

업로드 시 차단할 파일 확장자를 관리하는 React SPA입니다. 고정 확장자와 커스텀 확장자를 별도로 관리할 수 있습니다.

## 기능

### 고정 확장자 관리
- 사전 정의된 위험한 확장자 목록 (exe, sh, bat, dll 등)
- 개별 확장자별 차단/허용 토글
- 실시간 서버 동기화 (낙관적 업데이트)

### 커스텀 확장자 관리  
- 사용자 정의 확장자 추가/삭제
- 최대 200개 제한
- 중복 방지 및 교차 검증
- 태그 형식의 직관적인 UI

### UX/UI 특징
- 반응형 디자인 (모바일 1열, 데스크탑 2열)
- 로딩 스켈레톤 및 에러 상태 처리
- 토스트 알림으로 사용자 피드백
- 실시간 유효성 검사

## 기술 스택

### Frontend
- **React 18** - 컴포넌트 기반 UI 라이브러리
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **TailwindCSS** - 유틸리티 우선 CSS 프레임워크
- **TanStack Query** - 서버 상태 관리 및 캐싱
- **React Hook Form** - 폼 상태 관리
- **Zod** - 런타임 타입 검증
- **Wouter** - 경량 라우팅

### Backend
- **Express.js** - Node.js 웹 프레임워크
- **TypeScript** - 타입 안전성
- **In-Memory Storage** - 개발용 데이터 저장소

### 개발 도구
- **MSW (Mock Service Worker)** - API 모킹
- **ESLint/Prettier** - 코드 품질 관리

## 설치 및 실행

### 개발 환경
```bash
npm install
npm run dev
