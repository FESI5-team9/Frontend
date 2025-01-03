# 🍀 같이 달램

## 목차

#### 1. [프로젝트 소개](#intro)

#### 2. [팀원 소개](#role)

#### 3. [기술 스택 및 개발 환경](#tech)

#### 4. [아키텍처](#architecture) (추가예정)

#### 5. [주요 기능](#feature)

#### 6. [화면 구성](#screen) (추가예정)

#### 8. [Git Branch 전략](#branch)

#### 9. [폴더 구조](#directory) (추가예정)

<br>
<br>

## <span id="intro">1. 프로젝트 소개</span>

혼밥이 대중화 된 시대지만 때론 왁자지껄하게 같이 밥 한끼 먹고 싶은 사람들을 위한 서비스이며<br>
다양한 모임을 탐색하고 참여하며 직접 모임을 개설하고 리뷰를 생성할 수 있는 서비스입니다.

<p align="center">
  <img width="100%" alt="M&M 소개 콘텐츠 이미지" src="public/images/mainpage/ex-images/muckit.svg">
</p>

<br>

### 서비스 바로가기

#### [🔗 배포 링크](https://muckitlist.vercel.app/)

#### 테스트 계정

```
ID: test@gmail.com
PW: 123123123
```

<br>

### 개발 기간

#### 2024.11.25 - 2024.01.06

| 주차  | 프론트엔드                                                     | 백엔드                                    | 디자이너                                                                  |
| ----- | -------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------- |
| 1주차 | - 요구사항 분석<br>- 프로젝트 초기 세팅<br>- 와이어프레임 검토 | - API 설계<br>- 데이터베이스 설계         | - 와이어프레임 제작<br>- 와이어프레임 피드백 반영<br>- 디자인 시스템 논의 |
| 2주차 | - 디자인 검토 및 반영<br>- API 검토                            | - 개발 환경 구축<br>- API 엔드포인트 개발 | - UI 디자인 상세화<br>- 디자인 피드백 반영                                |
| 3주차 | - 주요 기능 개발<br>- 반응형 디자인 적용                       | - API 피드백 반영<br>- 서버 배포          | - 프로토타입 제작<br>- 디자인 QA                                          |
| 4주차 | - 추가 기능 개발<br>- 유저 피드백 수집                         | - 유저 피드백 수집                        | - 최종 디자인 검토<br>- 유저 피드백 수집                                  |
| 5주차 | - 리팩토링 및 최적화<br>- 테스트 코드 작성                     | - 보안 검토 및 성능 테스트                | - 유저 피드백 반영하여 수정<br>- 사용자 경험 개선                         |
| 6주차 | - 최종 코드 정리                                               | - 최종 검토                               | - 최종 검토                                                               |

<br>

### 시작 가이드

```
$ git clone https://github.com/FESI5-team9/Frontend.git
$ cd frontend
$ npm install
$ npm dev
```

<br>
<br>

## <span id='role'>2. 팀원 소개</span>

## Front-End

