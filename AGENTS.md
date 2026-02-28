# AI Agent Guide for My REST App

이 파일은 코딩 에이전트가 이 프로젝트의 맥락을 이해하고 일관성 있게 작업을 수행할 수 있도록 돕기 위한 지침서이다.

## 프로젝트 개요
- **목적**: REST API 서버(Spring Boot 기반)에서 제공하는 OpenAPI 명세를 바탕으로 한 현대적인 프론트엔드 웹 서비스 구축.

## 규칙:
- 작업은 현재 디렉토리에서 수행한다.
- 변경/생성/삭제한 파일 목록을 매 단계마다 요약해라.
- 실행해야 하는 커맨드는 정확히 제시하되, 실제 실행 여부는 사용자 환경에 맡긴다.
- 작업을 완료할 때 마다 작업 내용의 정상 동작을 확인(검증)한 후, 정의된 형식에 맞춰 `git commit` 및 `git push`를 수행한다.
- Git Commit 메시지 형식: `./docs/git-message-format.md`를 엄격히 준수한다.
- OpenAPI 문서는 http://localhost:8080/v3/api-docs 에서 가져온다는 전제로 작업하라. (접속 실패 시에도 프로젝트 골격은 먼저 만들고, 스키마 연동 부분은 ‘추후 재시도’ 형태로 진행하라.)
- REST API 요청: 클라이언트(브라우저)에서 REST API 서버(`http://localhost:8080`)로 직접 요청을 보낸다. 프론트엔드 서버에 프록시를 구성하지 마라.
- Fetch API만 사용하고, axios 등 외부 HTTP 라이브러리는 사용하지 마라.
- 인증은 Bearer JWT, Access/Refresh 토큰을 localStorage에 저장한다.
- 환경변수로 API Base URL을 분리한다(.env.development / .env.production).
- TypeScript strict 모드 기준으로 작성한다.
- 결과물은 Vite latest + React + TypeScript + SPA 구조로 구성한다.