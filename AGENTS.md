# AI Agent Guide for My REST App

이 파일은 코딩 에이전트가 이 프로젝트의 맥락을 이해하고 일관성 있게 작업을 수행할 수 있도록 돕기 위한 지침서입니다.

## 🚀 프로젝트 개요
- **목적**: REST API 서버(Spring Boot 기반)에서 제공하는 OpenAPI 명세를 바탕으로 한 현대적인 프론트엔드 웹 서비스 구축.
- **아키텍처**: Node.js + Express (프론트엔드 서버) + 정적 HTML 페이지 기반의 MPA(Multi-Page Application) 구조.

## 🛠 기술 스택 및 요구사항
- **Runtime**: Node.js (Express 5+)
- **Frontend**: 바닐라 JavaScript (ES6+), HTML5, CSS3 (Vanilla CSS)
- **API 통신**: Fetch API (AJAX)
- **인증 방식**: JWT (Bearer Token)
  - `access_token` 및 `refresh_token` 사용
  - 토큰 저장소: `localStorage`
  - 401 에러 발생 시 자동 토큰 갱신(Refresh) 로직 필수
- **환경 관리**: `.env` 파일을 통해 개발(DEV) 및 운영(PROD) API URL 관리

## 커밋 컨벤션 (Docs & Commit Convention)
- **Git Commit**: `docs/git-message-format.md`를 엄격히 준수한다.
  - 형식: `<type>(<scope>): <subject>`
  - Type: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`, `perf`, `ci`, `revert`.
  - Subject: 50자 이내 명령문 ("~추가", "~변경").
  - Body: 무엇을(what), 왜(why) 변경했는지를 중심으로 작성한다.
  - **작업 완료 시**: 각 작업을 마칠 때마다 **작업 내용의 정상 동작을 확인(검증)한 후**, 정의된 형식에 맞춰 `git commit` 및 `git push`를 수행한다.

## ⚠️ 에이전트 주의 사항
- **Express 5 관련**: `server.js`에서 와일드카드 라우팅 설정 시 `app.get('*any', ...)`와 같이 파라미터 이름을 지정해야 합니다.
- **디자인 철학**: 단순히 동작하는 기능뿐만 아니라, 사용자에게 '와우'를 줄 수 있는 프리미엄한 UI/UX(Micro-animations, Clean Layout)를 지향합니다.
- **직접 통신**: 프론트엔드 서버를 통한 프록시가 아닌, 클라이언트(브라우저)에서 REST API 서버(`http://localhost:8080`)로 직접 요청을 보냅니다.