| <img src="https://avatars.githubusercontent.com/u/162934516?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/103623717?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/161469315?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/147421540?v=4" width="150" height="150"/> |
| :-----------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
|                                           주강산                                            |                                           손유경                                            |                                           오조환                                            |                                           신민호                                            |
|               RiverMountain<br/>[@JooKangSan](https://github.com/JooKangsan)                |                         YS<br/>[@ys9494](https://github.com/ko9612)                         |                    ohjohwan<br/>[@ohjohwan](https://github.com/ohjohwan)                    |                minho shin<br/>[@minhoshin11](https://github.com/minhoshin11)                |

---

## Back-End & Designer

| <img src="https://avatars.githubusercontent.com/u/57103133?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/77622755?v=4" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/161469315?v=4" width="150" height="150"/> |
| :----------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------: |
|                                           김진수                                           |                                           이예진                                           |                                           김세영                                            |
|                   Jin Soo Kim <br/>[@ckaanf](https://github.com/ckaanf)                    |                  Yejin Lee<br/>[@KorYejinLee](https://github.com/ko9612)                   |              Kim Seyoung<br/>[@Kim Seyoung](https://www.behance.net/lienifie)               |

<br />

<br>
<br>

## <span id='tech'>3. 기술 스택 및 개발 환경</span>

### Tech Stack

| **분류**                                      | **도구 및 스택**                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **개발 환경 (Environment)**                   | <div style="border-left:2px solid white;padding-left:10px;">![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white) ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)</div> |
| **패키지 관리 (Package Manager)**             | <div style="border-left:2px solid white;padding-left:10px;">![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)</div>                                                                                                                                                                                                                                                         |
| **프레임워크 및 언어 (Framework & Language)** | <div style="border-left:2px solid white;padding-left:10px;">![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)</div> |
| **상태 관리 및 데이터 (State & Data)**        | <div style="border-left:2px solid white;padding-left:10px;">![React Query](https://img.shields.io/badge/react_query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white) ![Zustand](https://img.shields.io/badge/zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)</div>                                                                                                                         |
| **폼 관리 및 검증 (Form & Validation)**       | <div style="border-left:2px solid white;padding-left:10px;">![React Hook Form](https://img.shields.io/badge/react_hook_form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)</div>                                                                                                                         |
| **애니메이션 (Animation)**                    | <div style="border-left:2px solid white;padding-left:10px;">![Framer Motion](https://img.shields.io/badge/framer_motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)</div>                                                                                                                                                                                                                                  |
| **테스트 (Testing)**                          | <div style="border-left:2px solid white;padding-left:10px;">![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white) ![Cypress](https://img.shields.io/badge/Cypress-69D3A7?style=for-the-badge&logo=Cypress&logoColor=white) ![React Testing Library](https://img.shields.io/badge/testing_library-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white)</div>       |
| **코드 품질 (Code Quality)**                  | <div style="border-left:2px solid white;padding-left:10px;">![Husky](https://img.shields.io/badge/Husky-000000?style=for-the-badge&logo=Husky&logoColor=white) ![Prettier](https://img.shields.io/badge/prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)</div>                                 |
| **배포 (Deploy)**                             | <div style="border-left:2px solid white;padding-left:10px;">![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white)</div>                                                                                                                                                                                                                                                |
| **커뮤니케이션 (Communication)**              | <div style="border-left:2px solid white;padding-left:10px;">![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=Discord&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-white?style=for-the-badge&logo=Notion&logoColor=black) ![Jira](https://img.shields.io/badge/Jira-black?style=for-the-badge&logo=Jira&logoColor=0052CC)</div>                                        |

<br>

<details>
  <summary><h3>기술적 의사결정</h3></summary>

#### Frontend

- Next.js (React Framework)
  - Next.js는 SEO 최적화와 빠른 성능을 위해 SSR과 SSG를 지원하는 React 기반 풀스택 프레임워크로, 프로젝트 확장성과 사용자 경험을 극대화하기 위해 선택했습니다.
- TypeScript (Statically Typed Language)
  - TypeScript는 정적 타입을 지원해 코드 안정성과 유지보수성을 높이며, 팀 간 협업에서 오류를 줄이고 개발 효율성을 높일 수 있어 선택했습니다.
- Tailwind CSS (CSS Utility Framework)

  - Tailwind CSS는 유틸리티 클래스 기반의 CSS 프레임워크로, 빠르고 일관된 스타일링을 제공합니다. 효율적인 디자인 시스템 구축을 위해 선택했습니다.

- React Query (Data Fetching & Caching)
  - React Query는 서버 상태 관리와 데이터 캐싱을 위한 도구로, 복잡한 비동기 데이터 처리를 단순화하고 성능 최적화를 위해 선택했습니다.
- Zustand (State Management)
  - Zustand는 간결하고 사용하기 쉬운 상태 관리 라이브러리로, 간편하게 상태를 관리하고 성능을 최적화하기 위해 선택했습니다.
- React Hook Form (State Management)
  - React Hook Form은 폼 상태 관리를 간편하게 처리하며 성능 최적화에 뛰어난 라이브러리로, 복잡한 폼 처리와 유효성 검사를 효율적으로 관리하기 위해 선택했습니다.
- Zod (Validation)
  - Zod는 데이터와 폼의 유효성 검사를 간편하게 수행할 수 있는 라이브러리로, TypeScript와의 높은 호환성 덕분에 타입 안전성을 강화할 수 있습니다. 코드 가독성을 높이고, 복잡한 검증 로직을 쉽게 처리할 수 있어 선택했습니다.
- Framer Motion (Animation Library)

  - Framer Motion은 애니메이션과 트랜지션을 쉽게 구현할 수 있는 라이브러리로, 시각적 완성도를 높이고 사용자 경험을 개선하기 위해 선택했습니다.

    <br/>
    
    #### Testing
    
    - Jest (Testing Framework)
      - Jest는 JavaScript 테스팅 프레임워크로, 빠른 실행 속도와 다양한 테스트 기능을 지원해 효율적인 테스트 환경을 위해 선택했습니다.
        
    - React Testing Library (React Component Testing)
      - React Testing Library는 사용자 관점에서 컴포넌트를 테스트할 수 있고, 간단한 API를 제공하여 테스트 코드의 가독성과 유지 보수성을 높일 수 있어 선택했습니다.
        
    -  ㅇ
        
    <br/>
    
    #### Development Tools
    
    - Husky (Git Hooks)
      - Husky는 Git Hook 관리 도구로, 코드 커밋 시 자동으로 린트와 테스트를 실행하여 코드 품질을 유지하기 위해 선택했습니다. 코드 커밋 전에 오류를 방지하고, 지속적인 품질 관리를 가능하게 합니다.
        
    - Github Actions (CI/CD Automation)
      - GitHub Actions는 CI/CD 자동화 도구로, 빌드, 테스트, 배포 과정을 손쉽게 설정하고 관리할 수 있어 개발 효율성을 높이기 위해 선택했습니다. 지속적인 통합과 배포를 통해 코드 품질을 유지하며, 개발 프로세스를 최적화할 수 있습니다.
        
    - ESLint (Linting)
      - ESLint는 코드 품질을 유지하고 오류를 사전에 방지하기 위한 코드 린팅 도구입니다. 린팅 규칙을 설정하고 이를 강제함으로써 코드의 일관성과 더 나은 개발 환경을 제공합니다.
        
    - Prettier (Code Formatting)
      - Prettier는 일관된 코드 포맷팅을 자동으로 유지하여 팀 내 코드 스타일을 표준화하고, 가독성과 유지보수성을 향상시키는 도구입니다. 자동 포맷팅 기능으로 개발 환경을 효율적으로 관리할 수 있습니다.
        
    - Yarn (Package Manager)
      - Yarn은 빠르고 신뢰성 있는 패키지 관리를 제공하는 도구로, 의존성 충돌을 방지하고 빌드 속도를 최적화하기 위해 선택했습니다. 효율적인 패키지 관리와 신속한 설치 속도로 프로젝트의 빌드 시간을 단축할 수 있습니다.
        
    <br/>
    
    #### UI/UX
    
    - Storybook (UI Component Explorer)
      - Storybook은 UI 컴포넌트를 독립적으로 개발하고 테스트할 수 있는 도구로, 재사용성과 디자인 일관성을 유지하기 위해 선택했습니다. UI를 시각적으로 검증하고, 팀원 간의 피드백을 빠르게 받을 수 있습니다.
        
    - Chromatic (Storybook CI & Visual Testing)
      - Chromatic은 Storybook과 통합된 비주얼 테스트 도구로, UI 변경 사항을 자동으로 추적하여 버그를 방지하기 위해 선택했습니다. UI의 일관성을 유지하고 시각적으로 검증할 수 있어 효율적입니다.
        
    <br/>
    
    #### Monitoring
    
    - Sentry (Error Tracking & Monitoring)
      - Sentry는 실시간 에러 추적 및 모니터링 도구로, 오류를 즉시 감지하고 문제를 신속하게 해결하기 위해 선택했습니다. 사용자에게 안정적인 서비스를 제공하고, 배포 후 발생하는 예기치 않은 오류를 효과적으로 관리할 수 있습니다.
        
    <br/>
    
    #### Infrastructure
    
    - Firebase (Hosting, Storage)
      - Firebase는 배포 과정을 간소화하고 팀원 모두가 쉽게 배포할 수 있는 환경을 제공함으로써, 협업을 효율적으로 진행하기 위해 선택했습니다.
  </details>

<details>
  <summary><h3>컨벤션</h3></summary>

#### 커밋 컨벤션

| 타입 이름 | 설명                                                                                          |
| :-------- | :-------------------------------------------------------------------------------------------- |
| feat      | 새로운 기능 개발                                                                              |
| fix       | 버그 수정                                                                                     |
| refactor  | 코드 리팩토링                                                                                 |
| docs      | 문서 추가/수정                                                                                |
| style     | CSS 등 사용자 UI 디자인 변경 (코드 포맷 변경, 세미콜론 누락, 코드 수정 없는 경우)             |
| test      | 테스트 코드                                                                                   |
| chore     | 빌드 업무 수정, 패키지 매니저 수정, 패키지 관리자 구성 등 업데이트, Production Code 변경 없음 |

  <br>
  
  #### 네이밍 컨벤션
  
  ```
  컴포넌트: PascalCase
  스토리북, 테스트 포함한 폴더: kebab-case
  ```
  
  <br>
  
  #### ESLint
  
  ```
  {
    "extends": [
      "next/core-web-vitals",
      "plugin:storybook/recommended",
      "prettier",
      "plugin:@tanstack/eslint-plugin-query/recommended"
    ],
    "plugins": ["@tanstack/query"],
    "rules": {
      "react/no-unescaped-entities": 0
    }
  }
  
  ```
  
  <br>
  
  #### Prettier
  
  ```
  {
    "singleQuote": true,
    "semi": true,
    "useTabs": false,
    "tabWidth": 2,
    "trailingComma": "all",
    "printWidth": 80,
    "arrowParens": "avoid",
    "plugins": [
      "prettier-plugin-tailwindcss"
    ]
  }
  ```
</details>

<br>
<br>

## <span id='architecture'>4. 아키텍처</span>

<p align="center">
  <img width="100%" alt="서비스 아키텍처 이미지" src="">
</p>

<br>
<br>

## <span id='feature'>5. 주요 기능</span>

- 모임 생성
- 모임 참여
- 리뷰 작성
- 모임 찜하기
- 로그인/회원가입
- 모임 조회 (+필터링)
- 비밀번호 찾기/변경

<br>
<br>

## <span id='screen'>6. 화면 구성</span>

<!-- |                                                    로그인 페이지                                                     |                                                   회원가입 페이지                                                    |                                                 비밀번호 찾기 페이지                                                 |                                                 비밀번호 변경 페이지                                                 |
| :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: |
| <img height="500" alt="image" src="https://github.com/user-attachments/assets/e26706d6-a76c-454c-90f9-5c09f187d393"> | <img height="500" alt="image" src="https://github.com/user-attachments/assets/7707c966-cf76-4915-8d9b-d66750595a20"> | <img height="500" alt="image" src="https://github.com/user-attachments/assets/33238cb1-f730-4ffd-88f7-93c55696c42a"> | <img height="500" alt="image" src="https://github.com/user-attachments/assets/06e15b2b-e618-4f84-81d3-6bc5009eb732"> |

|                                                모임 찾기 페이지 (홈)                                                 |                                             모임 찾기 페이지 - 모임 생성                                             |                                                         GNB                                                          |
| :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: |
| <img height="500" alt="image" src="https://github.com/user-attachments/assets/e48c1106-b5e2-4b80-8237-68c1c28b5e13"> | <img height="500" alt="image" src="https://github.com/user-attachments/assets/41ce3387-c133-44d1-b4eb-699f93a2e50a"> | <img height="500" alt="image" src="https://github.com/user-attachments/assets/de89d8c3-c186-4c02-9dd1-1e6f6561f6c3"> |

|                                                   모임 상세 페이지                                                   |                                                   찜한 모임 페이지                                                   |                                                   모든 리뷰 페이지                                                   |                                                     마이 페이지                                                      |
| :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: |
| <img height="500" alt="image" src="https://github.com/user-attachments/assets/202e2ef6-865c-4919-b14e-b35e1f123440"> | <img height="500" alt="image" src="https://github.com/user-attachments/assets/d663e3c6-a5cb-42b5-9411-d361a8ddee11"> | <img height="500" alt="image" src="https://github.com/user-attachments/assets/7d0143a5-3c4d-42ba-abaf-0da6e1af326d"> | <img height="500" alt="image" src="https://github.com/user-attachments/assets/711d8c99-795b-42ce-8ed7-2ec394118b9d"> | -->

<br>
<br>

## <span id='trouble'>7. 트러블 슈팅</span>

<!-- <details>
  <summary><b>예시 제목</b></summary>
  <br/>
ex)
- withCredentials
  - 크로스 도메인 요청에서 쿠키와 인증 정보를 전송하는 옵션
- withCredentials: true
  - 쿠키 전송, 인증 헤더 포함, 세션 유지, 서버 측에서도 CORS 설정 필요
- withCredentials: false - 쿠키 미전송, 인증 정보 제외, 세션 미유지, 보안 강화
</details> -->

<br>
<br>

## <span id='branch'>8. Git Branch 전략</span>

### gitFlow Development With Jira

#### 장점

- 브랜치 구조가 master, develop, feature, release, hotfix로 나뉘어서 역할이 뚜렷함
- 버전관리가 깔끔해짐
- 코드의 안정성을 유지
- 팀원 간 작업 충돌이 줄고 업무분담이 쉬움

#### 단점

- 브랜치 간 병합 작업이 많아져 실수로 꼬일 수 있음.

#### 팀 사용 예시

- feature 브랜치를 생성하고 dev에 merge하는 방식 (필요 시 feature 브랜치 사용 가능)
- 테스트 자동화
- 코드 리뷰
- 2명 이상 PR 승인 시 merge 가능
- PR template 사용 (작업한 기능에 대한 상세 설명)

<br>
<br>

## <span id='directory'>9. 폴더 구조</span>
