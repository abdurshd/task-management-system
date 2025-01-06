# 작업 관리 시스템

Next.js 14, TypeScript, shadcn/ui로 구축된 역할 기반 작업 관리 시스템입니다.

## 특징

- 역할 기반 접근 제어 (관리자, PrimeUser, RegularUser, Viewer)
- 이메일을 통한 사용자 인증
- 필터링 및 검색 기능을 갖춘 작업 관리
- 작업 유형에 따른 동적 폼 렌더링
- shadcn/ui 컴포넌트를 사용한 반응형 디자인

## 기술 스택

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand (상태 관리)
- React Hook Form (폼 관리)
- Zod (폼 유효성 검사)

## 설치

1. 저장소 복제:

```bash
git clone https://github.com/abdurshd/task-management-system.git
cd task-management-system
```

2. 의존성 설치:

```bash
npm install
```

3. shadcn/ui 컴포넌트 설치:

```bash
npx shadcn@latest init
```

4. 필요한 shadcn/ui 컴포넌트 추가:

```bash
npx shadcn@latest add button card dialog form input table select toast
```

5. `.env.local` 파일 생성:

```bash
touch .env.local
```

6. 개발 서버 시작:

```bash
npm run dev
```

## 프로젝트 구조

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── dashboard/
│   │   ├── tasks/
│   │   └── users/
│   └── layout.tsx
├── components/
│   ├── auth/
│   ├── tasks/
│   ├── users/
│   └── ui/
├── lib/
│   ├── store/
│   ├── types/
│   ├── utils/
│   └── validations/
└── data/
    ├── task_list.json
    └── user_list.json
```

## 테스트 케이스

### 로그인 페이지

1. **유효하지 않은 이메일 테스트**
   - 로그인 페이지로 이동
   - 존재하지 않는 이메일 입력
   - 오류 메시지가 표시되는지 확인

2. **유효한 로그인 테스트**
   - 존재하는 이메일 입력
   - 성공적으로 로그인되고 올바른 대시보드로 라우팅되는지 확인

3. **필드 유효성 검사 테스트**
   - 이메일 필드를 비워둠
   - 로그인 버튼이 비활성화 상태인지 확인

4. **역할 기반 렌더링 테스트**
   - 관리자 계정으로 로그인
   - 관리자 대시보드가 표시되는지 확인

### 사용자 목록 페이지

1. **역할 필터 테스트**
   - 관리자 계정으로 로그인
   - PrimeUser 필터 적용
   - 필터링된 결과가 올바르게 표시되는지 확인

2. **동적 옵션 테스트**
   - 드롭다운에 사용자가 있는 역할만 표시되는지 확인

3. **사용자 검색 테스트**
   - 특정 사용자 검색
   - 검색 결과가 올바르게 표시되는지 확인

4. **접근 제어 테스트**
   - RegularUser로 로그인
   - 제한된 뷰 접근만 가능한지 확인

### 작업 목록 페이지

1. **작업 필터 테스트**
   - 상태 필터 적용
   - 필터링된 작업이 올바르게 표시되는지 확인

2. **역할 기반 가시성 테스트**
   - Viewer로 로그인
   - 할당된 작업만 표시되는지 확인

3. **작업 검색 테스트**
   - 특정 작업 검색
   - 검색 결과가 올바르게 표시되는지 확인

4. **작업 생성 버튼 테스트**
   - 역할에 따라 버튼 가시성이 올바른지 확인

### 작업 생성

1. **역할 기반 접근 테스트**
   - 역할에 따라 폼 접근 가능 여부 확인

2. **필드 유효성 검사 테스트**
   - 빈 필드로 폼 제출
   - 유효성 검사 동작 확인

3. **동적 필드 테스트**
   - 다른 작업 유형 선택
   - 폼 필드가 올바르게 업데이트되는지 확인

4. **할당 대상 역할 확인 테스트**
   - 역할에 따라 올바른 할당 대상 옵션 표시 여부 확인

## 테스트 실행 방법

1. Cypress와 같은 E2E 테스트 도구를 설치합니다:

```bash
npm install cypress
```

2. Cypress를 실행하여 테스트를 시작합니다:

```bash
npx cypress open
```

3. Cypress UI에서 원하는 테스트 파일을 선택하여 실행합니다.

4. 모든 테스트 케이스가 성공적으로 실행되는지 확인합니다.

## API 경로

응용 프로그램은 데이터를 처리하기 위해 Next.js API 경로를 사용합니다:

- `/api/auth/login` - 사용자 인증 처리
- `/api/users` - 사용자 관리
- `/api/tasks` - 작업 관리

## 상태 관리

Zustand를 사용하여 다음과 같은 상태 저장소를 관리합니다:

- **AuthStore**: 사용자 인증 및 역할 관리
- **TaskStore**: 작업 목록 및 작업 관리
- **UserStore**: 사용자 목록 및 사용자 관리

